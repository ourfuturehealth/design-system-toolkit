/** @jest-environment node */

const path = require('path');
const sass = require('sass');

const compileToolkitCss = () => {
  const entrypoint = path.resolve(__dirname, '../../ofh.scss');

  return sass.compile(entrypoint, {
    quietDeps: true,
    silenceDeprecations: ['if-function', 'import'],
  }).css;
};

describe('Header compiled CSS', () => {
  let css;

  beforeAll(() => {
    css = compileToolkitCss();
  });

  it.each([
    ['ofh-header__mobile-link', 'ofh-header__mobile-link--current'],
    ['ofh-header__mobile-subnav-link', 'ofh-header__mobile-subnav-link--current'],
  ])('keeps .%s dark when it is visited or focused after visiting', (
    linkClass,
    currentLinkClass,
  ) => {
    const baseVisitedRule = `.${linkClass}:visited`;
    const currentVisitedRule = `.${currentLinkClass}:visited`;
    const currentFocusVisitedRule = `.${currentLinkClass}:focus:visited`;
    const baseVisitedIndex = css.indexOf(baseVisitedRule);
    const currentVisitedIndex = css.indexOf(currentVisitedRule);
    const currentFocusVisitedIndex = css.indexOf(currentFocusVisitedRule);

    expect(baseVisitedIndex).toBeGreaterThanOrEqual(0);
    expect(css.slice(baseVisitedIndex, css.indexOf('}', baseVisitedIndex))).toContain(
      'color: var(--ofh-header-list-item-color);',
    );
    expect(currentVisitedIndex).toBeGreaterThan(baseVisitedIndex);
    expect(
      css.slice(currentVisitedIndex, css.indexOf('}', currentVisitedIndex)),
    ).toContain('color: #1b1b1b;');
    expect(currentFocusVisitedIndex).toBeGreaterThan(currentVisitedIndex);
    expect(
      css.slice(currentFocusVisitedIndex, css.indexOf('}', currentFocusVisitedIndex)),
    ).toContain('color: #1b1b1b;');
  });
});
