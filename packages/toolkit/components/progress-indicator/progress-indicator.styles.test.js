/** @jest-environment node */

const path = require('path');
const sass = require('sass');

describe('Progress indicator compiled CSS', () => {
  let css;

  beforeAll(() => {
    css = sass.compile(path.resolve(__dirname, '../../ofh.scss'), {
      quietDeps: true,
      silenceDeprecations: ['if-function', 'import'],
    }).css;
  });

  it('keeps the page count on one line without shrinking', () => {
    const ruleIndex = css.indexOf('.ofh-progress-indicator__steps {');

    expect(ruleIndex).toBeGreaterThanOrEqual(0);
    const rule = css.slice(ruleIndex, css.indexOf('}', ruleIndex));

    expect(rule).toContain('flex-shrink: 0;');
    expect(rule).toContain('white-space: nowrap;');
  });

  it('separates the wrapping label from the page count', () => {
    const ruleIndex = css.indexOf('.ofh-progress-indicator__header {');

    expect(ruleIndex).toBeGreaterThanOrEqual(0);
    const rule = css.slice(ruleIndex, css.indexOf('}', ruleIndex));

    expect(rule).toContain('display: flex;');
    expect(rule).toContain('column-gap: 16px;');
    expect(rule).toContain('margin-bottom: 8px;');
  });

  it.each([
    ['ofh-progress-indicator__header', 'margin-bottom'],
    ['ofh-progress-indicator__helper', 'margin-top'],
  ])('uses responsive vertical-16 spacing for .%s', (className, property) => {
    const rules = [...css.matchAll(new RegExp(`\\.${className} \\{([^}]+)\\}`, 'g'))];
    const margins = rules
      .map((rule) => rule[1].match(new RegExp(`${property}: ([^;]+);`))?.[1])
      .filter(Boolean);

    expect(margins).toEqual(['8px', '8px', '16px']);
    expect(css).toContain(
      `@media (min-width: 40.0625em) {\n  .${className} {\n    ${property}: 8px;\n  }\n}`,
    );
    expect(css).toContain(
      `@media (min-width: 48.0625em) {\n  .${className} {\n    ${property}: 16px;\n  }\n}`,
    );
  });

  it('does not add a second vertical margin to the header text', () => {
    const typographyStart = css.indexOf('.ofh-progress-indicator__label,');
    const typographyEnd = css.indexOf('.ofh-progress-indicator__track {', typographyStart);

    expect(typographyStart).toBeGreaterThanOrEqual(0);
    expect(typographyEnd).toBeGreaterThan(typographyStart);
    expect(css.slice(typographyStart, typographyEnd)).not.toContain('margin-bottom:');
  });
});
