const { getHTMLCode } = require('../../../site/views/_data/helpers');

const renderFixture = (fixturePath) => {
  document.body.innerHTML = getHTMLCode(fixturePath);

  return {
    root: document.querySelector('.ofh-hero'),
    container: document.querySelector('.ofh-hero__container'),
    contentColumn: document.querySelector('.ofh-hero__content-column'),
    boxedContent: document.querySelector('.ofh-hero__content--boxed'),
    description: document.querySelector('.ofh-hero__description'),
    secondaryLink: document.querySelector('.ofh-hero__secondary-link'),
    primaryButton: document.querySelector('.ofh-button'),
    mediaColumn: document.querySelector('.ofh-hero__media-column'),
    image: document.querySelector('.ofh-hero__image'),
    decorations: document.querySelectorAll('.ofh-hero__decoration'),
    tilePatterns: document.querySelectorAll('.ofh-hero .ofh-tile-pattern'),
  };
};

describe('Our Future Health hero macro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the default full-width hero with actions and media', () => {
    const {
      container,
      contentColumn,
      description,
      decorations,
      image,
      primaryButton,
      root,
      secondaryLink,
      tilePatterns,
    } = renderFixture('tests/fixtures/hero/default.njk');

    expect(root.tagName).toBe('SECTION');
    expect(root.classList.contains('ofh-hero--brand')).toBe(true);
    expect(root.classList.contains('ofh-hero--free')).toBe(true);
    expect(root.classList.contains('ofh-hero--with-image')).toBe(true);
    expect(container.classList.contains('ofh-width-container-fluid')).toBe(true);
    expect(contentColumn.classList.contains('ofh-grid-column-one-half')).toBe(true);
    expect(decorations).toHaveLength(2);
    expect(tilePatterns).toHaveLength(2);
    expect(tilePatterns[0].classList.contains('ofh-tile-pattern--color-brand')).toBe(true);
    expect(root.querySelector('h1').textContent).toBe(
      'Design and build digital products at Our Future Health',
    );
    expect(description.textContent).toBe(
      'Information and guidelines to help everyone design and build consistent products.',
    );
    expect(secondaryLink.getAttribute('href')).toBe('/get-started');
    expect(primaryButton.classList.contains('ofh-button--contained')).toBe(true);
    expect(primaryButton.getAttribute('href')).toBe('https://example.com/components');
    expect(primaryButton.getAttribute('target')).toBe('_blank');
    expect(primaryButton.getAttribute('rel')).toBe('external noopener noreferrer');
    expect(image.getAttribute('src')).toBe('https://example.com/hero-image.jpg');
    expect(image.getAttribute('alt')).toBe('Example hero image');
    expect(image.getAttribute('srcset')).toBe(
      'https://example.com/hero-image-640.jpg 640w, https://example.com/hero-image-960.jpg 960w',
    );
    expect(image.getAttribute('sizes')).toBe('(min-width: 1020px) 50vw, 100vw');
  });

  it('renders boxed, decorative, root override, and safe secondary link output', () => {
    const {
      boxedContent,
      decorations,
      image,
      root,
      secondaryLink,
      tilePatterns,
    } = renderFixture('tests/fixtures/hero/boxed-decorative.njk');

    expect(root.tagName).toBe('DIV');
    expect(root.classList.contains('ofh-hero--dark')).toBe(true);
    expect(root.classList.contains('ofh-hero--boxed')).toBe(true);
    expect(root.classList.contains('ofh-hero--no-decoration')).toBe(true);
    expect(decorations).toHaveLength(0);
    expect(tilePatterns).toHaveLength(0);
    expect(root.classList.contains('custom-hero')).toBe(true);
    expect(root.getAttribute('data-track')).toBe('hero');
    expect(root.querySelector('h2').textContent).toBe('Design principles');
    expect(boxedContent).not.toBeNull();
    expect(image.getAttribute('alt')).toBe('');
    expect(image.getAttribute('aria-hidden')).toBe('true');
    expect(secondaryLink.getAttribute('target')).toBe('_blank');
    expect(secondaryLink.getAttribute('rel')).toBe('external noopener noreferrer');
    expect(secondaryLink.getAttribute('data-track')).toBe('hero-secondary');
  });

  it('renders the light theme with brand tile decoration', () => {
    const { decorations, root, tilePatterns } = renderFixture(
      'tests/fixtures/hero/light.njk',
    );

    expect(root.classList.contains('ofh-hero--light')).toBe(true);
    expect(root.classList.contains('ofh-hero--boxed')).toBe(true);
    expect(decorations).toHaveLength(3);
    expect(tilePatterns).toHaveLength(3);
    expect(tilePatterns[0].classList.contains('ofh-tile-pattern--color-brand')).toBe(true);
  });

  it('falls back to safe defaults and supports text-only trusted HTML content', () => {
    const {
      contentColumn,
      description,
      mediaColumn,
      root,
    } = renderFixture('tests/fixtures/hero/text-only-fallback.njk');

    expect(root.tagName).toBe('SECTION');
    expect(root.classList.contains('ofh-hero--brand')).toBe(true);
    expect(root.classList.contains('ofh-hero--free')).toBe(true);
    expect(root.classList.contains('ofh-hero--with-image')).toBe(false);
    expect(contentColumn.classList.contains('ofh-grid-column-two-thirds')).toBe(true);
    expect(root.querySelector('h1 span').textContent).toBe('Trusted heading');
    expect(description.querySelector('strong').textContent).toBe('Trusted description');
    expect(mediaColumn).toBeNull();
  });
});
