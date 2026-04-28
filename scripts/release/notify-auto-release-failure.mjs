#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function commandSucceeds(command, args) {
  try {
    execFileSync(command, args, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function createOrUpdateLabel() {
  commandSucceeds('gh', [
    'label',
    'create',
    'auto-release',
    '--color',
    'B60205',
    '--description',
    'Automated release repair follow-up',
    '--force',
  ]);
}

function findExistingIssue(title) {
  const raw = run('gh', [
    'issue',
    'list',
    '--state',
    'open',
    '--label',
    'auto-release',
    '--json',
    'number,title',
    '--limit',
    '100',
  ]);
  const issues = safeJsonParse(raw, []);
  const existing = issues.find((issue) => issue.title === title);

  return existing?.number;
}

function writeTempBody(body) {
  const bodyPath = path.join(os.tmpdir(), `auto-release-failure-${Date.now()}.md`);
  fs.writeFileSync(bodyPath, body);
  return bodyPath;
}

function createIssue(title, bodyPath, assignee) {
  const args = ['issue', 'create', '--title', title, '--body-file', bodyPath, '--label', 'auto-release'];

  if (assignee) {
    args.push('--assignee', assignee);
  }

  try {
    return run('gh', args);
  } catch (error) {
    if (!assignee) {
      throw error;
    }

    console.error(`Could not assign issue to ${assignee}; creating without assignee.`);
    return run('gh', ['issue', 'create', '--title', title, '--body-file', bodyPath, '--label', 'auto-release']);
  }
}

const shortSha = (process.env.GITHUB_SHA || '').slice(0, 7) || 'unknown';
const title = `[auto-release] Repair release for ${shortSha}`;
const responsibleUser = process.env.RESPONSIBLE_USER || process.env.GITHUB_ACTOR || '';
const workflowUrl = process.env.WORKFLOW_URL || '';
const packages = safeJsonParse(process.env.PACKAGES_JSON || '[]', []);
const packageSummary =
  packages.length > 0
    ? packages.map((pkg) => `- ${pkg.package}: \`${pkg.tag}\``).join('\n')
    : '- No candidate package metadata was available. Check the planning job logs.';
const mention = responsibleUser ? `@${responsibleUser}` : 'the merge owner';
const prLine = process.env.PR_URL
  ? `[${process.env.PR_TITLE || `PR #${process.env.PR_NUMBER}`}](${process.env.PR_URL})`
  : process.env.PR_NUMBER
    ? `PR #${process.env.PR_NUMBER}`
    : 'No associated PR was found.';

const body = `Auto-release failed for ${mention}.

## Context

- Commit: \`${process.env.GITHUB_SHA || 'unknown'}\`
- Workflow: ${workflowUrl || 'unknown'}
- Pull request: ${prLine}
- Planned release summary: ${process.env.RELEASE_SUMMARY || 'unknown'}

## Candidate Releases

${packageSummary}

## Job Results

- Planning: ${process.env.PLAN_RESULT || 'unknown'}
- Checks: ${process.env.CHECKS_RESULT || 'unknown'}
- Publishing: ${process.env.PUBLISH_RESULT || 'unknown'}

## Repair Steps

1. Open the failed workflow run and inspect the first failed job.
2. Fix the failing check on a new PR into \`main\`.
3. If a partial tag or release was created, delete the incorrect remote tag and GitHub release intentionally before retrying.
4. Use the **Manual release fallback** workflow only when the automated path cannot be repaired by a normal follow-up PR.
`;

createOrUpdateLabel();

const bodyPath = writeTempBody(body);
const existingIssue = findExistingIssue(title);

if (existingIssue) {
  run('gh', ['issue', 'comment', String(existingIssue), '--body-file', bodyPath]);
  process.stdout.write(`Updated existing auto-release repair issue #${existingIssue}.\n`);
} else {
  const issueUrl = createIssue(title, bodyPath, responsibleUser);
  process.stdout.write(`Created auto-release repair issue: ${issueUrl}\n`);
}
