import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const outputDir = join(repoRoot, 'tmp');
const packageRoot = join(repoRoot, 'packages');
const outputJsonPath = join(outputDir, 'typography-alias-audit.json');
const outputMarkdownPath = join(outputDir, 'typography-alias-audit.md');
const typographySourcePath = join(
  repoRoot,
  'packages/toolkit/core/styles/_typography.scss',
);
const typographySource = readFileSync(typographySourcePath, 'utf8');
let gitHubSearchAvailable;

const aliasDefinitions = [
  {
    name: 'ofh-body-l',
    category: 'semantic body class',
    definitionPattern: /%ofh-body-l\b/,
    tokenBasis:
      "Uses `@include ofh-typography-responsive('lead')` with `@include ofh-responsive-margin(24, 'bottom')`.",
    directReplacement: 'ofh-lead-md',
    internalDependencies: [
      '%ofh-body-l placeholder selector',
      '%ofh-body-l + %ofh-heading-l contextual spacing rule',
    ],
  },
  {
    name: 'ofh-body-m',
    category: 'semantic body class',
    definitionPattern: /%ofh-body-m\b/,
    tokenBasis:
      "Uses `@include ofh-typography-responsive('paragraph')` with `@include ofh-responsive-margin(16, 'bottom')`.",
    directReplacement: 'ofh-paragraph-md',
    internalDependencies: [
      '%ofh-body-m placeholder selector',
      'Default `p` element extension',
      '%ofh-body-m + %ofh-heading-l contextual spacing rule',
      '%ofh-body-m + %ofh-heading-m contextual spacing rule',
      '%ofh-body-m + %ofh-heading-s contextual spacing rule',
      '`address` extension',
    ],
  },
  {
    name: 'ofh-body-s',
    category: 'semantic body class',
    definitionPattern: /%ofh-body-s\b/,
    tokenBasis:
      "Uses `@include ofh-typography-responsive('paragraph-small')` with `@include ofh-responsive-margin(16, 'bottom')`.",
    directReplacement: 'ofh-paragraph-sm',
    internalDependencies: [
      '%ofh-body-s placeholder selector',
      '%ofh-body-s + %ofh-heading-l contextual spacing rule',
      '%ofh-body-s + %ofh-heading-m contextual spacing rule',
      '%ofh-body-s + %ofh-heading-s contextual spacing rule',
    ],
  },
  {
    name: 'ofh-lede-text',
    category: 'semantic wrapper class',
    definitionPattern: /\.ofh-lede-text\b/,
    tokenBasis:
      "Uses `@include ofh-font('lead')` with `@include ofh-responsive-margin(40, 'bottom')`, and restyles nested `p` and `ul` content.",
    directReplacement: null,
    internalDependencies: [
      'Nested `p, ul` typography override',
      '`h1 + .ofh-lede-text` contextual spacing rule',
      '`.ofh-lede-text + %ofh-heading-l` contextual spacing rule',
    ],
  },
  {
    name: 'ofh-lede-text--small',
    category: 'semantic wrapper modifier',
    definitionPattern: /\.ofh-lede-text--small\b/,
    tokenBasis:
      "Uses `@include ofh-font('paragraph')` with `@include ofh-responsive-margin(24, 'bottom')`.",
    directReplacement: null,
    internalDependencies: ['`h1 + .ofh-lede-text--small` contextual spacing rule'],
  },
  {
    name: 'ofh-caption-xl',
    category: 'semantic caption class',
    definitionPattern: /\.ofh-caption-xl\b/,
    tokenBasis:
      "Uses `@include ofh-font('h2')` with secondary foreground colour and `$ofh-size-4` bottom margin.",
    directReplacement: null,
    internalDependencies: ['Heading caption styling'],
  },
  {
    name: 'ofh-caption-l',
    category: 'semantic caption class',
    definitionPattern: /\.ofh-caption-l\b/,
    tokenBasis:
      "Uses `@include ofh-font('h3')` with secondary foreground colour and `$ofh-size-4` bottom margin.",
    directReplacement: null,
    internalDependencies: ['Heading caption styling'],
  },
  {
    name: 'ofh-caption-m',
    category: 'semantic caption class',
    definitionPattern: /\.ofh-caption-m\b/,
    tokenBasis:
      "Uses `@include ofh-font('paragraph')` with secondary foreground colour and no extra margin override.",
    directReplacement: null,
    internalDependencies: ['Heading caption styling'],
  },
  {
    name: 'ofh-caption--bottom',
    category: 'semantic caption modifier',
    definitionPattern: /\.ofh-caption--bottom\b/,
    tokenBasis:
      'Adjusts caption spacing only: `$ofh-size-0` bottom margin and `$ofh-size-4` top margin.',
    directReplacement: null,
    internalDependencies: ['Depends on caption classes being present'],
  },
  {
    name: 'ofh-heading-xxs',
    category: 'legacy heading alias',
    definitionPattern: /%ofh-heading-xxs\b/,
    tokenBasis:
      "Uses `@include ofh-typography-responsive('h5')` with `@include ofh-responsive-margin(16, 'bottom')`.",
    directReplacement: 'ofh-heading-xs',
    internalDependencies: ['%ofh-heading-xxs placeholder selector', '`h6` extension'],
  },
];

