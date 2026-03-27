const { getHTMLCode } = require('../../../site/views/_data/helpers');

const renderFixture = (fixturePath) => {
  document.body.innerHTML = getHTMLCode(fixturePath);
  return document.querySelector('svg');
};

describe('Our Future Health icon macro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the default decorative icon output', () => {
    const icon = renderFixture('tests/fixtures/icon/default.njk');
    const use = icon.querySelector('use');

    expect(icon).not.toBeNull();
    expect(icon.classList.contains('ofh-icon')).toBe(true);
    expect(icon.classList.contains('ofh-icon--material')).toBe(true);
    expect(icon.classList.contains('ofh-icon--24')).toBe(true);
    expect(icon.classList.contains('ofh-icon--Search')).toBe(true);
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
    expect(icon.getAttribute('role')).toBeNull();
    expect(icon.getAttribute('width')).toBe('24');
    expect(icon.getAttribute('height')).toBe('24');
    expect(use.getAttribute('href')).toBe('/assets/icons/icon-sprite.svg#ofh-icon-Search');
  });

  it('renders the requested fixed size class and dimensions', () => {
    const icon = renderFixture('tests/fixtures/icon/fixed-size.njk');

    expect(icon.classList.contains('ofh-icon--16')).toBe(true);
    expect(icon.classList.contains('ofh-icon--responsive-16')).toBe(false);
    expect(icon.getAttribute('width')).toBe('16');
    expect(icon.getAttribute('height')).toBe('16');
  });

  it('renders advanced options for responsive icons', () => {
    const icon = renderFixture('tests/fixtures/icon/responsive-advanced.njk');
    const title = icon.querySelector('title');
    const use = icon.querySelector('use');
    const style = icon.getAttribute('style');

    expect(icon.classList.contains('ofh-icon--responsive-32')).toBe(true);
    expect(icon.classList.contains('ofh-icon--32')).toBe(false);
    expect(icon.classList.contains('custom-icon')).toBe(true);
    expect(icon.getAttribute('aria-hidden')).toBe('false');
    expect(icon.getAttribute('focusable')).toBeNull();
    expect(icon.getAttribute('role')).toBe('img');
    expect(icon.getAttribute('width')).toBe('32');
    expect(icon.getAttribute('height')).toBe('32');
    expect(icon.getAttribute('data-track')).toBe('expand-icon');
    expect(icon.getAttribute('aria-describedby')).toBe('icon-help');
    expect(style).toContain('color: #00725F;');
    expect(style).toContain('display: block;');
    expect(title.textContent).toBe('Expand options');
    expect(use.getAttribute('href')).toBe('/custom/sprite.svg#ofh-icon-UnfoldMore');
  });

  it('renders nothing when name is missing', () => {
    expect(getHTMLCode('tests/fixtures/icon/missing-name.njk').trim()).toBe('');
  });
});
