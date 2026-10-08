import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { packages, parseChangelog, upgradeDecision, validateVersion } from './release-metadata.mjs';

const [baseRef, headRef] = process.argv.slice(2);
assert(baseRef && headRef, 'Usage: validate-package-release-metadata.sh <base-ref> <head-ref>');
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const readAt = (ref, path) => ref === 'WORKTREE' ? readFileSync(path, 'utf8') : git('show', `${ref}:${path}`);
git('rev-parse', '--verify', `${baseRef}^{commit}`);
if (headRef !== 'WORKTREE') git('rev-parse', '--verify', `${headRef}^{commit}`);
const files = git('diff', '--name-only', baseRef, ...(headRef === 'WORKTREE' ? [] : [headRef])).split('\n');
const changelog = parseChangelog(readAt(headRef, 'CHANGELOG.md'));
const guide = readAt(headRef, 'UPGRADING.md');
const tags = git('tag', '--list').split('\n');
if (process.env.PUBLISHED_RELEASE_TAGS_FILE) {
  tags.push(...readFileSync(process.env.PUBLISHED_RELEASE_TAGS_FILE, 'utf8').trim().split('\n'));
}
for (const pkg of packages) {
  const directory = pkg.manifest.replace('/package.json', '/');
  const base = JSON.parse(readAt(baseRef, pkg.manifest)).version;
  const head = JSON.parse(readAt(headRef, pkg.manifest)).version;
  const sourceChanged = files.some(path => path.startsWith(directory)
    && !/\.(test|spec|stories)\.[^.]+$|\/README\.md$/.test(path)
    && path !== pkg.manifest);
  if (!sourceChanged && base === head) continue;
  const previousVersions = [base, ...tags.filter(tag => tag.startsWith(pkg.prefix)).map(tag => tag.slice(pkg.prefix.length))];
  validateVersion(head, previousVersions);
  const tag = `${pkg.prefix}${head}`;
  assert(changelog.has(tag), `Missing changelog entry for ${tag}`);
  upgradeDecision(guide, pkg.name, head);
  process.stdout.write(`${pkg.name}: ${base} -> ${head}, above existing release versions, with changelog and upgrade guidance\n`);
}
process.stdout.write('Package release metadata validation passed.\n');
