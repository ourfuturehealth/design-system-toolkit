import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { affectedPackages, changedFiles } from './affected-packages.mjs';

const args = process.argv.slice(2);
if (args.length === 0 || args[0] === 'add' || (args[0].startsWith('-') && !['--help', '-h', '--version', '-v'].includes(args[0]))) {
  try {
    const base = execFileSync('git', ['merge-base', 'HEAD', 'origin/main'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
    const affected = affectedPackages(changedFiles(base, 'WORKTREE'));
    const entries = [...affected].filter(([, paths]) => paths.length);
    if (entries.length) {
      process.stdout.write('Potentially affected packages (select these in Changesets):\n');
      for (const [name, paths] of entries) {
        process.stdout.write(`  ${name}:\n${paths.map(path => `    ${path}\n`).join('')}`);
      }
      process.stdout.write('Choose the appropriate bump and describe the consumer impact.\n\n');
    } else {
      process.stdout.write('No public package changes detected against origin/main.\n\n');
    }
  } catch {
    process.stderr.write('Could not detect affected packages against origin/main. Fetch origin/main and review package impacts manually.\n\n');
  }
}

const cli = fileURLToPath(import.meta.resolve('@changesets/cli/bin.js'));
const result = spawnSync(process.execPath, [cli, ...args], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.signal) process.kill(process.pid, result.signal);
process.exitCode = result.status ?? 1;
