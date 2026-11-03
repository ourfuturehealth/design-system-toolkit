import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gh } from './github-release.mjs';
import { resolvePublicationContext } from './resolve-publication-context.mjs';

const publisherName = 'Publish merged release';
const publisherPath = '.github/workflows/publish-release.yml';
const packages = [
  { name: '@ourfuturehealth/toolkit', prefix: 'toolkit-v', manifest: 'packages/toolkit/package.json' },
  { name: '@ourfuturehealth/react-components', prefix: 'react-v', manifest: 'packages/react-components/package.json' },
];

export function validatePublisher(run, repository) {
  assert(Number.isSafeInteger(run.id) && run.id > 0, 'A publication run ID is required');
  assert.equal(run.name, publisherName, 'Announcement source must be the publication workflow');
  assert.equal(run.path, publisherPath, 'Unexpected publication workflow path');
  assert.equal(run.repository?.full_name, repository, 'Publication run belongs to another repository');
  assert.equal(run.head_repository?.full_name, repository, 'Publication run must use this repository');
  assert(['pull_request', 'workflow_dispatch'].includes(run.event), 'Unexpected publication event');
  assert.equal(run.conclusion, 'success', 'Only a successful publication run can announce');
  assert(Number.isSafeInteger(run.run_attempt) && run.run_attempt > 0, 'Publication attempt is required');
}

export function validatePublicationState(state, context) {
  assert.equal(state.completed, true, 'The release batch was not fully verified');
  assert.equal(state.repository, context.repository, 'Publication state repository differs from the merged PR');
  assert.equal(state.prNumber, context.prNumber, 'Publication state PR differs from the merged PR');
  assert.equal(state.sha, context.sha, 'Publication state SHA differs from the merged PR');
  assert(Array.isArray(state.releases) && state.releases.length > 0 && state.releases.length <= packages.length,
    'Publication state needs one or two releases');
  assert.equal(new Set(state.releases.map(release => release.tag)).size, state.releases.length, 'Duplicate release tag');
  for (const release of state.releases) {
    assert(packages.some(pkg => release.tag.startsWith(pkg.prefix)), `Unsupported release tag: ${release.tag}`);
    assert(['published', 'already-public'].includes(release.status), `${release.tag} was not verified public`);
  }
}

function changelogSummary(changelog, release) {
  const heading = `#### ${release.name} ${release.version} (\`${release.tag}\`)`;
  const lines = changelog.split('\n');
  const start = lines.indexOf(heading);
  assert(start >= 0, `Missing changelog entry for ${release.tag}`);
  const summary = [];
  for (const line of lines.slice(start + 1)) {
    if (/^#{2,4} /.test(line)) break;
    if (line.startsWith('- ')) summary.push(line.slice(2).trim());
  }
  assert(summary.length > 0, `Empty changelog entry for ${release.tag}`);
  return summary;
}

export function renderAnnouncementPayload(state, record, changelog) {
  assert.equal(record.schemaVersion, 1, 'Generated release record required');
  assert.equal(record.releases.length, state.releases.length, 'Release record differs from the verified batch');
  const releases = packages.flatMap(pkg => record.releases.filter(release => release.name === pkg.name));
  assert.equal(releases.length, record.releases.length, 'Release record contains an unsupported package');
  assert.equal(new Set(releases.map(release => release.name)).size, releases.length, 'One release per package required');
  assert.deepEqual(releases.map(release => release.tag).sort(), state.releases.map(release => release.tag).sort(),
    'Release record tags differ from the verified batch');
  const repo = `https://github.com/${state.repository}`;
  const lines = [`📣 Design System release: ${releases.map(release => release.tag).join(' + ')}`, '', 'TL;DR'];
  for (const release of releases) {
    const pkg = packages.find(item => item.name === release.name);
    assert.equal(release.tag, `${pkg.prefix}${release.version}`, 'Release tag differs from package version');
    lines.push(`• ${release.name} ${release.version} (${release.tag})`);
    for (const summary of changelogSummary(changelog, release)) lines.push(`  - ${summary}`);
  }
  const releasePage = `${repo}/releases`;
  const toolkitRelease = releases.find(release => release.name === packages[0].name);
  const reactRelease = releases.find(release => release.name === packages[1].name);
  let releaseType = 'both';
  if (releases.length === 1) releaseType = toolkitRelease ? 'toolkit' : 'react';
  return {
    announcement: lines.join('\n'),
    release_type: releaseType,
    changelog_url: `${repo}/blob/${state.sha}/CHANGELOG.md`,
    upgrading_url: `${repo}/blob/${state.sha}/UPGRADING.md`,
    toolkit_release_url: toolkitRelease ? `${repo}/releases/tag/${toolkitRelease.tag}` : releasePage,
    react_release_url: reactRelease ? `${repo}/releases/tag/${reactRelease.tag}` : releasePage,
  };
}

export async function submitAnnouncement(payload, url, statePath, details, fetchImpl = fetch) {
  assert(typeof url === 'string' && url.length > 0, 'Slack workflow secret is missing');
  let endpoint;
  try {
    endpoint = new URL(url);
  } catch {
    throw new Error('Slack workflow URL is invalid');
  }
  assert.equal(endpoint.protocol, 'https:', 'Slack workflow URL must use HTTPS');
  assert.equal(endpoint.hostname, 'hooks.slack.com', 'Unexpected Slack workflow host');
  assert(endpoint.pathname.startsWith('/triggers/'), 'Expected a Slack workflow trigger URL');
  const submission = { ...details, status: 'submitting', submittedAt: new Date().toISOString() };
  const save = () => writeFileSync(statePath, `${JSON.stringify(submission, null, 2)}\n`);
  save();
  let response;
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    submission.status = 'unknown';
    save();
    throw new Error('Slack submission outcome is unknown. Inspect the release channel before any manual retry.');
  }
  submission.httpStatus = response.status;
  submission.status = response.ok ? 'accepted' : 'rejected';
  save();
  assert(response.ok, `Slack rejected the announcement with HTTP ${response.status}`);
  process.stdout.write('Slack accepted one combined release announcement. Check the release channel for delivery.\n');
}

