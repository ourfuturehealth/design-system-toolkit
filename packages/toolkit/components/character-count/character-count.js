import { I18n } from 'i18n-js';
import { normaliseDataset } from '../../common/normalise-dataset';

class CharacterCount {
  constructor($module) {
    this.config = {
      i18n: {
        en: {
          // Characters
          charactersAtLimit: 'You have 0 characters remaining',
          charactersOverLimit: {
            one: 'You have %{count} character too many',
            other: 'You have %{count} characters too many',
          },
          charactersUnderLimit: {
            one: 'You have %{count} character remaining',
            other: 'You have %{count} characters remaining',
          },
          textareaDescription: {
            other: '',
          },
          // Words
          wordsAtLimit: 'You have 0 words remaining',
          wordsOverLimit: {
            one: 'You have %{count} word too many',
            other: 'You have %{count} words too many',
          },
          wordsUnderLimit: {
            one: 'You have %{count} word remaining',
            other: 'You have %{count} words remaining',
          },
        },
      },
      maxlength: undefined,
      maxwords: undefined,
      threshold: 0,
    };

    this.i18n = new I18n(this.config.i18n, {
      locale: 'en',
    });

    this.maxLength = Infinity;
    this.lastInputTimestamp = null;
    this.lastInputValue = '';
    this.valueChecker = null;

    const $textarea = $module.querySelector('.ofh-js-character-count');

    const textareaDescriptionId = `${$textarea.id}-info`;
    const $textareaDescription = document.getElementById(textareaDescriptionId);

    if ($textareaDescription.textContent.match(/^\s*$/)) {
      $textareaDescription.textContent = this.i18n.t('textareaDescription', {
        count: this.maxLength,
      });
    }

    // Read config set using dataset ('data-' values)
    const datasetConfig = normaliseDataset($module.dataset);

    if ('maxwords' in datasetConfig) {
      this.config.maxwords = datasetConfig.maxwords;
    }
    if ('maxlength' in datasetConfig) {
      this.config.maxlength = datasetConfig.maxlength;
    }
    if ('threshold' in datasetConfig) {
      this.config.threshold = datasetConfig.threshold;
    }

    // Determine the limit attribute (characters or words)
    this.maxLength = this.config.maxwords || this.config.maxlength;
    this.$textarea = $textarea;
    this.$module = $module;

    // Move the textarea description to be immediately after the textarea
    // Kept for backwards compatibility
    $textarea.insertAdjacentElement('afterend', $textareaDescription);

    // Create the *screen reader* specific live-updating counter
    // This doesn't need any styling classes, as it is never visible
    const $screenReaderCountMessage = document.createElement('div');
    $screenReaderCountMessage.className = 'ofh-character-count__sr-status ofh-u-visually-hidden';
    $screenReaderCountMessage.setAttribute('aria-live', 'polite');
    this.$screenReaderCountMessage = $screenReaderCountMessage;
    $textareaDescription.insertAdjacentElement(
      'afterend',
      $screenReaderCountMessage
    );

    // Create our live-updating counter element, copying the classes from the
    // textarea description for backwards compatibility as these may have been
    // configured
    const $visibleCountMessage = document.createElement('div');
    $visibleCountMessage.className = $textareaDescription.className;
    $visibleCountMessage.classList.add('ofh-character-count__status');
    $visibleCountMessage.setAttribute('aria-hidden', 'true');
    this.$visibleCountMessage = $visibleCountMessage;
    $textareaDescription.insertAdjacentElement('afterend', $visibleCountMessage);

    // Hide the textarea description
    $textareaDescription.classList.add('ofh-u-visually-hidden');

    this.bindChangeEvents();

    // Remove hard limit if set
    this.$textarea.removeAttribute('maxlength');

    this.bindChangeEvents();

    // When the page is restored after navigating 'back' in some browsers the
    // state of form controls is not restored until *after* the DOMContentLoaded
    // event is fired, so we need to sync after the pageshow event.
    window.addEventListener('pageshow', () => this.updateCountMessage());

    // Although we've set up handlers to sync state on the pageshow event, init
    // could be called after those events have fired, for example if they are
    // added to the page dynamically, so update now too.
    this.updateCountMessage();
  }

  /**
   * Bind change events
   *
   * Set up event listeners on the $textarea so that the count messages update
   * when the user types.
   *
   * @private
   */
  bindChangeEvents() {
    this.$textarea.addEventListener('keyup', () => this.handleKeyUp());

    // Bind focus/blur events to start/stop polling
    this.$textarea.addEventListener('focus', () => this.handleFocus());
    this.$textarea.addEventListener('blur', () => this.handleBlur());
  }

  /**
   * Handle key up event
   *
   * Update the visible character counter and keep track of when the last update
   * happened for each keypress
   *
   * @private
   */
  handleKeyUp() {
    this.updateVisibleCountMessage();
    this.lastInputTimestamp = Date.now();
  }

