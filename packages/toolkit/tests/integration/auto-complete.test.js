import accessibleAutocomplete from 'accessible-autocomplete';
import AutoComplete from '../../components/auto-complete/auto-complete';

jest.mock('accessible-autocomplete', () => jest.fn());

describe('AutoComplete module', () => {
  beforeEach(() => {
    accessibleAutocomplete.mockImplementation(
      ({ defaultValue, id, name, element }) => {
        const wrapper = document.createElement('div');
        const input = document.createElement('input');
        const menu = document.createElement('ul');

        wrapper.className = 'autocomplete__wrapper';
        input.className = 'autocomplete__input';
        input.id = id;
        input.name = name;
        input.value = defaultValue;
        menu.className = 'autocomplete__menu autocomplete__menu--hidden';

        wrapper.appendChild(input);
        wrapper.appendChild(menu);
        element.appendChild(wrapper);
      },
    );
  });

  afterEach(() => {
    accessibleAutocomplete.mockReset();
    delete window.organisation_options;
  });

  it('replaces the original input and preserves the enhanced input attributes and width classes', () => {
    document.body.innerHTML = `
      <div class="ofh-js-autocomplete-element">
        <div class="ofh-form-group ofh-form-group--error">
          <div class="ofh-input__header">
            <label class="ofh-label ofh-label--s ofh-input__label" for="organisation">Organisation</label>
            <div class="ofh-hint ofh-input__hint" id="organisation-hint">Select an organisation</div>
            <span class="ofh-error-message ofh-input__error-message" id="organisation-error">Enter an organisation</span>
          </div>
          <input
            class="ofh-input ofh-input--error ofh-input--width-20 js-track-field"
            id="organisation"
            type="text"
            aria-describedby="organisation-hint organisation-error"
            aria-invalid="true"
            autocomplete="organization"
            placeholder="Start typing"
            required
          />
        </div>
        <div
          class="ofh-js-autocomplete-element-suggestions"
          data-default-value="Acme"
          data-field-name="organisation"
        ></div>
      </div>
    `;
    window.organisation_options = ['Acme'];

    AutoComplete();

    expect(accessibleAutocomplete).toHaveBeenCalledWith(
      expect.objectContaining({
        defaultValue: 'Acme',
        id: 'organisation',
        name: 'organisation',
      }),
    );

    const autocompleteInput = document.querySelector('.autocomplete__input');

    expect(document.getElementById('organisation')).toBe(autocompleteInput);
    expect(autocompleteInput.getAttribute('aria-describedby')).toBe(
      'organisation-hint organisation-error',
    );
    expect(autocompleteInput.getAttribute('aria-invalid')).toBe('true');
    expect(autocompleteInput.getAttribute('autocomplete')).toBe('organization');
    expect(autocompleteInput.getAttribute('placeholder')).toBe('Start typing');
    expect(autocompleteInput.hasAttribute('required')).toBe(true);
    expect(autocompleteInput.classList.contains('autocomplete__input--error')).toBe(
      true,
    );
    expect(autocompleteInput.classList.contains('js-track-field')).toBe(true);
    expect(
      document.querySelector('.autocomplete__wrapper').classList.contains(
        'ofh-input--width-20',
      ),
    ).toBe(true);
    expect(document.querySelector('.ofh-form-group > .ofh-input')).toBeNull();
  });

  it('passes a custom no-results message to accessible autocomplete when provided', () => {
    document.body.innerHTML = `
      <div class="ofh-js-autocomplete-element">
        <div class="ofh-form-group">
          <div class="ofh-input__header">
            <label class="ofh-label ofh-label--s ofh-input__label" for="organisation">Organisation</label>
          </div>
          <input class="ofh-input" id="organisation" type="text" />
        </div>
        <div
          class="ofh-js-autocomplete-element-suggestions"
          data-field-name="organisation"
          data-no-results-text="No matching organisations. Enter a new organisation."
        ></div>
      </div>
    `;
    window.organisation_options = ['Acme'];

    AutoComplete();

    const [{ tNoResults }] = accessibleAutocomplete.mock.calls[0];

    expect(tNoResults()).toBe(
      'No matching organisations. Enter a new organisation.',
    );
  });

  it('toggles the suggestions header class based on the rendered menu items', async () => {
    document.body.innerHTML = `
      <div class="ofh-js-autocomplete-element">
        <div class="ofh-form-group">
          <div class="ofh-input__header">
            <label class="ofh-label ofh-label--s ofh-input__label" for="organisation">Organisation</label>
          </div>
          <input class="ofh-input" id="organisation" type="text" />
        </div>
        <div class="ofh-js-autocomplete-element-suggestions" data-field-name="organisation"></div>
      </div>
    `;
    window.organisation_options = ['Acme'];

    AutoComplete();

    const menu = document.querySelector('.autocomplete__menu');
    const option = document.createElement('li');

    option.className = 'autocomplete__option';
    menu.appendChild(option);

    await Promise.resolve();

    expect(menu.classList.contains('autocomplete__menu--with-suggestions')).toBe(
      true,
    );

    option.remove();

    const noResultsOption = document.createElement('li');

    noResultsOption.className =
      'autocomplete__option autocomplete__option--no-results';
    menu.appendChild(noResultsOption);

    await Promise.resolve();

    expect(menu.classList.contains('autocomplete__menu--with-suggestions')).toBe(
      false,
    );
  });
});