function parseArguments(argv) {
  const options = {
    owner: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === '--owner') {
      options.owner = argv[index + 1] ?? null;
      index += 1;
    }
  }

  return options;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function walkFiles(rootPath) {
  const files = [];
  const queue = [rootPath];

  while (queue.length > 0) {
    const currentPath = queue.pop();
    const entries = readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (
          entry.name === '.git' ||
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === 'coverage'
        ) {
          continue;
        }

        queue.push(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      if (!['.scss', '.njk', '.md', '.html', '.ts', '.tsx', '.js', '.jsx'].includes(extname(fullPath))) {
        continue;
      }

      files.push(fullPath);
    }
  }

  return files;
}

function classifyLocalGroup(relativePath) {
  if (relativePath.startsWith('packages/toolkit/')) {
    return 'toolkit';
  }

  if (
    relativePath.startsWith('packages/site/views/') ||
    relativePath.includes('/README.md') ||
    relativePath.startsWith('packages/site/components/')
  ) {
    return 'docsExamples';
  }

  if (relativePath.startsWith('packages/site/')) {
    return 'site';
  }

  if (relativePath.startsWith('packages/react-components/')) {
    return 'reactComponents';
  }

  return 'other';
}

function findDefinitionLine(definitionPattern) {
  const lines = typographySource.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    if (definitionPattern.test(lines[index])) {
      return index + 1;
    }
  }

  return null;
}

function collectLocalUsage(aliasName) {
  const matcher = new RegExp(`(?<![A-Za-z0-9-])${escapeRegExp(aliasName)}(?![A-Za-z0-9-])`, 'g');
  const files = walkFiles(packageRoot);
  const occurrences = [];

  for (const filePath of files) {
    const relativePath = relative(repoRoot, filePath);
    const fileText = readFileSync(filePath, 'utf8');
    const lines = fileText.split('\n');

    for (let index = 0; index < lines.length; index += 1) {
      if (!matcher.test(lines[index])) {
        continue;
      }

      if (
        relativePath === 'packages/toolkit/core/styles/_typography.scss' &&
        (lines[index].includes(`.${aliasName}`) || lines[index].includes(`%${aliasName}`))
      ) {
        matcher.lastIndex = 0;
        continue;
      }

      occurrences.push({
        path: relativePath,
        line: index + 1,
        group: classifyLocalGroup(relativePath),
        snippet: lines[index].trim(),
      });
      matcher.lastIndex = 0;
    }
  }

  const grouped = {
    toolkit: [],
    site: [],
    docsExamples: [],
    reactComponents: [],
    other: [],
  };

  for (const occurrence of occurrences) {
    grouped[occurrence.group].push(occurrence);
  }

  return {
    count: occurrences.length,
    grouped,
  };
}

