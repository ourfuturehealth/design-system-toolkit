#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SEMANTIC_FILE = 'packages/toolkit/core/settings/_tokens-semantic.scss';
const DOC_OUTPUT_FILE = 'docs/tokens-semantic-audit.md';
const AUTO_USAGE_PREFIX = '// [AUTO-USAGE]';
const INLINE_RUNTIME_PREVIEW_LIMIT = 8;

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function readText(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function writeText(relativePath, content) {
  fs.writeFileSync(path.join(repoRoot, relativePath), content, 'utf8');
}

function writeTextIfChanged(relativePath, content) {
  const fullPath = path.join(repoRoot, relativePath);
  const existing = fs.existsSync(fullPath) ? fs.readFileSync(fullPath, 'utf8') : null;
  if (existing === content) {
    return false;
  }
  writeText(relativePath, content);
  return true;
}

function walkFiles(rootDir, shouldIncludeFile, shouldSkipDir = () => false) {
  const result = [];

  function visit(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const relativePath = toPosixPath(path.relative(repoRoot, fullPath));

      if (entry.isDirectory()) {
        if (shouldSkipDir(relativePath, entry.name)) {
          continue;
        }
        visit(fullPath);
        continue;
      }

      if (shouldIncludeFile(relativePath, entry.name)) {
        result.push(relativePath);
      }
    }
  }

  visit(path.join(repoRoot, rootDir));

  return result.sort((a, b) => a.localeCompare(b));
}

function stripScssComments(input) {
  let output = '';
  let i = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  while (i < input.length) {
    const char = input[i];
    const nextChar = input[i + 1];

    if (inSingleQuote) {
      output += char;

      if (char === '\\' && i + 1 < input.length) {
        output += input[i + 1];
        i += 2;
        continue;
      }

      if (char === '\'') {
        inSingleQuote = false;
      }

      i += 1;
      continue;
    }

    if (inDoubleQuote) {
      output += char;

      if (char === '\\' && i + 1 < input.length) {
        output += input[i + 1];
        i += 2;
        continue;
      }

      if (char === '"') {
        inDoubleQuote = false;
      }

      i += 1;
      continue;
    }

    if (char === '/' && nextChar === '*') {
      i += 2;
      while (i < input.length) {
        if (input[i] === '*' && input[i + 1] === '/') {
          i += 2;
          break;
        }
        i += 1;
      }
      continue;
    }

    if (char === '/' && nextChar === '/') {
      i += 2;
      while (i < input.length && input[i] !== '\n') {
        i += 1;
      }
      continue;
    }

    if (char === '\'') {
      inSingleQuote = true;
      output += char;
      i += 1;
      continue;
    }

    if (char === '"') {
      inDoubleQuote = true;
      output += char;
      i += 1;
      continue;
    }

    output += char;
    i += 1;
  }

  return output;
}

function parseSemanticTokens(semanticSource) {
  const tokens = [];
  const lines = semanticSource.split(/\r?\n/);
  const tokenRegex = /^\s*(\$[a-zA-Z0-9_-]+)\s*:\s*([^;]+?)\s*;/;

  for (const line of lines) {
    const match = tokenRegex.exec(line);
    if (!match) {
      continue;
    }
    tokens.push({
      token: match[1],
      mapsTo: match[2].trim(),
    });
  }

  return tokens;
}

function getRuntimeScope(filePath) {
  if (filePath.startsWith('packages/toolkit/components/')) {
    return 'toolkit-components';
  }
  if (filePath.startsWith('packages/site/components/')) {
    return 'site-components';
  }
  if (filePath.startsWith('packages/toolkit/core/')) {
    return 'toolkit-core';
  }
  if (filePath.startsWith('packages/site/styles/')) {
    return 'site-styles';
  }
  if (filePath.startsWith('packages/react-components/src/styles/')) {
    return 'react-components-styles';
  }
  return 'other-runtime';
}

function pluralize(word, count) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function toInlineUsageComment(tokenData) {
  const runtimeCount = tokenData.runtimeFiles.length;
  const docsCount = tokenData.docsFiles.length;

  let runtimeInfo = 'runtime: 0 files (none)';

  if (runtimeCount > 0) {
    const previewFiles = tokenData.runtimeFiles.slice(0, INLINE_RUNTIME_PREVIEW_LIMIT);
    const overflowCount = runtimeCount - previewFiles.length;
    const overflowSuffix = overflowCount > 0 ? `, ... +${overflowCount} more` : '';
    runtimeInfo = `runtime: ${pluralize('file', runtimeCount)} (${previewFiles.join(', ')}${overflowSuffix})`;
  }

  return `${AUTO_USAGE_PREFIX} ${runtimeInfo} | docs/text refs: ${docsCount}`;
}

