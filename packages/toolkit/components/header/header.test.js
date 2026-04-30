const { getHTMLCode } = require('../../../site/views/_data/helpers');

const renderFixture = (fixturePath) => {
  document.body.innerHTML = getHTMLCode(fixturePath);

  return {
    root: document.querySelector('.ofh-header'),
    brand: document.querySelector('.ofh-header__brand-link'),
    utilityLink: document.querySelector('.ofh-header__utility-link'),
    search: document.querySelector('.ofh-header__search'),
    desktopAction: document.querySelector('.ofh-header__action-link'),
    accountLinks: document.querySelectorAll('.ofh-header__account-link'),
    navCurrent: document.querySelector('.ofh-header__nav-link--current'),
    navGroupToggle: document.querySelector('[data-ofh-header-group-toggle]'),
    navPanel: document.querySelector('[data-ofh-header-group-panel]'),
    menuButton: document.querySelector('.ofh-header__menu-button'),
    mobilePanel: document.querySelector('[data-ofh-header-mobile-panel]'),
  };
};

describe('Our Future Health header macro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the default light header shell', () => {
    const {
      brand,
      menuButton,
      navCurrent,
      navGroupToggle,
      root,
    } = renderFixture('tests/fixtures/header/default.njk');

    expect(root).not.toBeNull();
    expect(root.classList.contains('ofh-header--light')).toBe(true);
    expect(root.classList.contains('ofh-header--capped')).toBe(true);
    expect(brand.getAttribute('aria-label')).toBe('Our Future Health home');
    expect(navCurrent.getAttribute('aria-current')).toBe('page');
    expect(navGroupToggle.getAttribute('aria-expanded')).toBe('false');
    expect(menuButton.classList.contains('ofh-button--outlined')).toBe(true);
  });

  it('renders the complete dark header with search, account, and hidden panels', () => {
    const {
      accountLinks,
      brand,
      desktopAction,
      menuButton,
      mobilePanel,
      navPanel,
      root,
      search,
      utilityLink,
    } = renderFixture('tests/fixtures/header/full.njk');

    expect(root.classList.contains('ofh-header--dark')).toBe(true);
    expect(
      brand.querySelector('.ofh-header__brand-logo-image').getAttribute('src'),
    ).toContain('ofh-logo-default.svg');
    expect(
      root.querySelector('.ofh-header__partner-image').getAttribute('src'),
    ).toContain('nhs-partnership-england-mobile-inverted.svg');
    expect(brand.querySelector('.ofh-header__partner-image')).toBeNull();
    expect(utilityLink.getAttribute('target')).toBe('_blank');
    expect(search).not.toBeNull();
    expect(desktopAction.getAttribute('href')).toBe('/join');
    expect(accountLinks).toHaveLength(2);
    expect(menuButton.classList.contains('ofh-button--ghost-inverted')).toBe(true);
    expect(navPanel.hidden).toBe(true);
    expect(mobilePanel.hidden).toBe(true);
  });
});
