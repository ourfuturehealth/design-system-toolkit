import accessibleAutocomplete from 'accessible-autocomplete';

const autocompleteWidthClassPrefixes = ['ofh-u-width-', 'ofh-input--width-'];

function isAutocompleteWidthClass(className) {
  return autocompleteWidthClassPrefixes.some((prefix) =>
    className.startsWith(prefix),
  );
}

export default () => {
  const elementContainers = document.querySelectorAll('.ofh-js-autocomplete-element');

  elementContainers.forEach((elementContainer) => {
    const element = elementContainer.querySelector('.ofh-js-autocomplete-element-suggestions');
    const input = elementContainer.querySelector('input[type="text"]');

    const defaultValueOption = element.getAttribute('data-default-value') || '';
    const fieldName = element.getAttribute('data-field-name') || '';
    const noResultsText = element.getAttribute('data-no-results-text');
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
      tNoResults: () =>
        noResultsText || `No suggestions found. Enter a new ${label}.`,
    });

    // Move autocomplete to the form group containing the input to be replaced
    const inputFormGroup = element.previousElementSibling;
    if (inputFormGroup.contains(input)) {
      inputFormGroup.appendChild(element);
    }

    const autocompleteInput = element.querySelector('.autocomplete__input');
    const autocompleteMenu = element.querySelector('.autocomplete__menu');
    const autocompleteWrapper =
      element.querySelector('.autocomplete__wrapper') || element;

    if (autocompleteInput) {
      const describedBy = input.getAttribute('aria-describedby');
      const ariaInvalid = input.getAttribute('aria-invalid');
      const classNames = Array.from(input.classList);
      const widthClasses = classNames.filter(isAutocompleteWidthClass);
      const inputClasses = classNames.filter(
        (className) =>
          className !== 'ofh-input'
          && className !== 'ofh-input--error'
          && !isAutocompleteWidthClass(className),
      );
      const attributesToSkip = new Set([
        'aria-describedby',
        'aria-invalid',
        'class',
        'id',
        'name',
        'type',
        'value',
      ]);

      if (widthClasses.length > 0) {
        autocompleteWrapper.classList.add(...widthClasses);
      }

      if (inputClasses.length > 0) {
        autocompleteInput.classList.add(...inputClasses);
      }

      if (describedBy) {
        autocompleteInput.setAttribute('aria-describedby', describedBy);
      }

      if (ariaInvalid) {
        autocompleteInput.setAttribute('aria-invalid', ariaInvalid);
      }

      if (input.classList.contains('ofh-input--error')) {
        autocompleteInput.classList.add('autocomplete__input--error');
      }

      input.getAttributeNames().forEach((attributeName) => {
        if (attributesToSkip.has(attributeName)) {
          return;
        }

        const attributeValue = input.getAttribute(attributeName);

        if (attributeValue === null) {
          autocompleteInput.setAttribute(attributeName, '');
          return;
        }

        autocompleteInput.setAttribute(attributeName, attributeValue);
      });
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
