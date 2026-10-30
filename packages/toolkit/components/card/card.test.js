import Card from './card';
const { getHTMLCode } = require('../../../site/views/_data/helpers');

const renderFixture = (fixturePath) => {
  document.body.innerHTML = getHTMLCode(fixturePath);
};

describe('Our Future Health card()', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does not throw when there are no cards', () => {
    expect(() => Card()).not.toThrow();
  });

  it('does nothing when a clickable card has no primary link', () => {
    document.body.innerHTML =
      '<div class="ofh-card ofh-card--clickable"><p>No link</p></div>';

    Card();

    expect(() =>
      document.querySelector('.ofh-card').dispatchEvent(
        new MouseEvent('click', { bubbles: true }),
      ),
    ).not.toThrow();
  });

  it('proxies clicks from the card surface to the primary link', () => {
    document.body.innerHTML = `
      <div class="card-container">
        <div class="ofh-card ofh-card--clickable">
          <a class="ofh-card__primary-link" href="#card-link">Open card</a>
        </div>
      </div>
    `;

    const card = document.querySelector('.ofh-card');
    const primaryLink = document.querySelector('.ofh-card__primary-link');
    const handleClick = jest.fn((event) => event.preventDefault());
    const cardClick = jest.fn();
    const parentClick = jest.fn();

    primaryLink.addEventListener('click', handleClick);
    card.addEventListener('click', cardClick);
    document.querySelector('.card-container').addEventListener('click', parentClick);

    Card();
    card.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(cardClick).toHaveBeenCalledTimes(1);
    expect(parentClick).toHaveBeenCalledTimes(1);
  });

  it('forwards surface clicks to a primary action link once', () => {
    document.body.innerHTML = `
      <div class="ofh-card ofh-card--clickable">
        <p>Card content</p>
        <a class="ofh-card__primary-link" href="#card-action">Open tasks</a>
      </div>
    `;

    const card = document.querySelector('.ofh-card');
    const primaryLink = document.querySelector('.ofh-card__primary-link');
    const linkClick = jest.fn((event) => event.preventDefault());
    const cardClick = jest.fn();

    primaryLink.addEventListener('click', linkClick);
    card.addEventListener('click', cardClick);

    Card();
    card.querySelector('p').click();

    expect(linkClick).toHaveBeenCalledTimes(1);
    expect(cardClick).toHaveBeenCalledTimes(1);
  });

  it('does not hijack clicks from nested interactive elements', () => {
    document.body.innerHTML = `
      <div class="ofh-card ofh-card--clickable">
        <a class="ofh-card__primary-link" href="#card-link">Open card</a>
        <button type="button">Dismiss</button>
      </div>
    `;

    const primaryLink = document.querySelector('.ofh-card__primary-link');
    const dismissButton = document.querySelector('button');
    const primaryClick = jest.fn((event) => event.preventDefault());
    const dismissClick = jest.fn();

    primaryLink.addEventListener('click', primaryClick);
    dismissButton.addEventListener('click', dismissClick);

    Card();
    dismissButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(dismissClick).toHaveBeenCalledTimes(1);
    expect(primaryClick).not.toHaveBeenCalled();
  });

  describe('openInNewWindow rendered macro', () => {
    it('sets target="_blank" and rel="noopener noreferrer" on the heading link', () => {
      renderFixture('tests/fixtures/card/open-in-new-window-href.njk');

      const link = document.querySelector('.ofh-card__primary-link');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.querySelector('.ofh-u-visually-hidden').textContent.trim()).toBe('(opens in new window)');
    });

    it('does not set target or rel on the heading link by default', () => {
      renderFixture('tests/fixtures/card/default.njk');

      const link = document.querySelector('.ofh-card__primary-link');
      expect(link.getAttribute('target')).toBeNull();
      expect(link.getAttribute('rel')).toBeNull();
      expect(link.querySelector('.ofh-u-visually-hidden')).toBeNull();
    });

    it('sets target="_blank" and rel on the action link when it is the primary link', () => {
      renderFixture('tests/fixtures/card/open-in-new-window-action-link.njk');

      const link = document.querySelector('.ofh-card__primary-link');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      expect(link.querySelector('.ofh-u-visually-hidden').textContent.trim()).toBe('(opens in new window)');
    });
  });

  it('does not double fire when the primary link itself is clicked', () => {
    document.body.innerHTML = `
      <div class="ofh-card ofh-card--clickable">
        <a class="ofh-card__primary-link" href="#card-link">Open card</a>
      </div>
    `;

    const primaryLink = document.querySelector('.ofh-card__primary-link');
    const handleClick = jest.fn((event) => event.preventDefault());
    const cardClick = jest.fn();

    primaryLink.addEventListener('click', handleClick);
    document.querySelector('.ofh-card').addEventListener('click', cardClick);

    Card();
    primaryLink.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(cardClick).toHaveBeenCalledTimes(1);
  });
});
