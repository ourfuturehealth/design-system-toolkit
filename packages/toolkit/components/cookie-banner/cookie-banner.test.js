const { getHTMLCode } = require('../../../site/views/_data/helpers');

const renderFixture = (fixturePath) => {
  document.body.innerHTML = getHTMLCode(fixturePath);
  return document.querySelector('.ofh-cookie-banner');
};

describe('Our Future Health cookieBanner macro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the approved defaults with safe external links and button actions', () => {
    const banner = renderFixture('tests/fixtures/cookie-banner/default.njk');
    const heading = banner.querySelector('h2');
    const links = banner.querySelectorAll('.ofh-cookie-banner__link');
    const buttons = banner.querySelectorAll('button');

    expect(banner.tagName).toBe('SECTION');
    expect(banner.getAttribute('aria-labelledby')).toBe('ofh-cookie-banner-heading');
    expect(heading.textContent).toBe('Cookies on Our Future Health');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('https://ourfuturehealth.org.uk/privacy');
    expect(links[0].getAttribute('target')).toBe('_blank');
    expect(links[0].getAttribute('rel')).toBe('noopener noreferrer');
    expect(buttons).toHaveLength(2);
    expect(buttons[0].getAttribute('type')).toBe('button');
    expect(buttons[0].getAttribute('data-cookie-choice')).toBe('accept');
    expect(buttons[1].getAttribute('data-cookie-choice')).toBe('reject');
  });

  it('supports custom headings, body HTML, and action attributes', () => {
    const banner = renderFixture('tests/fixtures/cookie-banner/custom.njk');
    const heading = banner.querySelector('h3');
    const buttons = banner.querySelectorAll('button');

    expect(banner.getAttribute('aria-labelledby')).toBe('example-cookies-heading');
    expect(heading.textContent).toBe('Cookies on Example Service');
    expect(banner.querySelector('.ofh-cookie-banner__body strong').textContent).toBe(
      'Custom content',
    );
    expect(banner.querySelector('.ofh-cookie-banner__link')).toBeNull();
    expect(buttons[0].textContent.trim()).toBe('Accept analytics');
    expect(buttons[0].getAttribute('name')).toBe('cookie-choice');
    expect(buttons[0].getAttribute('value')).toBe('accept');
  });
});
