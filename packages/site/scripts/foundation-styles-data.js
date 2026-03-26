const fs = require('node:fs');
const path = require('node:path');

const settingsDirectory = path.join(__dirname, '../../toolkit/core/settings');
const toolsDirectory = path.join(__dirname, '../../toolkit/core/tools');
const objectsDirectory = path.join(__dirname, '../../toolkit/core/objects');

const files = {
  tokensCore: path.join(settingsDirectory, '_tokens-core.scss'),
  tokensBreakpoint: path.join(settingsDirectory, '_tokens-breakpoint.scss'),
  tokensStatic: path.join(settingsDirectory, '_tokens-static.scss'),
  breakpoints: path.join(settingsDirectory, '_breakpoints.scss'),
  mixins: path.join(toolsDirectory, '_mixins.scss'),
  grid: path.join(toolsDirectory, '_grid.scss'),
  spacingTool: path.join(toolsDirectory, '_spacing.scss'),
  typographyUtilities: path.join(
    __dirname,
    '../../toolkit/core/utilities/_typography.scss',
  ),
  mainWrapper: path.join(objectsDirectory, '_main-wrapper.scss'),
};

const typographyRows = [
  {
    id: 'heading-xl',
    label: 'heading-xl',
    previewText: 'Page heading',
    className: 'ofh-heading-xl',
    scaleKey: 'heading-xl',
    notes: 'Default h1 style.',
  },
  {
    id: 'heading-lg',
    label: 'heading-lg',
    previewText: 'Section heading',
    className: 'ofh-heading-lg',
    scaleKey: 'heading-lg',
    notes: 'Default h2 style.',
  },
  {
    id: 'heading-md',
    label: 'heading-md',
    previewText: 'Subsection heading',
    className: 'ofh-heading-md',
    scaleKey: 'heading-md',
    notes: 'Default h3 style.',
  },
  {
    id: 'heading-sm',
    label: 'heading-sm',
    previewText: 'Support heading',
    className: 'ofh-heading-sm',
    scaleKey: 'heading-sm',
    notes: 'Default h4 style.',
  },
  {
    id: 'heading-xs',
    label: 'heading-xs',
    previewText: 'Small heading',
    className: 'ofh-heading-xs',
    scaleKey: 'heading-xs',
    notes: 'Used for h5, h6, and the smallest heading override.',
  },
  {
    id: 'lead',
    label: 'lead-md',
    previewText: 'Use lead text once to introduce a page.',
    className: 'ofh-body-l',
    scaleKey: 'lead-md',
    notes: 'Used by .ofh-body-l and .ofh-lede-text.',
  },
  {
    id: 'paragraph',
    label: 'paragraph-md',
    previewText: 'Use body copy for most written content.',
    className: 'ofh-body-m',
    scaleKey: 'paragraph-md',
    notes: 'Default paragraph style.',
  },
  {
    id: 'paragraph-small',
    label: 'paragraph-sm',
    previewText: 'Use small body copy sparingly.',
    className: 'ofh-body-s',
    scaleKey: 'paragraph-sm',
    notes: 'Secondary or supporting text.',
  },
  {
    id: 'list',
    label: 'list-md',
    previewText: 'List item',
    previewHtml: '<ul class="ofh-list app-foundation-showcase__inline-list"><li>List item</li></ul>',
    className: 'ofh-list',
    scaleKey: 'list-md',
    notes: 'Bulleted and numbered lists use this responsive list token.',
  },
  {
    id: 'list-small',
    label: 'list-sm',
    previewText: 'List item',
    previewHtml: '<ul class="ofh-list app-foundation-showcase__inline-list ofh-body-s"><li>List item</li></ul>',
    className: 'ofh-body-s',
    scaleKey: 'list-sm',
    notes: 'Smaller list token for more compact supporting content.',
  },
];

