import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generatedFileChanges } from './upsert-release-pr.mjs';

const script = fileURLToPath(new URL('./upsert-release-pr.mjs', import.meta.url));

function fixture(t) {
  const directory = mkdtempSync(resolve(tmpdir(), 'ofh-release-pr-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const write = (path, contents) => {
    mkdirSync(resolve(directory, path, '..'), { recursive: true });
    writeFileSync(resolve(directory, path), contents);
  };
  write('.changeset/example.md', '---\n"@ourfuturehealth/toolkit": patch\n---\n\nFix Header.\n');
  write('packages/toolkit/package.json', '{"name":"@ourfuturehealth/toolkit","version":"4.26.1"}\n');
  write('packages/react-components/package.json', '{"name":"@ourfuturehealth/react-components","version":"0.26.1"}\n');
  write('pnpm-lock.yaml', 'lockfileVersion: 9.0\n');
  write('CHANGELOG.md', '# Changelog\n');
  write('UPGRADING.md', '# Upgrading\n');
  const git = (...args) => execFileSync('git', args, { cwd: directory, encoding: 'utf8' }).trim();
  git('init', '-b', 'main');
  git('config', 'user.email', 'release-tests@example.invalid');
  git('config', 'user.name', 'Release tests');
  git('add', '.');
  git('commit', '-m', 'Fixture baseline');
  const base = git('rev-parse', 'HEAD');
  return { directory, write, base };
}

function mockGitHub(project) {
  // Git runs in the fixture repository; only remote GitHub responses are faked.
  const bin = resolve(project.directory, 'bin');
  mkdirSync(bin);
  const executable = resolve(bin, 'gh');
  writeFileSync(executable, `#!/usr/bin/env node
const { appendFileSync, readFileSync } = require('node:fs');
const args = process.argv.slice(2);
const input = args.includes('--input') ? readFileSync(0, 'utf8') : '';
appendFileSync(process.env.MOCK_GH_LOG, JSON.stringify({ args, input }) + '\\n');
const path = args.find(value => value.startsWith('repos/')) || '';
if (args[0] === 'api' && args[1] === 'graphql') {
  process.stdout.write(JSON.stringify({ data: { createCommitOnBranch: { commit: { oid: 'a'.repeat(40) } } } }));
} else if (path.includes('/pulls?')) {
  const pull = process.env.MOCK_EXISTING_PR === 'true'
    ? [{ number: 42, base: { ref: 'main' }, user: { login: 'release-app[bot]' } }] : [];
  process.stdout.write(JSON.stringify(pull));
} else if (path.endsWith('/git/ref/heads/changeset-release/main') && process.env.MOCK_EXISTING_PR !== 'true') {
  process.stderr.write('gh: Not Found (HTTP 404)\\n');
  process.exitCode = 1;
} else {
  process.stdout.write('{}');
}
`);
  chmodSync(executable, 0o755);
  const log = resolve(project.directory, 'gh.log');
  return { bin, log };
}

for (const existing of [false, true]) {
  test(`the release App ${existing ? 'updates' : 'creates'} one PR through GitHub's signed-commit API`, t => {
    const project = fixture(t);
    project.write('CHANGELOG.md', '# Changelog\n\nNew release.\n');
    rmSync(resolve(project.directory, '.changeset/example.md'));
    const mock = mockGitHub(project);
    project.write('body.md', 'Reviewed release notes.\n');
    execFileSync(process.execPath, [script], {
      cwd: project.directory,
      env: {
        ...process.env,
        PATH: `${mock.bin}:${process.env.PATH}`,
        MOCK_GH_LOG: mock.log,
        MOCK_EXISTING_PR: String(existing),
        GITHUB_REPOSITORY: 'ourfuturehealth/design-system-toolkit',
        GITHUB_SHA: project.base,
        GITHUB_RUN_ID: '123',
        GITHUB_RUN_ATTEMPT: '1',
        RELEASE_APP_SLUG: 'release-app',
        RELEASE_PR_BODY_FILE: resolve(project.directory, 'body.md'),
        GH_TOKEN: 'synthetic-test-token',
      },
    });
    const calls = readFileSync(mock.log, 'utf8').trim().split('\n').map(JSON.parse);
    const commit = calls.find(call => call.args[1] === 'graphql');
    const files = JSON.parse(commit.input).variables.input.fileChanges;
    assert.deepEqual(files.deletions, [{ path: '.changeset/example.md' }]);
    assert.equal(Buffer.from(files.additions[0].contents, 'base64').toString(), '# Changelog\n\nNew release.\n');
    assert(calls.some(call => call.args[0] === 'pr' && call.args[1] === (existing ? 'edit' : 'create')));
    assert(calls.some(call => call.args.includes('DELETE') && call.args.some(value => value.includes('/staging-123-1'))));
  });
}

test('no generated changes stop before calling GitHub', t => {
  const project = fixture(t);
  assert.throws(() => generatedFileChanges(project.directory), /produced no release PR changes/);
});
