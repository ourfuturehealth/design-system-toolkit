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
  });
});