const semanticColourGroups = [
  {
    title: 'Text',
    items: [
      '$ofh-color-foreground-primary',
      '$ofh-color-foreground-secondary',
      '$ofh-color-foreground-brand-blue-navy',
      '$ofh-color-foreground-primary-inverted',
    ],
  },
  {
    title: 'Links',
    items: [
      '$ofh-color-foreground-link-default',
      '$ofh-color-foreground-link-hover',
      '$ofh-color-foreground-link-visited',
      '$ofh-color-foreground-link-active',
    ],
  },
  {
    title: 'Breadcrumb navigation links',
    items: [
      '$ofh-color-foreground-breadcrumb-default',
      '$ofh-color-foreground-breadcrumb-hover',
      '$ofh-color-foreground-breadcrumb-visited',
      '$ofh-color-foreground-breadcrumb-active',
    ],
  },
  {
    title: 'Focus state',
    items: [
      '$ofh-color-border-feedback-focus',
      '$ofh-color-border-feedback-focus-inverted',
      '$ofh-color-foreground-brand-blue-navy',
    ],
  },
  {
    title: 'Button',
    items: [
      '$ofh-color-background-button-default',
      '$ofh-color-background-button-hover',
      '$ofh-color-background-button-active',
      '$ofh-color-background-button-default-inverted',
      '$ofh-color-background-button-hover-inverted',
      '$ofh-color-background-button-active-inverted',
    ],
  },
  {
    title: 'Contextual colours',
    items: [
      '$ofh-color-feedback-error-2-main',
      '$ofh-color-feedback-success-2-main',
      '$ofh-color-feedback-warning-2-main',
      '$ofh-color-feedback-info-2-main',
    ],
  },
  {
    title: 'Borders',
    items: [
      '$ofh-color-border-primary',
      '$ofh-color-border-secondary',
      '$ofh-color-border-brand',
    ],
  },
  {
    title: 'Input fields',
    items: [
      '$ofh-color-border-input-default',
      '$ofh-color-border-input-active',
      '$ofh-color-background-primary',
    ],
  },
  {
    title: 'Page background',
    items: [
      '$ofh-color-background-primary',
      '$ofh-color-background-secondary',
      '$ofh-color-background-secondary-blue',
      '$ofh-color-background-secondary-yellow',
      '$ofh-color-background-secondary-grey',
    ],
  },
];