function isGitHubSearchAvailable() {
  if (typeof gitHubSearchAvailable === 'boolean') {
    return gitHubSearchAvailable;
  }

  try {
    execFileSync('gh', ['auth', 'status'], {
      cwd: repoRoot,
      stdio: 'ignore',
    });
    gitHubSearchAvailable = true;
  } catch {
    gitHubSearchAvailable = false;
  }

  return gitHubSearchAvailable;
}

function collectOrgUsage(aliasName, owner) {
  if (!owner) {
    return {
      status: 'skipped',
      reason: 'No GitHub owner provided.',
      totalResults: 0,
      repositories: [],
    };
  }

  if (!isGitHubSearchAvailable()) {
    return {
      status: 'unavailable',
      reason: '`gh auth status` failed in this environment.',
      totalResults: 0,
      repositories: [],
    };
  }

  try {
    const raw = execFileSync(
      'gh',
      [
        'search',
        'code',
        `"${aliasName}"`,
        '--owner',
        owner,
        '--match',
        'file',
        '--limit',
        '100',
        '--json',
        'repository,path,url',
      ],
      {
        cwd: repoRoot,
        encoding: 'utf8',
      },
    );
    const results = JSON.parse(raw);
    const byRepo = new Map();

    for (const result of results) {
      const repoName = result.repository.nameWithOwner;

      if (!byRepo.has(repoName)) {
        byRepo.set(repoName, {
          repository: repoName,
          count: 0,
          paths: [],
        });
      }

      const repoEntry = byRepo.get(repoName);
      repoEntry.count += 1;

      if (repoEntry.paths.length < 10) {
        repoEntry.paths.push(result.path);
      }
    }

    return {
      status: 'ok',
      reason: 'GitHub legacy code search results.',
      totalResults: results.length,
      repositories: Array.from(byRepo.values()).sort((left, right) => right.count - left.count),
    };
  } catch (error) {
    return {
      status: 'failed',
      reason: error.message,
      totalResults: 0,
      repositories: [],
    };
  }
}

function determineRemovalImpact(aliasDefinition, localUsage, orgUsage) {
  const externalUsage = orgUsage.status === 'ok' ? orgUsage.totalResults : 0;

  if (!aliasDefinition.directReplacement) {
    return 'high';
  }

  if (externalUsage > 0 || localUsage.count > 20) {
    return 'high';
  }

  if (localUsage.count > 5) {
    return 'medium';
  }

  return 'low';
}

function determineRecommendation(aliasDefinition, removalImpact) {
  if (!aliasDefinition.directReplacement) {
    return 'keep as semantic API';
  }

  if (removalImpact === 'low') {
    return 'remove';
  }

  return 'rename/migrate';
}

function buildAliasReport(aliasDefinition, owner) {
  const localUsage = collectLocalUsage(aliasDefinition.name);
  const orgUsage = collectOrgUsage(aliasDefinition.name, owner);
  const removalImpact = determineRemovalImpact(aliasDefinition, localUsage, orgUsage);

  return {
    name: aliasDefinition.name,
    category: aliasDefinition.category,
    definitionSource: {
      path: 'packages/toolkit/core/styles/_typography.scss',
      line: findDefinitionLine(aliasDefinition.definitionPattern),
    },
    tokenBasis: aliasDefinition.tokenBasis,
    localUsage,
    directReplacement: aliasDefinition.directReplacement,
    internalDependencies: aliasDefinition.internalDependencies,
    orgUsage,
    removalImpact,
    recommendation: determineRecommendation(aliasDefinition, removalImpact),
  };
}

function summarize(report) {
  const summary = {
    aliasCount: report.aliases.length,
    totalLocalUsageCount: 0,
    aliasesWithoutDirectReplacement: 0,
    aliasesWithExternalUsage: 0,
  };

  for (const alias of report.aliases) {
    summary.totalLocalUsageCount += alias.localUsage.count;

    if (!alias.directReplacement) {
      summary.aliasesWithoutDirectReplacement += 1;
    }

    if (alias.orgUsage.status === 'ok' && alias.orgUsage.totalResults > 0) {
      summary.aliasesWithExternalUsage += 1;
    }
  }

  return summary;
}

