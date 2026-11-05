const { getHTMLCode } = require('../../../site/views/_data/helpers');

describe('Our Future Health footer macro', () => {
  beforeEach(() => {
    document.body.innerHTML = getHTMLCode('tests/fixtures/footer/social-links.njk');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders Bluesky with accessible link text and both icon states', () => {
    const link = document.querySelector('a[href="https://bsky.app/profile/ourfuturehealthuk.bsky.social"]');

    expect(link).not.toBeNull();
    expect(link.textContent.trim()).toBe('Bluesky');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.querySelector('.ofh-footer__social-icon--default use').getAttribute('href'))
      .toBe('/assets/icons/icon-sprite.svg#ofh-icon-Bluesky');
    expect(link.querySelector('.ofh-footer__social-icon--hover use').getAttribute('href'))
      .toBe('/assets/icons/icon-sprite.svg#ofh-icon-BlueskyHover');
  });

  it('keeps X available for existing footers', () => {
    const link = document.querySelector('a[href="https://x.com/"]');

    expect(link).not.toBeNull();
    expect(link.textContent.trim()).toBe('X');
    expect(link.querySelector('.ofh-footer__social-icon--default use').getAttribute('href'))
      .toBe('/assets/icons/icon-sprite.svg#ofh-icon-X');
    expect(link.querySelector('.ofh-footer__social-icon--hover use').getAttribute('href'))
      .toBe('/assets/icons/icon-sprite.svg#ofh-icon-XHover');
  });
});
