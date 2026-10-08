#!/usr/bin/env node
// Offline command fixture. Never invokes GitHub or git.
import { readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const statePath = process.env.MOCK_RELEASE_STATE;
const state = JSON.parse(readFileSync(statePath, 'utf8'));
const command = basename(process.argv[1]);
const args = process.argv.slice(2);
const value = flag => args[args.indexOf(flag) + 1];
const save = () => writeFileSync(statePath, JSON.stringify(state));
state.commands.push([command, ...args]);
save();
if (command === 'git' && args[0] === 'diff') {
  if (state.dirty) process.exit(1);
} else if (command === 'git' && args[0] === 'rev-parse') {
  process.stdout.write(state.localMoved && args[1] !== 'HEAD' ? 'b'.repeat(40) : state.sha);
} else if (command === 'git' && args[0] === 'merge-base') {
  if (state.unmerged) process.exit(1);
} else if (command === 'git' && args[0] === 'rev-list') {
  process.stdout.write(state.interiorCommit ? 'b'.repeat(40) : state.sha);
} else if (command === 'git' && args[0] === 'tag') {
  process.stdout.write(`${state.tag}\ntoolkit-v4.26.0\n`);
} else if (command === 'git' && args[0] === 'ls-remote') {
  state.tagChecks += 1;
  save();
  const sha = state.moveAfter && state.tagChecks >= state.moveAfter ? 'b'.repeat(40) : state.sha;
  process.stdout.write(`${'c'.repeat(40)}\trefs/tags/${state.tag}\n${sha}\trefs/tags/${state.tag}^{}\n`);
} else if (command === 'gh' && args[0] === 'api') {
  if (state.failApi) process.exit(1);
  process.stdout.write(JSON.stringify(args.includes('--slurp') ? [state.releases] : state.releases[0]));
} else if (command === 'gh' && args[0] === 'release') {
  switch (args[1]) {
    case 'create':
      state.releases.push({ tag_name: state.tag, draft: true, assets: [] });
      break;
    case 'upload': {
      const content = state.corruptUpload ? 'corrupt' : readFileSync(args[3], 'utf8');
      state.releases[0].assets.push({ name: basename(args[3]), content });
      break;
    }
    case 'download': {
      const asset = state.releases[0].assets.find(item => item.name === value('--pattern'));
      writeFileSync(join(value('--dir'), asset.name), asset.content);
      break;
    }
    case 'edit':
      state.releases[0].draft = false;
      break;
    default:
      throw new Error(`Unexpected mocked release command: ${args.join(' ')}`);
  }
  save();
} else {
  throw new Error(`Unexpected mocked command: ${command} ${args.join(' ')}`);
}
