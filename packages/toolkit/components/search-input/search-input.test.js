const { getHTMLCode } = require('../../../site/views/_data/helpers');

const renderFixture = (fixturePath) => {
  document.body.innerHTML = getHTMLCode(fixturePath);

  return {
    form: document.querySelector('.ofh-search-input'),
    input: document.querySelector('.ofh-search-input__input'),
    button: document.querySelector('.ofh-search-input__button'),
    icon: document.querySelector('.ofh-search-input__button .ofh-icon'),
    label: document.querySelector('label'),
  };
};

describe('Our Future Health searchInput macro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the default search control markup', () => {
    const { button, form, icon, input, label } = renderFixture(
      'tests/fixtures/search-input/default.njk',
    );

    expect(form).not.toBeNull();
    expect(form.getAttribute('role')).toBe('search');
    expect(form.getAttribute('method')).toBe('get');
    expect(input.getAttribute('type')).toBe('search');
    expect(input.getAttribute('name')).toBe('q');
    expect(input.getAttribute('placeholder')).toBe('Search');
    expect(label.textContent).toBe('Search the site');
    expect(label.classList.contains('ofh-u-visually-hidden')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Search');
    expect(icon.classList.contains('ofh-icon--Search')).toBe(true);
  });

  it('renders custom action, attributes, and values', () => {
    const { button, form, input } = renderFixture(
      'tests/fixtures/search-input/advanced.njk',
    );

    expect(form.getAttribute('action')).toBe('/search/participants');
    expect(form.getAttribute('method')).toBe('post');
    expect(form.classList.contains('custom-search-input')).toBe(true);
    expect(form.getAttribute('data-track')).toBe('site-search');
    expect(input.getAttribute('id')).toBe('participant-search');
    expect(input.getAttribute('name')).toBe('query');
    expect(input.getAttribute('value')).toBe('cohort');
    expect(input.getAttribute('autocomplete')).toBe('off');
    expect(button.getAttribute('aria-label')).toBe('Search participants');
    expect(button.getAttribute('data-qa')).toBe('search-submit');
  });
});
