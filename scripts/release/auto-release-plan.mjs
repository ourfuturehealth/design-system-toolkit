#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const packageConfigs = [
  {
    id: 'toolkit',
    checkboxLabel: 'Release toolkit',
    manifestPath: 'packages/toolkit/package.json',
    tagPrefix: 'toolkit-v',
  },
  {
    id: 'react-components',
    checkboxLabel: 'Release React components',
    manifestPath: 'packages/react-components/package.json',
    tagPrefix: 'react-v',
  },
];

const noReleaseLabel = 'No package release';

function usage() {
  console.error(`Usage:
  auto-release-plan.mjs validate-pr --base-sha <sha> --head-sha <sha> --event-path <path>
  auto-release-plan.mjs plan-push --base-sha <sha> --head-sha <sha> --pr-json <path> --github-output <path>
  auto-release-plan.mjs plan-test --scope <toolkit|react-components|all> --run-id <id> --github-output <path>`);
}

function parseArgs(argv) {
  const [command, ...tokens] = argv;
  const args = { command };

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];

    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    const value = tokens[index + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`);
    }

    args[key] = value;
    index += 1;
  }

  return args;
}

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

function readJsonAtRef(ref, filePath) {
  return JSON.parse(run('git', ['show', `${ref}:${filePath}`]));
}

function readTextAtRef(ref, filePath) {
  return run('git', ['show', `${ref}:${filePath}`]);
}

function readCurrentJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readEventBody(eventPath) {
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  return event.pull_request?.body || '';
}

function parsePullRequest(prJsonPath) {
  if (!prJsonPath || !fs.existsSync(prJsonPath)) {
    return {};
  }

  const pr = JSON.parse(fs.readFileSync(prJsonPath, 'utf8'));
  return pr && typeof pr === 'object' && !Array.isArray(pr) ? pr : {};
}

function normalizeCheckboxLabel(label) {
  return label.toLowerCase().replace(/\s+/g, ' ').trim();
}

function parseReleaseIntent(body) {
  const selected = {
    noRelease: false,
    toolkit: false,
    'react-components': false,
  };
  const seen = new Set();
  const lines = body.split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^\s*[-*]\s+\[([ xX])\]\s+(.+?)\s*$/);

    if (!match) {
      continue;
    }

    const isChecked = match[1].toLowerCase() === 'x';
    const label = normalizeCheckboxLabel(match[2]);

    if (label === normalizeCheckboxLabel(noReleaseLabel)) {
      seen.add('noRelease');
      selected.noRelease = isChecked;
      continue;
    }

    for (const config of packageConfigs) {
      if (label === normalizeCheckboxLabel(config.checkboxLabel)) {
        seen.add(config.id);
        selected[config.id] = isChecked;
      }
    }
  }

  return {
    ...selected,
    hasReleaseSection: seen.size > 0,
  };
}

function readPackageStates(baseSha, headSha) {
  return packageConfigs.map((config) => {
    const basePackage = readJsonAtRef(baseSha, config.manifestPath);
    const headPackage = readJsonAtRef(headSha, config.manifestPath);
    const version = headPackage.version;
    const previousVersion = basePackage.version;

    return {
      ...config,
      version,
      previousVersion,
      changed: version !== previousVersion,
      tag: `${config.tagPrefix}${version}`,
    };
  });
}

function remoteTagExists(tag) {
  return commandSucceeds('git', ['ls-remote', '--exit-code', '--tags', 'origin', `refs/tags/${tag}`]);
}

function releaseExists(tag) {
  const repo = process.env.GITHUB_REPOSITORY;

  if (!repo) {
    throw new Error('GITHUB_REPOSITORY is required for release existence checks.');
  }

  return commandSucceeds('gh', ['release', 'view', tag, '--repo', repo]);
}

function validateReleaseIntent({ baseSha, headSha, body, skipRemoteChecks = false }) {
  const intent = parseReleaseIntent(body);
  const packages = readPackageStates(baseSha, headSha);
  const changelog = readTextAtRef(headSha, 'CHANGELOG.md');
  const errors = [];
  const selectedPackages = packages.filter((pkg) => intent[pkg.id]);
  const changedPackages = packages.filter((pkg) => pkg.changed);

  if (intent.noRelease && selectedPackages.length > 0) {
    errors.push('Choose either "No package release" or specific package releases, not both.');
  }

  if (intent.noRelease && changedPackages.length > 0) {
    errors.push(
      `Package versions changed while "No package release" is selected: ${changedPackages
        .map((pkg) => `${pkg.id} ${pkg.previousVersion} -> ${pkg.version}`)
        .join(', ')}.`,
    );
  }

  for (const pkg of changedPackages) {
    if (!intent[pkg.id]) {
      errors.push(
        `${pkg.id} version changed from ${pkg.previousVersion} to ${pkg.version}, but "${pkg.checkboxLabel}" is not selected.`,
      );
    }
  }

  for (const pkg of selectedPackages) {
    if (!pkg.changed) {
      errors.push(`"${pkg.checkboxLabel}" is selected, but ${pkg.manifestPath} still has version ${pkg.version}.`);
    }

    if (!changelog.includes(pkg.tag)) {
      errors.push(`CHANGELOG.md must include ${pkg.tag} before this package can be released.`);
    }

    if (!skipRemoteChecks) {
      if (remoteTagExists(pkg.tag)) {
        errors.push(`Remote tag ${pkg.tag} already exists. Auto-release will not overwrite existing tags.`);
      }

      if (releaseExists(pkg.tag)) {
        errors.push(`GitHub release ${pkg.tag} already exists. Auto-release will not overwrite existing releases.`);
      }
    }
  }

  return {
    errors,
    packages: selectedPackages.map((pkg) => ({
      package: pkg.id,
      tag: pkg.tag,
      version: pkg.version,
      test: false,
    })),
    intent,
    changedPackages,
  };
}

function writeOutput(outputPath, key, value) {
  if (!outputPath) {
    return;
  }

  const serialized = typeof value === 'string' ? value : JSON.stringify(value);
  const delimiter = `OFH_AUTO_RELEASE_${key}`;

  fs.appendFileSync(outputPath, `${key}<<${delimiter}\n${serialized}\n${delimiter}\n`);
}

function printErrors(errors) {
  for (const error of errors) {
    console.error(`- ${error}`);
  }
}

function validatePr(args) {
  const body = readEventBody(args['event-path']);
  const result = validateReleaseIntent({
    baseSha: args['base-sha'],
    headSha: args['head-sha'],
    body,
  });

  if (result.errors.length > 0) {
    console.error('Release intent validation failed:');
    printErrors(result.errors);
    process.exit(1);
  }

  if (result.packages.length === 0) {
    process.stdout.write('Release intent validation passed. No package release requested.\n');
    return;
  }

  process.stdout.write(`Release intent validation passed for ${result.packages.map((pkg) => pkg.tag).join(', ')}.\n`);
}

function planPush(args) {
  const pr = parsePullRequest(args['pr-json']);
  const body = pr.body || '';
  const result = validateReleaseIntent({
    baseSha: args['base-sha'],
    headSha: args['head-sha'],
    body,
  });
  const responsibleUser = pr.merged_by?.login || pr.user?.login || process.env.GITHUB_ACTOR || '';
  const summary =
    result.packages.length > 0
      ? result.packages.map((pkg) => `${pkg.package}:${pkg.tag}`).join(', ')
      : 'No package release requested.';

  writeOutput(args['github-output'], 'packages', result.packages);
  writeOutput(args['github-output'], 'has_releases', result.packages.length > 0 ? 'true' : 'false');
  writeOutput(args['github-output'], 'responsible_user', responsibleUser);
  writeOutput(args['github-output'], 'pr_number', pr.number ? String(pr.number) : '');
  writeOutput(args['github-output'], 'pr_url', pr.html_url || '');
  writeOutput(args['github-output'], 'pr_title', pr.title || '');
  writeOutput(args['github-output'], 'summary', summary);

  if (result.errors.length > 0) {
    console.error('Auto-release planning failed:');
    printErrors(result.errors);
    process.exit(1);
  }

  process.stdout.write(`${summary}\n`);
}

function planTest(args) {
  const scope = args.scope;
  const runId = args['run-id'];
  const selectedPackages =
    scope === 'all'
      ? packageConfigs
      : packageConfigs.filter((config) => config.id === scope);

  if (selectedPackages.length === 0) {
    throw new Error(`Unsupported test release scope: ${scope}`);
  }

  const packages = selectedPackages.map((config) => {
    const version = readCurrentJson(config.manifestPath).version;
    const packageName = config.id === 'toolkit' ? 'toolkit' : 'react';
    const tag = `auto-release-test-${packageName}-v${version}-${runId}`;

    return {
      package: config.id,
      tag,
      version,
      test: true,
    };
  });

  writeOutput(args['github-output'], 'packages', packages);
  writeOutput(args['github-output'], 'has_releases', 'true');
  writeOutput(args['github-output'], 'responsible_user', process.env.GITHUB_ACTOR || '');
  writeOutput(args['github-output'], 'pr_number', '');
  writeOutput(args['github-output'], 'pr_url', '');
  writeOutput(args['github-output'], 'pr_title', 'Workflow dispatch dry run');
  writeOutput(args['github-output'], 'summary', packages.map((pkg) => `${pkg.package}:${pkg.tag}`).join(', '));

  process.stdout.write(`Dry-run release plan: ${packages.map((pkg) => pkg.tag).join(', ')}\n`);
}

try {
  const args = parseArgs(process.argv.slice(2));

  switch (args.command) {
    case 'validate-pr':
      validatePr(args);
      break;
    case 'plan-push':
      planPush(args);
      break;
    case 'plan-test':
      planTest(args);
      break;
    default:
      usage();
      process.exit(1);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
