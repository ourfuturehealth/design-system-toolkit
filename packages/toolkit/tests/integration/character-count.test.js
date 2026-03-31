import CharacterCount from '../../components/character-count/character-count';

describe('CharacterCount module', () => {
  it('shows an over-limit error message and error styling when the limit is exceeded', () => {
    document.body.innerHTML = `
      <div class="ofh-character-count" data-module="ofh-character-count" data-maxlength="10">
        <div class="ofh-form-group">
          <textarea class="ofh-js-character-count ofh-textarea" id="details"></textarea>
          <div class="ofh-hint ofh-character-count__message" id="details-info">
            You can enter up to 10 characters
          </div>
        </div>
      </div>
    `;

    CharacterCount();

    const textarea = document.getElementById('details');
    const visibleStatus = document.querySelector('.ofh-character-count__status');

    textarea.value = 'abcdefghijkl';
    textarea.dispatchEvent(new KeyboardEvent('keyup'));

    expect(visibleStatus.textContent).toBe('You have 2 characters too many');
    expect(textarea.classList.contains('ofh-textarea--error')).toBe(true);
    expect(visibleStatus.classList.contains('ofh-error-message')).toBe(true);
    expect(visibleStatus.closest('.ofh-form-group')).not.toBeNull();
  });

  it('keeps the visible status hidden until the threshold is reached', () => {
    document.body.innerHTML = `
      <div class="ofh-character-count" data-module="ofh-character-count" data-maxlength="10" data-threshold="80">
        <div class="ofh-form-group">
          <textarea class="ofh-js-character-count ofh-textarea" id="summary"></textarea>
          <div class="ofh-hint ofh-character-count__message" id="summary-info">
            You can enter up to 10 characters
          </div>
        </div>
      </div>
    `;

    CharacterCount();

    const textarea = document.getElementById('summary');
    const visibleStatus = document.querySelector('.ofh-character-count__status');

    expect(
      visibleStatus.classList.contains('ofh-character-count__message--disabled'),
    ).toBe(true);

    textarea.value = 'abcdefgh';
    textarea.dispatchEvent(new KeyboardEvent('keyup'));

    expect(
      visibleStatus.classList.contains('ofh-character-count__message--disabled'),
    ).toBe(false);
    expect(visibleStatus.textContent).toBe('You have 2 characters remaining');
  });
});
