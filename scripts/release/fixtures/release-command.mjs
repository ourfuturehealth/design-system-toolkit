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
  if (state.failTagCheckAt === state.tagChecks) {
    process.stderr.write('Synthetic remote tag read failed\n');
    process.exit(1);
  }
  const sha = state.moveAfter && state.tagChecks >= state.moveAfter ? 'b'.repeat(40) : state.sha;
  const tag = args[2].replace('refs/tags/', '');
  if (state.tags) {
    if (state.tags[tag]) process.stdout.write(`${state.moveAfter && state.tagChecks >= state.moveAfter ? sha : state.tags[tag]}\trefs/tags/${tag}\n`);
  } else process.stdout.write(`${'c'.repeat(40)}\trefs/tags/${state.tag}\n${sha}\trefs/tags/${state.tag}^{}\n`);
} else if (command === 'gh' && args[0] === 'api') {
  if (state.failApi) process.exit(1);
  const endpoint = args.at(-1);
  if (endpoint.endsWith('/releases')) {
    if (state.createdTag && state.failApiAfterCreate) process.exit(1);
    let releases = state.releases;
    if (state.remainingHiddenReads > 0) {
      state.remainingHiddenReads -= 1;
      save();
      releases = releases.filter(release => release.tag_name !== state.createdTag);
    }
    process.stdout.write(JSON.stringify(args.includes('--slurp') ? [releases] : releases));
  } else if (endpoint.includes('/git/matching-refs/tags/')) {
    const prefix = endpoint.split('/').at(-1);
    process.stdout.write(JSON.stringify(Object.entries(state.tags || {}).filter(([tag]) => tag.startsWith(prefix))
      .map(([tag, sha]) => ({ ref: `refs/tags/${tag}`, object: { type: 'commit', sha } }))));
  } else if (endpoint.endsWith('/git/refs') && args.includes('POST')) {
    const tag = args.find(arg => arg.startsWith('ref=')).slice('ref=refs/tags/'.length);
    const sha = args.find(arg => arg.startsWith('sha=')).slice(4);
    if (state.tags[tag] || state.failTagBeforeCommit) process.exit(1);
    state.tags[tag] = sha;
    save();
    if (state.failTagAfterCommit) process.exit(1);
    process.stdout.write(JSON.stringify({ ref: `refs/tags/${tag}`, object: { type: 'commit', sha } }));
  } else if (endpoint.includes('/releases/tags/')) {
    const tag = endpoint.split('/').at(-1);
    const release = state.releases.find(item => item.tag_name === tag && !item.draft);
    if (!release) {
      process.stderr.write('gh: Not Found (HTTP 404)\n');
      process.exit(1);
    }
    process.stdout.write(JSON.stringify(release));
  } else {
    throw new Error(`Unexpected mocked API endpoint: ${endpoint}`);
  }
} else if (command === 'gh' && args[0] === 'release') {
  switch (args[1]) {
    case 'create':
      state.releases.push({ tag_name: args[2], draft: true, assets: [] });
      state.createdTag = args[2];
      state.remainingHiddenReads = state.hiddenReadsAfterCreate || 0;
      if (state.hiddenReadsTag && state.hiddenReadsTag !== args[2]) state.remainingHiddenReads = 0;
      break;
    case 'upload': {
      const content = state.corruptUpload || state.corruptTag === args[2] ? 'corrupt' : readFileSync(args[3], 'utf8');
      state.releases.find(release => release.tag_name === args[2]).assets.push({ name: basename(args[3]), content });
      break;
    }
    case 'download': {
      const asset = state.releases.find(release => release.tag_name === args[2]).assets.find(item => item.name === value('--pattern'));
      writeFileSync(join(value('--dir'), asset.name), asset.content);
      break;
    }
    case 'edit':
      if (state.failPublishBeforeCommit || state.failPublishTag === args[2]) process.exit(1);
      state.releases.find(release => release.tag_name === args[2]).draft = false;
      if (state.failPublishAfterCommit || state.failPublishAfterTag === args[2]) {
        save();
        process.exit(1);
      }
      break;
    default:
      throw new Error(`Unexpected mocked release command: ${args.join(' ')}`);
  }
  save();
} else {
  throw new Error(`Unexpected mocked command: ${command} ${args.join(' ')}`);
}
