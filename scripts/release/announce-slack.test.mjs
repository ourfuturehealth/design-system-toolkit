import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { renderAnnouncementPayload, submitAnnouncement, validatePublicationState, validatePublisher } from './announce-slack.mjs';

const sha = 'a'.repeat(40);
const repository = 'example-org/design-system';
const context = { repository, prNumber: 5, sha };
const run = {
  id: 123,
  name: 'Publish merged release',
  path: '.github/workflows/publish-release.yml',
  repository: { full_name: repository },
  head_repository: { full_name: repository },
  event: 'pull_request',
  conclusion: 'success',
  run_attempt: 1,
};
const state = {
  ...context,
  completed: true,
  releases: [{ tag: 'toolkit-v4.27.0', status: 'published' }, { tag: 'react-v1.1.0', status: 'published' }],
};
const record = {
  schemaVersion: 1,
  releases: [
    { name: '@ourfuturehealth/react-components', version: '1.1.0', tag: 'react-v1.1.0' },
    { name: '@ourfuturehealth/toolkit', version: '4.27.0', tag: 'toolkit-v4.27.0' },
  ],
};
const changelog = `### 2026-10-16
#### @ourfuturehealth/toolkit 4.27.0 (\`toolkit-v4.27.0\`)
- Add the Example Widget macro.
- Add a success variant.

#### @ourfuturehealth/react-components 1.1.0 (\`react-v1.1.0\`)
- Add the Example Widget component.
- Add a success variant.

### 2026-10-15
`;

test('only a successful run of the expected publisher is eligible', () => {
  validatePublisher(run, repository);
  assert.throws(() => validatePublisher({ ...run, path: '.github/workflows/other.yml' }, repository), /workflow path/);
  assert.throws(() => validatePublisher({ ...run, conclusion: 'failure' }, repository), /successful/);
  assert.throws(() => validatePublisher({ ...run, head_repository: { full_name: 'other/fork' } }, repository), /this repository/);
});

test('only a fully verified batch at the merged release SHA is eligible', () => {
  validatePublicationState(state, context);
  assert.throws(() => validatePublicationState({ ...state, completed: false }, context), /fully verified/);
  assert.throws(() => validatePublicationState({ ...state, sha: 'b'.repeat(40) }, context), /SHA differs/);
  assert.throws(() => validatePublicationState({ ...state, releases: [{ tag: 'react-v1.1.0', status: 'draft-verified' }] }, context), /not verified public/);
});

test('one payload combines both package summaries with separate links to the published SHA', () => {
  const payload = renderAnnouncementPayload(state, record, changelog);
  assert.equal(payload.release_type, 'both');
  assert.match(payload.announcement, /📣 Design System release: toolkit-v4\.27\.0 \+ react-v1\.1\.0/);
  assert.match(payload.announcement, /Example Widget macro/);
  const repo = `https://github.com/${repository}`;
  assert(payload.announcement.includes('@ourfuturehealth/toolkit 4.27.0 (toolkit-v4.27.0)'));
  assert(payload.announcement.includes('@ourfuturehealth/react-components 1.1.0 (react-v1.1.0)'));
  assert.doesNotMatch(payload.announcement, /https?:\/\/|<[^>]+\|[^>]+>/);
  assert.equal(payload.changelog_url, `${repo}/blob/${sha}/CHANGELOG.md`);
  assert.equal(payload.upgrading_url, `${repo}/blob/${sha}/UPGRADING.md`);
  assert.equal(payload.toolkit_release_url, `${repo}/releases/tag/toolkit-v4.27.0`);
  assert.equal(payload.react_release_url, `${repo}/releases/tag/react-v1.1.0`);
});

test('package-only releases select the matching branch and include every configured webhook field', () => {
  const repo = `https://github.com/${repository}`;
  const reactState = { ...state, releases: [state.releases[1]] };
  const reactRecord = { ...record, releases: [record.releases[0]] };
  const reactPayload = renderAnnouncementPayload(reactState, reactRecord, changelog);
  assert.equal(reactPayload.release_type, 'react');
  assert.match(reactPayload.announcement, /release: react-v1\.1\.0/);
  assert.doesNotMatch(reactPayload.announcement, /toolkit-v4\.27\.0/);
  assert.equal(reactPayload.toolkit_release_url, `${repo}/releases`);
  assert.equal(reactPayload.react_release_url, `${repo}/releases/tag/react-v1.1.0`);

  const toolkitState = { ...state, releases: [state.releases[0]] };
  const toolkitRecord = { ...record, releases: [record.releases[1]] };
  const toolkitPayload = renderAnnouncementPayload(toolkitState, toolkitRecord, changelog);
  assert.equal(toolkitPayload.release_type, 'toolkit');
  assert.match(toolkitPayload.announcement, /release: toolkit-v4\.27\.0/);
  assert.doesNotMatch(toolkitPayload.announcement, /react-v1\.1\.0/);
  assert.equal(toolkitPayload.toolkit_release_url, `${repo}/releases/tag/toolkit-v4.27.0`);
  assert.equal(toolkitPayload.react_release_url, `${repo}/releases`);
  for (const payload of [reactPayload, toolkitPayload]) {
    assert.deepEqual(Object.keys(payload), ['announcement', 'release_type', 'changelog_url', 'upgrading_url',
      'toolkit_release_url', 'react_release_url']);
  }
});

test('mismatched release record or missing summary blocks an announcement', () => {
  assert.throws(() => renderAnnouncementPayload(state, { ...record, releases: [record.releases[0]] }, changelog), /record differs/);
  assert.throws(() => renderAnnouncementPayload(state, record, ''), /Missing changelog entry/);
  assert.throws(() => renderAnnouncementPayload(state, { ...record, releases: [record.releases[1], record.releases[1]] }, changelog), /One release per package/);
});

test('a successful POST records acceptance without writing the webhook URL or message', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'ofh-slack-test-'));
  try {
    const statePath = join(directory, 'submission.json');
    let posted;
    const payload = renderAnnouncementPayload(state, record, changelog);
    await submitAnnouncement(payload, 'https://hooks.slack.com/triggers/example-secret', statePath,
      { repository, sha }, async (_url, request) => {
        posted = JSON.parse(request.body);
        return { ok: true, status: 200 };
      });
    assert.deepEqual(posted, payload);
    const saved = readFileSync(statePath, 'utf8');
    assert.equal(JSON.parse(saved).status, 'accepted');
    assert(!saved.includes('example-secret'));
    assert(!saved.includes(payload.announcement));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test('a rejected or ambiguous POST records its outcome and never retries', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'ofh-slack-test-'));
  try {
    const statePath = join(directory, 'submission.json');
    let calls = 0;
    const payload = renderAnnouncementPayload(state, record, changelog);
    await assert.rejects(submitAnnouncement(payload, 'https://hooks.slack.com/triggers/example-secret', statePath,
      { repository, sha }, async () => {
        calls += 1;
        return { ok: false, status: 403 };
      }), /HTTP 403/);
    assert.equal(calls, 1);
    assert.equal(JSON.parse(readFileSync(statePath, 'utf8')).status, 'rejected');
    await assert.rejects(submitAnnouncement(payload, 'https://hooks.slack.com/triggers/example-secret', statePath,
      { repository, sha }, async () => {
        calls += 1;
        throw new Error('Connection lost');
      }), /outcome is unknown/);
    assert.equal(calls, 2);
    assert.equal(JSON.parse(readFileSync(statePath, 'utf8')).status, 'unknown');
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
