/*
 * Our Future Health button.
 *
 * Functionality to prevent double clicks.
 * Based off https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/govuk/components/button/button.mjs
 */

const DEBOUNCE_TIMEOUT_IN_SECONDS = 10;

export default () => {
  const button = document.querySelector('.ofh-button');
  const preventDoubleClick = button.getAttribute('data-prevent-double-click') === 'true';
  let debounceFormSubmitTimer;

  const addEvents = () => {
    button.addEventListener('click', (event) => {
      if (debounceFormSubmitTimer) {
        event.preventDefault();
        return false;
      }

      debounceFormSubmitTimer = window.setTimeout(() => {
        debounceFormSubmitTimer = null;
      }, DEBOUNCE_TIMEOUT_IN_SECONDS * 1000);
      return false;
    });
  };

  if (button && preventDoubleClick) addEvents();
};