const paletteColourGroups = [
  {
    title: 'Greyscale',
    items: [
      '$ofh-color-greyscale-black',
      '$ofh-color-greyscale-1',
      '$ofh-color-greyscale-2',
      '$ofh-color-greyscale-3',
      '$ofh-color-greyscale-4',
      '$ofh-color-greyscale-5',
      '$ofh-color-greyscale-6',
      '$ofh-color-greyscale-7',
      '$ofh-color-greyscale-white',
    ],
  },
  {
    title: 'Brand blue navy',
    items: [
      '$ofh-color-brand-blue-navy-1',
      '$ofh-color-brand-blue-navy-2',
      '$ofh-color-brand-blue-navy-3-main',
      '$ofh-color-brand-blue-navy-4',
      '$ofh-color-brand-blue-navy-5',
      '$ofh-color-brand-blue-navy-6',
    ],
  },
  {
    title: 'Brand blue royal',
    items: [
      '$ofh-color-brand-blue-royal-1',
      '$ofh-color-brand-blue-royal-2',
      '$ofh-color-brand-blue-royal-3-main',
      '$ofh-color-brand-blue-royal-3',
      '$ofh-color-brand-blue-royal-5',
      '$ofh-color-brand-blue-royal-6',
    ],
  },
  {
    title: 'Brand blue aqua',
    items: [
      '$ofh-color-brand-blue-aqua-1',
      '$ofh-color-brand-blue-aqua-2',
      '$ofh-color-brand-blue-aqua-3-main',
      '$ofh-color-brand-blue-aqua-4',
      '$ofh-color-brand-blue-aqua-5',
      '$ofh-color-brand-blue-aqua-6',
    ],
  },
  {
    title: 'Brand green teal',
    items: [
      '$ofh-color-brand-green-teal-1',
      '$ofh-color-brand-green-teal-2',
      '$ofh-color-brand-green-teal-3-main',
      '$ofh-color-brand-green-teal-4',
      '$ofh-color-brand-green-teal-5',
      '$ofh-color-brand-green-teal-6',
    ],
  },
  {
    title: 'Brand green lime',
    items: [
      '$ofh-color-brand-green-lime-1',
      '$ofh-color-brand-green-lime-2',
      '$ofh-color-brand-green-lime-3-main',
      '$ofh-color-brand-green-lime-4',
      '$ofh-color-brand-green-lime-5',
      '$ofh-color-brand-green-lime-6',
    ],
  },
  {
    title: 'Brand yellow',
    items: [
      '$ofh-color-brand-yellow-1',
      '$ofh-color-brand-yellow-2',
      '$ofh-color-brand-yellow-3-main',
      '$ofh-color-brand-yellow-4',
      '$ofh-color-brand-yellow-5',
      '$ofh-color-brand-yellow-6',
    ],
  },
  {
    title: 'Brand orange',
    items: [
      '$ofh-color-brand-orange-1',
      '$ofh-color-brand-orange-2',
      '$ofh-color-brand-orange-3-main',
      '$ofh-color-brand-orange-4',
      '$ofh-color-brand-orange-5',
      '$ofh-color-brand-orange-6',
    ],
  },
  {
    title: 'Brand red',
    items: [
      '$ofh-color-brand-red-1',
      '$ofh-color-brand-red-2',
      '$ofh-color-brand-red-3-main',
      '$ofh-color-brand-red-4',
      '$ofh-color-brand-red-5',
      '$ofh-color-brand-red-6',
    ],
  },
  {
    title: 'Feedback',
    items: [
      '$ofh-color-feedback-error-1',
      '$ofh-color-feedback-error-2-main',
      '$ofh-color-feedback-error-3',
      '$ofh-color-feedback-error-4',
      '$ofh-color-feedback-success-1',
      '$ofh-color-feedback-success-2-main',
      '$ofh-color-feedback-success-3',
      '$ofh-color-feedback-success-4',
      '$ofh-color-feedback-warning-1',
      '$ofh-color-feedback-warning-2-main',
      '$ofh-color-feedback-warning-3',
      '$ofh-color-feedback-warning-4',
      '$ofh-color-feedback-info-1',
      '$ofh-color-feedback-info-2-main',
      '$ofh-color-feedback-info-3',
      '$ofh-color-feedback-info-4',
      '$ofh-color-feedback-interactive-1',
      '$ofh-color-feedback-interactive-2',
      '$ofh-color-feedback-interactive-3-main',
      '$ofh-color-feedback-interactive-4',
      '$ofh-color-feedback-interactive-5',
    ],
  },
  {
    title: 'Neutral backgrounds',
    items: [
      '$ofh-color-backgrounds-grey',
      '$ofh-color-backgrounds-blue',
      '$ofh-color-backgrounds-yellow',
    ],
  },
];

const indexCards = [
  {
    title: 'Colour',
    href: '/design-system/styles/colour',
    summary: 'Semantic colour tokens for UI work and the core palette they are built from.',
  },
  {
    title: 'Focus state',
    href: '/design-system/styles/focus-state',
    summary: 'Focus colour guidance and implementation patterns for accessible interactive states.',
  },
  {
    title: 'Icons',
    href: '/design-system/styles/icons',
    summary: 'Material icon inventory plus the fixed and responsive sizing rules used by the toolkit.',
  },
  {
    title: 'Layout',
    href: '/design-system/styles/layout',
    summary: 'Breakpoints, containers, content widths, grid widths, and page wrapper spacing.',
  },
  {
    title: 'Page template',
    href: '/design-system/styles/page-template',
    summary: 'The shared page shell, template blocks, and default content-page and transactional layouts.',
  },
  {
    title: 'Spacing',
    href: '/design-system/styles/spacing',
    summary:
      'The horizontal and vertical responsive spacing scales, static size tokens, and spacing utility classes.',
  },
  {
    title: 'Typography',
    href: '/design-system/styles/typography',
    summary: 'Responsive type styles, headline hierarchy, body sizes, and override utilities.',
  },
];