function updateSemanticInlineComments(semanticSource, tokenDataByToken) {
  const lines = semanticSource.split(/\r?\n/);
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop();
  }
  const updatedLines = [];
  const tokenLineRegex = /^\s*(\$[a-zA-Z0-9_-]+)\s*:\s*([^;]+?)\s*;/;

  for (const line of lines) {
    if (line.trimStart().startsWith(AUTO_USAGE_PREFIX)) {
      continue;
    }

    const tokenMatch = tokenLineRegex.exec(line);
    if (tokenMatch) {
      const tokenName = tokenMatch[1];
      const tokenData = tokenDataByToken.get(tokenName);
      if (!tokenData) {
        throw new Error(`Token data not found for ${tokenName}`);
      }
      updatedLines.push(toInlineUsageComment(tokenData));
      updatedLines.push(line);
      continue;
    }

    updatedLines.push(line);
  }

  return `${updatedLines.join('\n')}\n`;
}

function toTableCellFileList(fileList) {
  if (fileList.length === 0) {
    return 'none';
  }
  return fileList.map((file) => `\`${file}\``).join('<br>');
}

function buildAuditMarkdown(tokenDataList, generatedAt) {
  const total = tokenDataList.length;
  const runtimeUsed = tokenDataList.filter((item) => item.runtimeFiles.length > 0).length;
  const runtimeUnused = total - runtimeUsed;
  const docsPresent = tokenDataList.filter((item) => item.docsFiles.length > 0).length;
  const docsAbsent = total - docsPresent;
  const allRuntimeCleared = tokenDataList.every((item) => item.runtimeFiles.length === 0);
  const allFullyCleared = tokenDataList.every(
    (item) => item.runtimeFiles.length === 0 && item.docsFiles.length === 0
  );

  const readyNow = tokenDataList
    .filter((item) => item.runtimeFiles.length === 0)
    .map((item) => item.token)
    .sort((a, b) => a.localeCompare(b));

  const migrationQueue = [...tokenDataList].sort((a, b) => {
    if (b.runtimeFiles.length !== a.runtimeFiles.length) {
      return b.runtimeFiles.length - a.runtimeFiles.length;
    }
    return a.token.localeCompare(b.token);
  });

  const lines = [];
  lines.push('# Tokens Semantic Audit');
  lines.push('');
  lines.push('> This file is auto-generated by `scripts/generate-tokens-semantic-audit.mjs`.');
  lines.push('> Do not edit manually.');
  lines.push('');
  lines.push(`Generated at: ${generatedAt}`);
  lines.push('');
  lines.push('Scope:');
  lines.push(`- Semantic token source: \`${SEMANTIC_FILE}\``);
  lines.push('- Runtime blocker scan: `packages/**/*.scss`');
  lines.push('- Runtime exclusions: `**/dist/**`, `**/node_modules/**`, semantic source file');
  lines.push('- Docs/text scan: `docs/**/*.{md,mdx}`, `packages/site/views/**/*.njk`');
  lines.push('');
  lines.push('## Deletion Gate');
  lines.push('');
  lines.push('`_tokens-semantic.scss` is removable only when all semantic tokens are at least `runtime-cleared` and token replacement regression checks pass.');
  lines.push('');
  lines.push('Status meanings:');
  lines.push('- `blocking-runtime`: token still used by runtime SCSS and blocks deletion.');
  lines.push('- `runtime-cleared`: no runtime SCSS usage; docs/text may still reference it.');
  lines.push('- `fully-cleared`: no runtime SCSS usage and no docs/text references.');
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`- Total semantic tokens: ${total}`);
  lines.push(`- Runtime-used tokens: ${runtimeUsed}`);
  lines.push(`- Runtime-unused tokens: ${runtimeUnused}`);
  lines.push(`- Tokens with docs/text references: ${docsPresent}`);
  lines.push(`- Tokens without docs/text references: ${docsAbsent}`);
  lines.push(`- All runtime blockers cleared: ${allRuntimeCleared ? 'yes' : 'no'}`);
  lines.push(`- All runtime and docs/text references cleared: ${allFullyCleared ? 'yes' : 'no'}`);
  lines.push('');
  lines.push('## Token Matrix');
  lines.push('');
  lines.push('| Token | Maps To | Runtime Usage Count | Runtime Scope | Runtime File References | Docs/Text Ref Count | Docs/Text Files | Status |');
  lines.push('|---|---|---:|---|---|---:|---|---|');

  for (const item of tokenDataList) {
    const runtimeScope = item.runtimeScopes.length > 0 ? item.runtimeScopes.join(';') : 'none';
    lines.push(
      `| \`${item.token}\` | \`${item.mapsTo}\` | ${item.runtimeFiles.length} | ${runtimeScope} | ${toTableCellFileList(item.runtimeFiles)} | ${item.docsFiles.length} | ${toTableCellFileList(item.docsFiles)} | ${item.status} |`
    );
  }

  lines.push('');
  lines.push('## Ready-To-Remove Candidates Now (Runtime Cleared)');
  lines.push('');
  if (readyNow.length === 0) {
    lines.push('- none');
  } else {
    for (const token of readyNow) {
      lines.push(`- \`${token}\``);
    }
  }

  lines.push('');
  lines.push('## Follow-Up Migration Queue');
  lines.push('');
  lines.push('| Token | Runtime Usage Count | Maps To | Runtime Scope |');
  lines.push('|---|---:|---|---|');
  for (const item of migrationQueue) {
    const runtimeScope = item.runtimeScopes.length > 0 ? item.runtimeScopes.join(';') : 'none';
    lines.push(`| \`${item.token}\` | ${item.runtimeFiles.length} | \`${item.mapsTo}\` | ${runtimeScope} |`);
  }

  lines.push('');
  lines.push('## Refresh');
  lines.push('');
  lines.push('```bash');
  lines.push('pnpm run audit:tokens-semantic');
  lines.push('```');
  lines.push('');
  lines.push('## When To Re-Run');
  lines.push('');
  lines.push('- After any PR that replaces semantic token references in SCSS.');
  lines.push('- Before merging token cleanup/removal PRs.');
  lines.push('- Immediately before removing `packages/toolkit/core/settings/_tokens-semantic.scss`.');
  lines.push('');
  lines.push('## Migration Pass Checklist');
  lines.push('');
  lines.push('- Pick highest runtime-usage tokens first.');
  lines.push('- Replace semantic aliases with mapped new token equivalents in runtime SCSS.');
  lines.push('- Run lint/tests for impacted packages.');
  lines.push('- Run `pnpm run audit:tokens-semantic`.');
  lines.push('- Confirm token status moved from `blocking-runtime` to `runtime-cleared`.');
  lines.push('- Clean docs/text references to avoid consumer/developer confusion.');
  lines.push('- When all tokens are runtime-cleared and regression checks pass, remove semantic file + import.');
  lines.push('');
  lines.push('## Deprecation Cleanup Job (Final Removal)');
  lines.push('');
  lines.push('When `_tokens-semantic.scss` is fully removed, also remove deprecation tracking artifacts in the same cleanup pass:');
  lines.push('');
  lines.push('- Remove `packages/toolkit/core/settings/_tokens-semantic.scss`.');
  lines.push('- Remove the semantic import from `packages/toolkit/core/settings/_all.scss`.');
  lines.push('- Remove this audit document (`docs/tokens-semantic-audit.md`).');
  lines.push('- Remove the generator script (`scripts/generate-tokens-semantic-audit.mjs`).');
  lines.push('- Remove root command `audit:tokens-semantic` from `package.json`.');
  lines.push('- Remove any remaining references to this deprecation workflow in docs.');
  lines.push('- Run full validation (`npm test`) before merging cleanup.');
  lines.push('');
  lines.push('## Prompt For Next Pass');
  lines.push('');
  lines.push('Use this prompt with Codex after a migration pass:');
  lines.push('');
  lines.push('```text');
  lines.push('Re-run `pnpm run audit:tokens-semantic`, summarize which tokens moved to runtime-cleared,');
  lines.push('list any tokens still blocking runtime deletion, and propose the next highest-impact token');
  lines.push('replacement slice with affected files. If everything is fully-cleared, propose the');
  lines.push('final deprecation cleanup PR that removes the semantic file, audit doc, script, and command.');
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}

