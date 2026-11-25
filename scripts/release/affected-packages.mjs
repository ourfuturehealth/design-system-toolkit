import { execFileSync } from 'node:child_process';
import { packages } from './release-metadata.mjs';

const react = '@ourfuturehealth/react-components';
const ignored = /\.(test|spec|stories)\.[^.]+$|\/README\.md$/;

// React compiles these toolkit inputs into its published CSS and JavaScript.
function isSharedToolkitInput(path) {
  return /^packages\/toolkit\/(?:components|core)\/.*\.s[ac]ss$/.test(path)
    || path === 'packages/toolkit/ofh.scss'
    || /^packages\/toolkit\/assets\/(?:icons|logos|tile-pattern)\/.*\.svg$/.test(path)
    || path === 'packages/toolkit/scripts/build-icon-sprite.js';
}

export function affectedPackages(files) {
  const affected = new Map(packages.map(pkg => [pkg.name, []]));
  for (const path of new Set(files.filter(Boolean))) {
    if (ignored.test(path)) continue;
    for (const pkg of packages) {
      if (path.startsWith(pkg.manifest.replace('/package.json', '/'))) affected.get(pkg.name).push(path);
    }
    if (isSharedToolkitInput(path)) affected.get(react).push(path);
  }
  return affected;
}

export function changedFiles(base, head) {
  const gitPaths = (...args) => execFileSync('git', args, { encoding: 'utf8' }).split('\0').filter(Boolean);
  // Disable rename detection so moves out of a shared directory include the old path.
  const diff = (...refs) => gitPaths('diff', '--name-only', '--no-renames', '-z', ...refs);
  const files = head === 'WORKTREE' ? [
    ...diff(base, 'HEAD'), ...diff('--cached'), ...diff(),
    ...gitPaths('ls-files', '--others', '--exclude-standard', '-z'),
  ] : diff(base, head);
  return [...new Set(files)];
}