function readFile(filepath) {
  return fs.readFileSync(filepath, 'utf8');
}

function stripBlockComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '');
}

function splitStatements(text) {
  const statements = [];
  let current = '';
  let depth = 0;
  let quote = null;
  let inLineComment = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const nextCharacter = text[index + 1];

    if (inLineComment) {
      if (character === '\n') {
        inLineComment = false;
      }
      continue;
    }

    if (!quote && character === '/' && nextCharacter === '/') {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (quote) {
      current += character;
      if (character === quote && text[index - 1] !== '\\') {
        quote = null;
      }
      continue;
    }

    if (character === '\'' || character === '"') {
      quote = character;
      current += character;
      continue;
    }

    if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;
    }

    current += character;

    if (character === ';' && depth === 0) {
      const statement = current.trim();
      if (statement) {
        statements.push(statement.slice(0, -1).trim());
      }
      current = '';
    }
  }

  const trailingStatement = current.trim();
  if (trailingStatement) {
    statements.push(trailingStatement);
  }

  return statements;
}

function splitTopLevel(value, delimiter) {
  const parts = [];
  let current = '';
  let depth = 0;
  let quote = null;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (quote) {
      current += character;
      if (character === quote && value[index - 1] !== '\\') {
        quote = null;
      }
      continue;
    }

    if (character === '\'' || character === '"') {
      quote = character;
      current += character;
      continue;
    }

    if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;
    }

    if (character === delimiter && depth === 0) {
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = '';
      continue;
    }

    current += character;
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

function findTopLevelCharacter(value, target) {
  let depth = 0;
  let quote = null;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (quote) {
      if (character === quote && value[index - 1] !== '\\') {
        quote = null;
      }
      continue;
    }

    if (character === '\'' || character === '"') {
      quote = character;
      continue;
    }

    if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;
    } else if (character === target && depth === 0) {
      return index;
    }
  }

  return -1;
}

function isWrappedMap(value) {
  if (!value.startsWith('(') || !value.endsWith(')')) {
    return false;
  }

  let depth = 0;
  let quote = null;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (quote) {
      if (character === quote && value[index - 1] !== '\\') {
        quote = null;
      }
      continue;
    }

    if (character === '\'' || character === '"') {
      quote = character;
      continue;
    }

    if (character === '(') {
      depth += 1;
    } else if (character === ')') {
      depth -= 1;

      if (depth === 0 && index !== value.length - 1) {
        return false;
      }
    }
  }

  return depth === 0;
}

function normaliseExpression(value) {
  return value.replace(/\s*!default\s*$/u, '').trim();
}

function parseKey(value) {
  const trimmedValue = value.trim();

  if (
    (trimmedValue.startsWith('\'') && trimmedValue.endsWith('\'')) ||
    (trimmedValue.startsWith('"') && trimmedValue.endsWith('"'))
  ) {
    return trimmedValue.slice(1, -1);
  }

  return trimmedValue;
}

function parseExpression(value) {
  const trimmedValue = normaliseExpression(value);

  if (isWrappedMap(trimmedValue)) {
    const innerValue = trimmedValue.slice(1, -1);
    const entries = splitTopLevel(innerValue, ',');
    const parsedMap = {};

    entries.forEach((entry) => {
      const separatorIndex = findTopLevelCharacter(entry, ':');
      if (separatorIndex === -1) {
        return;
      }

      const key = parseKey(entry.slice(0, separatorIndex));
      const entryValue = entry.slice(separatorIndex + 1);
      parsedMap[key] = parseExpression(entryValue);
    });

    return {
      type: 'map',
      value: parsedMap,
    };
  }

  if (/^\$[\w-]+$/u.test(trimmedValue)) {
    return {
      type: 'reference',
      value: trimmedValue,
    };
  }

  return {
    type: 'literal',
    value: trimmedValue,
  };
}