function main() {
  const semanticSource = readText(SEMANTIC_FILE);
  const parsedTokens = parseSemanticTokens(semanticSource);

  const runtimeScssFiles = walkFiles(
    'packages',
    (relativePath) => relativePath.endsWith('.scss') && relativePath !== SEMANTIC_FILE,
    (relativePath, dirName) => {
      if (
        dirName === 'node_modules' ||
        dirName === 'dist' ||
        dirName === 'coverage' ||
        dirName === '.turbo' ||
        dirName === 'build' ||
        dirName === 'storybook-static'
      ) {
        return true;
      }
      return (
        relativePath.endsWith('/node_modules') ||
        relativePath.endsWith('/dist') ||
        relativePath.endsWith('/coverage') ||
        relativePath.endsWith('/.turbo') ||
        relativePath.endsWith('/build') ||
        relativePath.endsWith('/storybook-static')
      );
    }
  );

  const docsMarkdownFiles = walkFiles('docs', (relativePath) => {
    return relativePath.endsWith('.md') || relativePath.endsWith('.mdx');
  });

  const docsNunjucksFiles = walkFiles(
    'packages/site/views',
    (relativePath) => relativePath.endsWith('.njk')
  );

  const docsFiles = [...docsMarkdownFiles, ...docsNunjucksFiles]
    .filter((filePath) => filePath !== DOC_OUTPUT_FILE)
    .sort((a, b) => a.localeCompare(b));

  const runtimeSources = runtimeScssFiles.map((filePath) => ({
    filePath,
    content: stripScssComments(readText(filePath)),
  }));

  const docsSources = docsFiles.map((filePath) => ({
    filePath,
    content: readText(filePath),
  }));

  const tokenDataList = parsedTokens.map((entry) => {
    const runtimeFiles = runtimeSources
      .filter((source) => source.content.includes(entry.token))
      .map((source) => source.filePath)
      .sort((a, b) => a.localeCompare(b));

    const docsFilesForToken = docsSources
      .filter((source) => source.content.includes(entry.token))
      .map((source) => source.filePath)
      .sort((a, b) => a.localeCompare(b));

    const runtimeScopes = [...new Set(runtimeFiles.map((filePath) => getRuntimeScope(filePath)))].sort((a, b) => a.localeCompare(b));

    let status = 'blocking-runtime';
    if (runtimeFiles.length === 0 && docsFilesForToken.length > 0) {
      status = 'runtime-cleared';
    } else if (runtimeFiles.length === 0 && docsFilesForToken.length === 0) {
      status = 'fully-cleared';
    }

    return {
      token: entry.token,
      mapsTo: entry.mapsTo,
      runtimeFiles,
      runtimeScopes,
      docsFiles: docsFilesForToken,
      status,
    };
  });

  const tokenDataByToken = new Map(tokenDataList.map((item) => [item.token, item]));

  const updatedSemanticFile = updateSemanticInlineComments(
    semanticSource,
    tokenDataByToken
  );
  const semanticChanged = writeTextIfChanged(SEMANTIC_FILE, updatedSemanticFile);

  const sourceTimestampFiles = [SEMANTIC_FILE, ...runtimeScssFiles, ...docsFiles];
  const latestSourceMtimeMs = Math.max(
    ...sourceTimestampFiles.map((relativePath) =>
      fs.statSync(path.join(repoRoot, relativePath)).mtimeMs
    )
  );
  const generatedAt = new Date(latestSourceMtimeMs).toISOString();

  const auditMarkdown = buildAuditMarkdown(tokenDataList, generatedAt);
  const docChanged = writeTextIfChanged(DOC_OUTPUT_FILE, `${auditMarkdown}\n`);

  const runtimeUsed = tokenDataList.filter((item) => item.runtimeFiles.length > 0).length;
  const runtimeUnused = tokenDataList.length - runtimeUsed;
  const docsPresent = tokenDataList.filter((item) => item.docsFiles.length > 0).length;

  console.log(
    `${semanticChanged ? 'Updated' : 'No changes'} ${SEMANTIC_FILE}`
  );
  console.log(`${docChanged ? 'Updated' : 'No changes'} ${DOC_OUTPUT_FILE}`);
  console.log(`Totals: ${tokenDataList.length} tokens | runtime-used: ${runtimeUsed} | runtime-unused: ${runtimeUnused} | docs/text refs present: ${docsPresent}`);
}

main();
