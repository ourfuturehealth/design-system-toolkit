import Header from '../../components/header/header';
const { getHTMLCode } = require('../../../site/views/_data/helpers');

const initTest = () => {
  document.body.innerHTML = getHTMLCode('tests/fixtures/header/full.njk');
  Header();

  return {
    menuButton: document.querySelector('[data-ofh-header-menu-toggle]'),
    mobilePanel: document.querySelector('[data-ofh-header-mobile-panel]'),
    desktopGroupToggles: document.querySelectorAll('[data-ofh-header-group-toggle]'),
    desktopGroupPanels: document.querySelectorAll('[data-ofh-header-group-panel]'),
    mobileGroupToggle: document.querySelector('[data-ofh-header-mobile-group-toggle]'),
    mobileGroupPanel: document.querySelector('[data-ofh-header-mobile-group-panel]'),
    mobileLinks: document.querySelectorAll('.ofh-header__mobile-link'),
    mobileSubnavLink: document.querySelector('.ofh-header__mobile-subnav-link'),
  };
};

describe('Our Future Health header()', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does not throw when no header markup exists', () => {
    Header();
  });

  it('toggles the mobile panel and nested mobile groups', () => {
    const {
      menuButton,
      mobileLinks,
      mobileGroupPanel,
      mobileGroupToggle,
      mobilePanel,
      mobileSubnavLink,
    } = initTest();

    menuButton.click();
    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(menuButton.textContent).toBe('Close');
    expect(mobilePanel.hidden).toBe(false);

    mobileGroupToggle.click();
    expect(mobileGroupToggle.getAttribute('aria-expanded')).toBe('true');
    expect(mobileGroupPanel.hidden).toBe(false);
    expect(mobileLinks[0].textContent.trim()).toBe('Join now');
    expect(mobileLinks[1].textContent.trim()).toBe('Account');
    expect(mobileLinks[2].textContent.trim()).toBe('Log out');

    mobileSubnavLink.click();
    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(menuButton.textContent).toBe('Menu');
    expect(mobilePanel.hidden).toBe(true);
    expect(mobileGroupPanel.hidden).toBe(true);
  });

  it('keeps only one desktop dropdown open at a time', () => {
    const {
      desktopGroupPanels,
      desktopGroupToggles,
    } = initTest();

    desktopGroupToggles[0].click();
    expect(desktopGroupToggles[0].getAttribute('aria-expanded')).toBe('true');
    expect(desktopGroupPanels[0].hidden).toBe(false);

    desktopGroupToggles[1].click();
    expect(desktopGroupToggles[0].getAttribute('aria-expanded')).toBe('false');
    expect(desktopGroupPanels[0].hidden).toBe(true);
    expect(desktopGroupToggles[1].getAttribute('aria-expanded')).toBe('true');
    expect(desktopGroupPanels[1].hidden).toBe(false);
  });
});
