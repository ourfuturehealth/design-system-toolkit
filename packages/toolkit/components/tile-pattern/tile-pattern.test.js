const { getHTMLCode } = require('../../../site/views/_data/helpers');

const renderFixture = (fixturePath) => {
  document.body.innerHTML = getHTMLCode(fixturePath);

  return {
    root: document.querySelector('.ofh-tile-pattern'),
    tiles: document.querySelectorAll('.ofh-tile-pattern__tile'),
    uses: document.querySelectorAll('.ofh-tile-pattern use'),
  };
};

describe('Our Future Health tile pattern macro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders an explicit decorative tile matrix', () => {
    const { root, tiles, uses } = renderFixture('tests/fixtures/tile-pattern/default.njk');

    expect(root).not.toBeNull();
    expect(root.classList.contains('ofh-tile-pattern--color-accent')).toBe(true);
    expect(root.classList.contains('custom-pattern')).toBe(true);
    expect(root.getAttribute('aria-hidden')).toBe('true');
    expect(root.getAttribute('data-track')).toBe('tile-pattern');
    expect(root.getAttribute('style')).toContain('--ofh-tile-pattern-columns: 3;');
    expect(root.getAttribute('style')).toContain('--ofh-tile-pattern-tile-size: 40px;');
    expect(root.getAttribute('style')).toContain('display: grid;');
    expect(tiles).toHaveLength(6);
    expect(tiles[2].classList.contains('ofh-tile-pattern__tile--empty')).toBe(true);
    expect(tiles[4].classList.contains('ofh-tile-pattern__tile--color-white')).toBe(true);
    expect(tiles[4].getAttribute('data-ofh-tile-pattern-type')).toBe('8');
    expect(uses).toHaveLength(5);
    expect(uses[0].getAttribute('href')).toBe('/custom/tile-pattern.svg#ofh-tile-pattern-1');
    expect(uses[4].getAttribute('href')).toBe('/custom/tile-pattern.svg#ofh-tile-pattern-9');
  });

  it('does not render without an explicit matrix', () => {
    expect(getHTMLCode('tests/fixtures/tile-pattern/missing-tiles.njk').trim()).toBe('');
  });
});