  /**
   * Handle focus event
   *
   * Speech recognition software such as Dragon NaturallySpeaking will modify the
   * fields by directly changing its `value`. These changes don't trigger events
   * in JavaScript, so we need to poll to handle when and if they occur.
   *
   * Once the keyup event hasn't been detected for at least 1000 ms (1s), check if
   * the textarea value has changed and update the count message if it has.
   *
   * This is so that the update triggered by the manual comparison doesn't
   * conflict with debounced KeyboardEvent updates.
   *
   * @private
   */
  handleFocus() {
    this.valueChecker = window.setInterval(() => {
      if (
        !this.lastInputTimestamp
        || Date.now() - 500 >= this.lastInputTimestamp
      ) {
        this.updateIfValueChanged();
      }
    }, 1000);
  }

  /**
   * Handle blur event
   *
   * Stop checking the textarea value once the textarea no longer has focus
   *
   * @private
   */
  handleBlur() {
    // Cancel value checking on blur
    clearInterval(this.valueChecker);
  }

  /**
   * Update count message if textarea value has changed
   *
   * @private
   */
  updateIfValueChanged() {
    if (this.$textarea.value !== this.lastInputValue) {
      this.lastInputValue = this.$textarea.value;
      this.updateCountMessage();
    }
  }

  /**
   * Update count message
   *
   * Helper function to update both the visible and screen reader-specific
   * counters simultaneously (e.g. on init)
   *
   * @private
   */
  updateCountMessage() {
    this.updateVisibleCountMessage();
    this.updateScreenReaderCountMessage();
  }

  /**
   * Update visible count message
   *
   * @private
   */
  updateVisibleCountMessage() {
    const remainingNumber = this.maxLength - this.count(this.$textarea.value);

    // If input is over the threshold, remove the disabled class which renders the
    // counter invisible.
    if (this.isOverThreshold()) {
      this.$visibleCountMessage.classList.remove(
        'ofh-character-count__message--disabled'
      );
    } else {
      this.$visibleCountMessage.classList.add(
        'ofh-character-count__message--disabled'
      );
    }

    // Update styles
    if (remainingNumber < 0) {
      this.$textarea.classList.add('ofh-textarea--error');
      this.$visibleCountMessage.classList.remove('ofh-hint');
      this.$visibleCountMessage.classList.add('ofh-error-message');
    } else {
      this.$textarea.classList.remove('ofh-textarea--error');
      this.$visibleCountMessage.classList.remove('ofh-error-message');
      this.$visibleCountMessage.classList.add('ofh-hint');
    }

    // Update message
    this.$visibleCountMessage.textContent = this.getCountMessage();
  }

  /**
   * Update screen reader count message
   *
   * @private
   */
  updateScreenReaderCountMessage() {
    // If over the threshold, remove the aria-hidden attribute, allowing screen
    // readers to announce the content of the element.
    if (this.isOverThreshold()) {
      this.$screenReaderCountMessage.removeAttribute('aria-hidden');
    } else {
      this.$screenReaderCountMessage.setAttribute('aria-hidden', 'true');
    }

    // Update message
    this.$screenReaderCountMessage.textContent = this.getCountMessage();
  }

  /**
   * Count the number of characters (or words, if `config.maxwords` is set)
   * in the given text
   *
   * @private
   * @param {string} text - The text to count the characters of
   * @returns {number} the number of characters (or words) in the text
   */
  count(text) {
    if (this.config.maxwords) {
      const tokens = text.match(/\S+/g) || []; // Matches consecutive non-whitespace chars
      return tokens.length;
    }
    return text.length;
  }

  /**
   * Get count message
   *
   * @private
   * @returns {string} Status message
   */
  getCountMessage() {
    const remainingNumber = this.maxLength - this.count(this.$textarea.value);
    const countType = this.config.maxwords ? 'words' : 'characters';
    return this.formatCountMessage(remainingNumber, countType);
  }

  /**
   * Formats the message shown to users according to what's counted
   * and how many remain
   *
   * @private
   * @param {number} remainingNumber - The number of words/characaters remaining
   * @param {string} countType - "words" or "characters"
   * @returns {string} Status message
   */
  formatCountMessage(remainingNumber, countType) {
    if (remainingNumber === 0) {
      return this.i18n.t(`${countType}AtLimit`);
    }

    const translationKeySuffix = remainingNumber < 0 ? 'OverLimit' : 'UnderLimit';

    return this.i18n.t(`${countType}${translationKeySuffix}`, {
      count: Math.abs(remainingNumber),
    });
  }

  /**
   * Check if count is over threshold
   *
   * Checks whether the value is over the configured threshold for the input.
   * If there is no configured threshold, it is set to 0 and this function will
   * always return true.
   *
   * @private
   * @returns {boolean} true if the current count is over the config.threshold
   *   (or no threshold is set)
   */
  isOverThreshold() {
    // No threshold means we're always above threshold so save some computation
    if (!this.config.threshold) {
      return true;
    }

    // Determine the remaining number of characters/words
    const currentLength = this.count(this.$textarea.value);
    const tempMaxLength = this.maxLength;

    const thresholdValue = (tempMaxLength * this.config.threshold) / 100;

    return thresholdValue <= currentLength;
  }
}

export default () => {
  const $modules = document.querySelectorAll('[data-module="ofh-character-count"]');

  $modules.forEach((module) => {
    // eslint-disable-next-line no-new
    new CharacterCount(module);
  });
};
