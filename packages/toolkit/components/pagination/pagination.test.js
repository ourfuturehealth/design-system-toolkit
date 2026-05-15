const { getHTMLCode } = require('../../../site/views/_data/helpers');

const renderFixture = (fixturePath) => {
  document.body.innerHTML = getHTMLCode(fixturePath);
  return document.querySelector('.ofh-pagination');
};

describe('Our Future Health pagination macro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders both pagination links with updated icon names and labels', () => {
    const pagination = renderFixture('tests/fixtures/pagination/default.njk');
    const links = pagination.querySelectorAll('.ofh-pagination__link');
    const icons = pagination.querySelectorAll('.ofh-icon');

    expect(pagination).not.toBeNull();
    expect(pagination.getAttribute('role')).toBe('navigation');
    expect(pagination.getAttribute('aria-label')).toBe('Pagination');
    expect(links).toHaveLength(2);
    expect(links[0].classList.contains('ofh-pagination__link--prev')).toBe(true);
    expect(links[1].classList.contains('ofh-pagination__link--next')).toBe(true);
    expect(icons[0].classList.contains('ofh-icon--ArrowLeft')).toBe(true);
    expect(icons[1].classList.contains('ofh-icon--ArrowRight')).toBe(true);
  });

  it('renders the previous-only variant without the next link', () => {
    const pagination = renderFixture('tests/fixtures/pagination/previous-only.njk');

    expect(pagination.querySelectorAll('.ofh-pagination__link')).toHaveLength(1);
    expect(pagination.querySelector('.ofh-pagination__link--prev')).not.toBeNull();
    expect(pagination.querySelector('.ofh-pagination__link--next')).toBeNull();
  });

  it('renders the next-only variant without the previous link', () => {
    const pagination = renderFixture('tests/fixtures/pagination/next-only.njk');

    expect(pagination.querySelectorAll('.ofh-pagination__link')).toHaveLength(1);
    expect(pagination.querySelector('.ofh-pagination__link--next')).not.toBeNull();
    expect(pagination.querySelector('.ofh-pagination__link--prev')).toBeNull();
  });
});