function parseVariables(filepath) {
  const content = stripBlockComments(readFile(filepath));
  const statements = splitStatements(content);
  const variables = {};

  statements.forEach((statement) => {
    const match = statement.match(/^(\$[\w-]+)\s*:\s*([\s\S]+)$/u);

    if (!match) {
      return;
    }

    variables[match[1]] = parseExpression(match[2]);
  });

  return variables;
}

function resolveExpression(expression, registry, seen = new Set()) {
  if (!expression) {
    return null;
  }

  if (expression.type === 'literal') {
    return expression.value;
  }

  if (expression.type === 'map') {
    return Object.fromEntries(
      Object.entries(expression.value).map(([key, value]) => [
        key,
        resolveExpression(value, registry, seen),
      ]),
    );
  }

  if (expression.type === 'reference') {
    if (seen.has(expression.value) || !registry[expression.value]) {
      return expression.value;
    }

    const nextSeen = new Set(seen);
    nextSeen.add(expression.value);

    return resolveExpression(registry[expression.value], registry, nextSeen);
  }

  return null;
}

function toDisplayHex(value) {
  if (!value || !value.startsWith('#')) {
    return value;
  }

  const shortHexMatch = value.match(/^#([\da-f])([\da-f])([\da-f])$/iu);

  if (shortHexMatch) {
    return `#${shortHexMatch[1]}${shortHexMatch[1]}${shortHexMatch[2]}${shortHexMatch[2]}${shortHexMatch[3]}${shortHexMatch[3]}`.toUpperCase();
  }

  return value.toUpperCase();
}

function directSourceToken(token, registry) {
  const entry = registry[token];

  if (!entry) {
    return token;
  }

  if (entry.type === 'reference') {
    return entry.value;
  }

  return token;
}

function getTokenValue(token, registry) {
  return resolveExpression(registry[token], registry, new Set([token]));
}

function needsSwatchBorder(hexValue) {
  if (!hexValue || !hexValue.startsWith('#')) {
    return false;
  }

  const fullHex = toDisplayHex(hexValue).replace('#', '');
  const red = Number.parseInt(fullHex.slice(0, 2), 16);
  const green = Number.parseInt(fullHex.slice(2, 4), 16);
  const blue = Number.parseInt(fullHex.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance >= 220;
}

function toBreakpointSummary(scaleEntry, property) {
  const mobileValue = property ? scaleEntry.null[property] : scaleEntry.null;
  const tabletValue = property
    ? (scaleEntry.tablet || scaleEntry.null)[property]
    : scaleEntry.tablet || scaleEntry.null;
  const desktopValue = property
    ? (scaleEntry.desktop || scaleEntry.tablet || scaleEntry.null)[property]
    : scaleEntry.desktop || scaleEntry.tablet || scaleEntry.null;

  return {
    mobile: mobileValue,
    tablet: tabletValue,
    desktop: desktopValue,
  };
}

function buildTypographyData(registry) {
  const typographyScale = getTokenValue('$ofh-typography-responsive-scale', registry);
  const utilityScale = getTokenValue('$ofh-typography-utility-scale', registry);

  const rows = typographyRows.map((row) => {
    const scale = typographyScale[row.scaleKey];
    const fontSize = toBreakpointSummary(scale, 'font-size');
    const lineHeight = toBreakpointSummary(scale, 'line-height');

    return {
      ...row,
      token: row.scaleKey,
      mobile: fontSize.mobile,
      tablet: fontSize.tablet,
      desktop: fontSize.desktop,
      lineHeight: formatTriplet(lineHeight),
    };
  });

  const byId = Object.fromEntries(rows.map((row) => [row.id, row]));
  const utilityRows = Object.keys(utilityScale)
    .map((size) => Number.parseInt(size, 10))
    .sort((first, second) => second - first)
    .map((size) => {
      const scale = utilityScale[size];
      const fontSize = toBreakpointSummary(scale, 'font-size');
      const lineHeight = toBreakpointSummary(scale, 'line-height');

      return {
        id: `utility-${size}`,
        label: `${size}`,
        previewText: 'Sample text',
        className: `ofh-u-font-size-${size}`,
        mobile: fontSize.mobile,
        tablet: fontSize.tablet,
        desktop: fontSize.desktop,
        lineHeight: formatTriplet(lineHeight),
        notes:
          fontSize.tablet === fontSize.desktop
            ? 'Tablet and desktop share the same value.'
            : 'Utility collapses on smaller screens.',
      };
    });

  return {
    rows,
    byId,
    utilityRows,
  };
}

function buildSpacingData(registry) {
  const horizontalScale = getTokenValue('$ofh-space-horizontal-responsive-scale', registry);
  const verticalScale = getTokenValue('$ofh-space-vertical-responsive-scale', registry);
  const orderedSteps = Object.keys(horizontalScale)
    .map((step) => Number.parseInt(step, 10))
    .sort((first, second) => first - second);

  const toRows = (scale, utilityPrefix) =>
    orderedSteps.map((step) => {
      const values = toBreakpointSummary(scale[step]);

      return {
        step,
        mobile: values.mobile,
        tablet: values.tablet,
        desktop: values.desktop,
        staticToken: `$ofh-size-${step}`,
        utilityExample: `${utilityPrefix}${step}`,
      };
    });

  const byKey = Object.fromEntries(
    orderedSteps.map((step) => [
      step,
      {
        step,
        staticToken: `$ofh-size-${step}`,
        horizontal: toBreakpointSummary(horizontalScale[step]),
        vertical: toBreakpointSummary(verticalScale[step]),
      },
    ]),
  );

  return {
    horizontalScale: toRows(horizontalScale, 'ofh-u-margin-right-'),
    verticalScale: toRows(verticalScale, 'ofh-u-margin-bottom-'),
    byKey,
  };
}

function buildLayoutData(registry) {
  const mqBreakpoints = getTokenValue('$mq-breakpoints', registry);
  const gridWidths = getTokenValue('$_ofh-grid-widths', registry);
  const contentMaxWidth = getTokenValue('$ofh-width-content-max', registry);
  const readingWidth = extractReadingWidth();
  const mainWrapper = buildMainWrapperData(registry);

  const breakpoints = [
    {
      label: 'mobile',
      token: '$mq-breakpoints.mobile',
      value: mqBreakpoints.mobile,
      note: 'Baseline viewport width for the smallest supported layouts.',
    },
    {
      label: 'tablet',
      token: '$mq-breakpoints.tablet',
      value: mqBreakpoints.tablet,
      note: 'First responsive breakpoint used by the toolkit.',
    },
    {
      label: 'desktop',
      token: '$mq-breakpoints.desktop',
      value: mqBreakpoints.desktop,
      note: 'Default grid breakpoint for multi-column layouts.',
    },
    {
      label: 'large-desktop',
      token: '$mq-breakpoints.large-desktop',
      value: mqBreakpoints['large-desktop'],
      note: 'Used for wider navigation and layout changes.',
    },
  ];

  const widths = [
    {
      id: 'fluid',
      label: 'Fluid container',
      className: 'ofh-width-container-fluid',
      value: '100%',
      visualPercent: 100,
      note: 'Spans the viewport with responsive gutters.',
    },
    {
      id: 'content',
      label: 'Content max width',
      className: 'ofh-width-container',
      value: contentMaxWidth,
      visualPercent: 87.3,
      note: 'Used by the default fixed-width container.',
    },
    {
      id: 'reading',
      label: 'Reading width',
      className: 'ofh-u-reading-width',
      value: readingWidth,
      visualPercent: 64,
      note: 'Constrains text to around 70 to 80 characters per line.',
    },
  ];

  const gridColumns = Object.entries(gridWidths).map(([key, value]) => ({
    label: key.replace(/-/gu, ' '),
    className: `ofh-grid-column-${key}`,
    value,
    visualPercent: Number.parseFloat(value),
  }));

  return {
    breakpoints,
    widths,
    gridColumns,
    mainWrapper,
  };
}

function extractReadingWidth() {
  const content = stripBlockComments(readFile(files.mixins));
  const match = content.match(/@mixin reading-width\(\)\s*\{\s*max-width:\s*([^;]+);/u);

  return match ? match[1].trim() : '44em';
}

function buildMainWrapperData(registry) {
  const content = stripBlockComments(readFile(files.mainWrapper));
  const verticalScale = getTokenValue('$ofh-space-vertical-responsive-scale', registry);

  const mixinNames = [
    ['govuk-main-wrapper', '.ofh-main-wrapper', 'Base page wrapper for main content.'],
    ['govuk-main-wrapper--l', '.ofh-main-wrapper--l', 'Add to .ofh-main-wrapper for extra top spacing.'],
    ['govuk-main-wrapper--s', '.ofh-main-wrapper--s', 'Add to .ofh-main-wrapper for tighter transactional spacing.'],
  ];

  return mixinNames.map(([mixinName, className, note]) => {
    const blockMatch = content.match(new RegExp(`@mixin ${mixinName}\\s*\\{([\\s\\S]*?)\\}`, 'u'));
    const block = blockMatch ? blockMatch[1] : '';
    const paddingCalls = [...block.matchAll(/@include ofh-responsive-padding\((\d+),\s*'([^']+)'\);/gu)];
    const topCall = paddingCalls.find((call) => call[2] === 'top');
    const bottomCall = paddingCalls.find((call) => call[2] === 'bottom');

    return {
      className,
      top: formatSpacingTriplet(topCall ? verticalScale[topCall[1]] : null),
      bottom: formatSpacingTriplet(bottomCall ? verticalScale[bottomCall[1]] : null),
      note,
    };
  });
}

function formatTriplet(values) {
  return `D ${values.desktop} / T ${values.tablet} / M ${values.mobile}`;
}

function formatSpacingTriplet(scaleEntry) {
  if (!scaleEntry) {
    return 'Inherits base spacing';
  }

  return formatTriplet(toBreakpointSummary(scaleEntry));
}

function buildIconData(registry) {
  const iconScale = getTokenValue('$ofh-iconography-responsive-scale', registry);
  const sizeScale = Object.keys(iconScale)
    .map((size) => Number.parseInt(size, 10))
    .sort((first, second) => first - second)
    .map((size) => {
      const values = toBreakpointSummary(iconScale[size]);

      return {
        size,
        iconName: 'Search',
        mobile: values.mobile,
        tablet: values.tablet,
        desktop: values.desktop,
        fixedClass: `.ofh-icon--${size}`,
        responsiveMixin: `@include ofh-iconography-responsive(${size})`,
        notes: size === 32 ? 'The responsive 32 token collapses to 24px on mobile and tablet.' : 'Fixed classes stay at this size at every breakpoint.',
      };
    });

  return {
    sizeScale,
  };
}

function buildColourGroups(groups, registry) {
  return groups.map((group) => ({
    title: group.title,
    items: group.items.map((token) => {
      const value = getTokenValue(token, registry);
      const hex = toDisplayHex(value);

      return {
        token,
        sourceToken: directSourceToken(token, registry),
        hex,
        useBorder: needsSwatchBorder(hex),
      };
    }),
  }));
}

function buildColourData(registry) {
  return {
    semanticGroups: buildColourGroups(semanticColourGroups, registry),
    paletteGroups: buildColourGroups(paletteColourGroups, registry),
  };
}

function buildRegistry() {
  return {
    ...parseVariables(files.tokensCore),
    ...parseVariables(files.tokensBreakpoint),
    ...parseVariables(files.tokensStatic),
    ...parseVariables(files.breakpoints),
    ...parseVariables(files.grid),
    ...parseVariables(files.spacingTool),
    ...parseVariables(files.typographyUtilities),
  };
}

function buildFoundationStyles() {
  const registry = buildRegistry();

  return {
    typography: buildTypographyData(registry),
    spacing: buildSpacingData(registry),
    layout: buildLayoutData(registry),
    icons: buildIconData(registry),
    colour: buildColourData(registry),
    indexCards,
  };
}

module.exports = {
  buildFoundationStyles,
};
