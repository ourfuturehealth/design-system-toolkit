/** @jest-environment node */

const path = require('path');
const sass = require('sass');

describe('Radios compiled CSS', () => {
  let css;

  beforeAll(() => {
    css = sass.compile(path.resolve(__dirname, '../../ofh.scss'), {
      quietDeps: true,
      silenceDeprecations: ['if-function', 'import'],
    }).css;
  });

  it('hides unchecked conditional content before JavaScript initialises', () => {
    const supportsRule = '@supports selector(:has(input:checked))';
    const selector = '.ofh-radios__item:not(:has(.ofh-radios__input:checked)) + .ofh-radios__conditional {';
    const ruleIndex = css.indexOf(selector);

    expect(css).toContain(supportsRule);
    expect(ruleIndex).toBeGreaterThanOrEqual(0);
    expect(css.slice(ruleIndex, css.indexOf('}', ruleIndex))).toContain(
      'display: none;',
    );
  });

  it('shows conditional content immediately when its radio is checked', () => {
    const selector = '.ofh-radios__item:has(.ofh-radios__input:checked) + .ofh-radios__conditional {';
    const ruleIndex = css.indexOf(selector);
    const javascriptHiddenRuleIndex = css.indexOf(
      '.js-enabled .ofh-radios__conditional--hidden {',
    );

    expect(ruleIndex).toBeGreaterThan(javascriptHiddenRuleIndex);
    expect(css.slice(ruleIndex, css.indexOf('}', ruleIndex))).toContain(
      'display: block;',
    );
  });
});
