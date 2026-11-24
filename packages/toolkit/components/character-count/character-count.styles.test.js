/** @jest-environment node */

const path = require('path');
const sass = require('sass');

describe('Character count compiled CSS', () => {
  let css;

  beforeAll(() => {
    css = sass.compile(path.resolve(__dirname, '../../ofh.scss'), {
      quietDeps: true,
      silenceDeprecations: ['if-function', 'import'],
    }).css;
  });

  it('makes the hidden live count take precedence over hint display styles', () => {
    const selector = '.ofh-character-count__status[hidden] {';
    const ruleIndex = css.indexOf(selector);

    expect(ruleIndex).toBeGreaterThanOrEqual(0);
    expect(css.slice(ruleIndex, css.indexOf('}', ruleIndex))).toContain(
      'display: none;',
    );
  });
});
