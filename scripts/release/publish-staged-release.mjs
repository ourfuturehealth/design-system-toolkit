import assert from 'node:assert/strict';
import { githubReleaseClient } from './github-release.mjs';

const [tag, notesPath, ...assets] = process.argv.slice(2);
const { GITHUB_REPOSITORY: repository, GITHUB_SHA: sha } = process.env;
assert(repository && sha && notesPath && assets.length, 'Release tag, notes, assets, repository, and exact SHA are required');
assert(/^(toolkit|react)-v\d+\.\d+\.\d+$/.test(tag), 'Canonical stable release tag required');
const client = githubReleaseClient(repository, sha);
const staged = await client.stage(tag, notesPath, assets);
client.publish(staged);
