import accessibleAutocomplete from 'accessible-autocomplete';

export default () => {
  const elementContainers = document.querySelectorAll('.ofh-js-autocomplete-element');

  elementContainers.forEach((elementContainer) => {
    const element = elementContainer.querySelector('.ofh-js-autocomplete-element-suggestions');
    const input = elementContainer.querySelector('input[type="text"]');

    const defaultValueOption = element.getAttribute('data-default-value') || '';
    const fieldName = element.getAttribute('data-field-name') || '';
    const { id } = input;
    const label = input.labels[0].innerText.toLowerCase() || 'value';
    const options = `${id}_options`;

    accessibleAutocomplete({
      defaultValue: defaultValueOption,
      element,
      id,
      name: fieldName,
      source: window[options],
      tNoResults: () => `No results found. Enter your ${label}.`,
    });

    // Move autocomplete to the form group containing the input to be replaced
    const inputFormGroup = element.previousElementSibling;
    if (inputFormGroup.contains(input)) {
      inputFormGroup.appendChild(element);
    }

    input.remove();

    // Add hint text for the autocomplete input
    const container = element.parentNode;
    const divHint = document.createElement('div');
    divHint.id = `${id}-hint`;
    divHint.className = 'ofh-hint';
    divHint.innerHTML = `Select from the results or enter your ${label}`;
    container.insertBefore(divHint, element);
  });
};