function renderGroup(groupEntries) {
  if (groupEntries.length === 0) {
    return '- none';
  }

  return groupEntries
    .map((entry) => `- ${entry.path}:${entry.line}`)
    .join('\n');
}

function renderOrgUsage(orgUsage) {
  if (orgUsage.status !== 'ok') {
    return `- ${orgUsage.reason}`;
  }

  if (orgUsage.totalResults === 0) {
    return '- no results found';
  }

  return orgUsage.repositories
    .map((repository) => `- ${repository.repository} (${repository.count}): ${repository.paths.join(', ')}`)
    .join('\n');
}

function renderMarkdown(report) {
  const lines = [
    '# Typography Alias Audit',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    '## Summary',
    '',
    `- aliasCount: ${report.summary.aliasCount}`,
    `- totalLocalUsageCount: ${report.summary.totalLocalUsageCount}`,
    `- aliasesWithoutDirectReplacement: ${report.summary.aliasesWithoutDirectReplacement}`,
    `- aliasesWithExternalUsage: ${report.summary.aliasesWithExternalUsage}`,
    '',
    report.owner
      ? `Org-wide search owner: \`${report.owner}\` (advisory only; \`gh search code\` uses legacy GitHub code search).`
      : 'Org-wide search: skipped.',
    '',
  ];

  for (const alias of report.aliases) {
    lines.push(`## ${alias.name}`);
    lines.push('');
    lines.push(`- category: ${alias.category}`);
    lines.push(
      `- definitionSource: ${alias.definitionSource.path}:${alias.definitionSource.line ?? 'unknown'}`,
    );
    lines.push(`- tokenBasis: ${alias.tokenBasis}`);
    lines.push(`- directReplacement: ${alias.directReplacement ?? 'none'}`);
    lines.push(`- removalImpact: ${alias.removalImpact}`);
    lines.push(`- recommendation: ${alias.recommendation}`);
    lines.push(`- localUsageCount: ${alias.localUsage.count}`);
    lines.push('');
    lines.push('### Local Usage');
    lines.push('');
    lines.push('#### toolkit');
    lines.push(renderGroup(alias.localUsage.grouped.toolkit));
    lines.push('');
    lines.push('#### site');
    lines.push(renderGroup(alias.localUsage.grouped.site));
    lines.push('');
    lines.push('#### docsExamples');
    lines.push(renderGroup(alias.localUsage.grouped.docsExamples));
    lines.push('');
    lines.push('#### reactComponents');
    lines.push(renderGroup(alias.localUsage.grouped.reactComponents));
    lines.push('');
    lines.push('#### other');
    lines.push(renderGroup(alias.localUsage.grouped.other));
    lines.push('');
    lines.push('### Internal Dependencies');
    lines.push('');
    lines.push(
      alias.internalDependencies.length > 0
        ? alias.internalDependencies.map((dependency) => `- ${dependency}`).join('\n')
        : '- none',
    );
    lines.push('');
    lines.push('### Org-wide Usage');
    lines.push('');
    lines.push(renderOrgUsage(alias.orgUsage));
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const report = {
    generatedAt: new Date().toISOString(),
    owner: options.owner,
    aliases: aliasDefinitions.map((aliasDefinition) =>
      buildAliasReport(aliasDefinition, options.owner),
    ),
  };
  report.summary = summarize(report);

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputJsonPath, JSON.stringify(report, null, 2));
  writeFileSync(outputMarkdownPath, renderMarkdown(report));

  process.stdout.write(
    `${JSON.stringify(
      {
        summary: report.summary,
        reportPaths: {
          json: relative(repoRoot, outputJsonPath),
          markdown: relative(repoRoot, outputMarkdownPath),
        },
      },
      null,
      2,
    )}\n`,
  );
}

main();
