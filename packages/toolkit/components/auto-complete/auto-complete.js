import accessibleAutocomplete from 'accessible-autocomplete';

export default () => {
  const elementContainers = document.querySelectorAll('.ofh-js-autocomplete-element');

  elementContainers.forEach((elementContainer) => {
    const element = elementContainer.querySelector('.ofh-js-autocomplete-element-suggestions');
    const input = elementContainer.querySelector('input[type="text"]');

    const defaultValueOption = element.getAttribute('data-default-value') || '';
    const fieldName = element.getAttribute('data-field-name') || '';
    const { id } = input;
    const labelText = input.labels[0]?.innerText || input.labels[0]?.textContent || 'value';
    const label = labelText.trim().toLowerCase();
    const options = `${id}_options`;

    accessibleAutocomplete({
      defaultValue: defaultValueOption,
      element,
      id,
      name: fieldName,
      source: window[options],
      tNoResults: () => `No suggestions found. Enter a new ${label}.`,
    });

    // Move autocomplete to the form group containing the input to be replaced
    const inputFormGroup = element.previousElementSibling;
    if (inputFormGroup.contains(input)) {
      inputFormGroup.appendChild(element);
    }

    const autocompleteInput = element.querySelector('.autocomplete__input');
    const autocompleteMenu = element.querySelector('.autocomplete__menu');

    if (autocompleteInput) {
      const describedBy = input.getAttribute('aria-describedby');
      const ariaInvalid = input.getAttribute('aria-invalid');

      if (describedBy) {
        autocompleteInput.setAttribute('aria-describedby', describedBy);
      }

      if (ariaInvalid) {
        autocompleteInput.setAttribute('aria-invalid', ariaInvalid);
      }

      if (input.classList.contains('ofh-input--error')) {
        autocompleteInput.classList.add('autocomplete__input--error');
      }
    }

    if (autocompleteMenu) {
      const updateMenuClasses = () => {
        const hasNoResultsOption = autocompleteMenu.querySelector(
          '.autocomplete__option--no-results',
        );
        autocompleteMenu.classList.toggle(
          'autocomplete__menu--with-suggestions',
          !hasNoResultsOption && autocompleteMenu.children.length > 0,
        );
      };

      const observer = new MutationObserver(() => updateMenuClasses());

      observer.observe(autocompleteMenu, {
        childList: true,
        subtree: true,
      });

      updateMenuClasses();
    }

    input.remove();
  });
};