function prepare() {
  assert.equal(process.env.GITHUB_RUN_ATTEMPT, '1', 'Do not blindly rerun announcements; inspect the channel and submission state first');
  const repository = process.env.GITHUB_REPOSITORY;
  const runId = Number(process.env.PUBLICATION_RUN_ID);
  assert(Number.isSafeInteger(runId) && runId > 0, 'Valid publication run ID required');
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  if (process.env.GITHUB_EVENT_NAME === 'workflow_run') {
    assert.equal(event.action, 'completed', 'Announcement requires a completed workflow');
    assert.equal(event.workflow_run?.id, runId, 'Publication run differs from the trigger');
  } else {
    assert.equal(process.env.GITHUB_EVENT_NAME, 'workflow_dispatch', 'Unsupported announcement trigger');
    assert.equal(String(event.inputs?.inspected_and_approved), 'true', 'Manual announcement needs explicit inspection and approval');
  }
  const run = JSON.parse(gh('api', `repos/${repository}/actions/runs/${runId}`));
  validatePublisher(run, repository);
  const artifacts = JSON.parse(gh('api', `repos/${repository}/actions/runs/${runId}/artifacts`)).artifacts;
  const expectedName = new RegExp(`^publication-state-[a-f0-9]{40}-${run.run_attempt}$`);
  const matches = artifacts.filter(artifact => expectedName.test(artifact.name) && !artifact.expired);
  assert.equal(matches.length, 1, 'Expected one unexpired publication-state artifact from the successful run');
  const directory = join(process.env.RUNNER_TEMP, 'verified-publication-state');
  mkdirSync(directory, { recursive: true });
  gh('run', 'download', String(runId), '--repo', repository, '--name', matches[0].name, '--dir', directory);
  const statePath = join(directory, 'publication-state.json');
  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  assert.equal(matches[0].name, `publication-state-${state.sha}-${run.run_attempt}`, 'Artifact name differs from publication SHA');
  const pull = JSON.parse(gh('api', `repos/${repository}/pulls/${state.prNumber}`));
  const context = resolvePublicationContext(pull, repository, process.env.RELEASE_APP_SLUG);
  validatePublicationState(state, context);
  appendFileSync(process.env.GITHUB_OUTPUT, `release_sha=${state.sha}\nstate_path=${statePath}\n`);
  process.stdout.write(`Verified completed publication run ${runId} for release PR #${state.prNumber}.\n`);
}

async function send(statePath, sourceDirectory) {
  const state = JSON.parse(readFileSync(statePath, 'utf8'));
  assert.equal(execFileSync('git', ['-C', sourceDirectory, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
    state.sha, 'Announcement source checkout differs from the published SHA');
  const record = JSON.parse(readFileSync(join(sourceDirectory, '.changeset/release.json'), 'utf8'));
  const payload = renderAnnouncementPayload(state, record, readFileSync(join(sourceDirectory, 'CHANGELOG.md'), 'utf8'));
  for (const release of record.releases) {
    const pkg = packages.find(item => item.name === release.name);
    assert(pkg, 'Unsupported release package');
    const manifest = JSON.parse(readFileSync(join(sourceDirectory, pkg.manifest), 'utf8'));
    assert.equal(manifest.version, release.version, `${release.tag} differs from its manifest`);
    const refs = JSON.parse(gh('api', `repos/${state.repository}/git/matching-refs/tags/${release.tag}`))
      .filter(ref => ref.ref === `refs/tags/${release.tag}`);
    assert.equal(refs.length, 1, `${release.tag} must have one exact tag reference`);
    assert.equal(refs[0].object.type, 'commit', 'Release tag must point directly to a commit');
    assert.equal(refs[0].object.sha, state.sha, `${release.tag} differs from the published SHA`);
    const published = JSON.parse(gh('api', `repos/${state.repository}/releases/tags/${release.tag}`));
    assert.equal(published.draft, false, `${release.tag} is not public`);
  }
  await submitAnnouncement(payload, process.env.SLACK_RELEASE_WORKFLOW_WEBHOOK_URL,
    process.env.SLACK_ANNOUNCEMENT_STATE, { repository: state.repository, sha: state.sha,
      publicationRunId: Number(process.env.PUBLICATION_RUN_ID), tags: record.releases.map(release => release.tag) });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [mode, ...args] = process.argv.slice(2);
  if (mode === 'prepare') prepare();
  else if (mode === 'send') {
    assert.equal(args.length, 2, 'Usage: announce-slack.mjs send <state.json> <source-directory>');
    await send(...args);
  } else throw new Error('Usage: announce-slack.mjs prepare|send');
}
