import assert from 'node:assert/strict';
import { appendFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { getReleasePlan } from '@changesets/get-release-plan';
import { packages } from './release-metadata.mjs';

export function parseConsumerGuidance(id, text) {
  const sections = /^([\s\S]+?)\n## Consumer action\n([^\n]+)\n\s*\n## Migration notes\n([\s\S]+)$/.exec(text.trim());
  assert(sections, `${id}: include a summary, ## Consumer action and ## Migration notes`);
  const [, summary, action, migration] = sections.map(value => value.trim());
  assert(summary && migration, `${id}: summary and migration notes must not be empty`);
  assert(['No consumer action required', 'Action required'].includes(action), `${id}: invalid consumer action`);
  assert(!/\bTODO\b|\bTBD\b/i.test(text), `${id}: replace placeholder guidance`);
  return { summary, action, migration };
}

export async function readChangesetPlan(directory) {
  const plan = await getReleasePlan(directory);
  const guidance = new Map();
  for (const changeset of plan.changesets) {
    assert(changeset.releases.length, `${changeset.id}: empty changesets are not release intent`);
    for (const release of changeset.releases) {
      assert(packages.some(pkg => pkg.name === release.name), `${changeset.id}: unsupported package ${release.name}`);
      assert(['patch', 'minor', 'major'].includes(release.type), `${changeset.id}: use patch, minor or major for ${release.name}`);
    }
    guidance.set(changeset.id, parseConsumerGuidance(changeset.id, changeset.summary));
  }
  const releases = plan.releases.filter(release => release.type !== 'none').map(release => {
    const pkg = packages.find(item => item.name === release.name);
    assert(pkg, `Unsupported release package: ${release.name}`);
    assert(release.changesets.length, `${release.name}: add explicit release intent for dependency changes`);
    return { ...release, ...pkg, guidance: release.changesets.map(id => guidance.get(id)) };
  });
  return { ...plan, releases };
}

export function releasePRBody(plan) {
  const scope = plan.releases.map(release => {
    const details = release.guidance.map(item => `${item.summary}\n\nConsumer action: ${item.action}.\n\n${item.migration}`).join('\n\n');
    return `### ${release.name} ${release.newVersion}\n\n${details}`;
  }).join('\n\n');
  return `## Description\n\nPrepare the next package releases from reviewed changesets. Check the versions, summaries, upgrade guidance and publication date before merging. Merging this PR starts automatic GitHub publication when enabled. Otherwise use the documented tag-triggered workflow.\n\n## Release scope\n\n${scope}\n\n## Validation\n\n- Changesets release plan and generated metadata checked.\n- Release-tooling lint, tests and documentation checks passed.\n- Required PR checks must pass before merge, including the staged external-consumer artifacts.\n`;
}

export function createReleaseRecord(plan, baseSha) {
  assert(/^[a-f0-9]{40}$/.test(baseSha), 'Release plan needs an exact base SHA');
  return {
    schemaVersion: 1,
    baseSha,
    changesets: plan.changesets.map(item => item.id).sort(),
    releases: plan.releases.map(release => ({ name: release.name, version: release.newVersion, tag: `${release.prefix}${release.newVersion}` }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const plan = await readChangesetPlan(process.cwd());
  process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `has_changesets=${plan.releases.length > 0}\n`);
  }
  if (process.env.RELEASE_PR_BODY_FILE && plan.releases.length) {
    writeFileSync(process.env.RELEASE_PR_BODY_FILE, releasePRBody(plan));
  }
}
