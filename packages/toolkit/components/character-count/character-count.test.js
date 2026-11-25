const { getHTMLCode } = require('../../../site/views/_data/helpers');

describe('Our Future Health characterCount macro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the show-count-on-edit configuration', () => {
    document.body.innerHTML = getHTMLCode(
      'tests/fixtures/character-count/show-count-on-edit.njk',
    );

    const characterCount = document.querySelector('.ofh-character-count');
    const staticLimit = document.getElementById('details-info');

    expect(characterCount.dataset.showCountOnEdit).toBe('true');
    expect(staticLimit.textContent.trim()).toBe(
      'You can enter up to 500 characters',
    );
  });
});
