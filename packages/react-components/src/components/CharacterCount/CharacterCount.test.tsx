import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { CharacterCount } from './CharacterCount';

function getVisibleStatusMessage() {
  return document.querySelector('.ofh-character-count__status');
}

describe('CharacterCount', () => {
  it('renders the textarea with a hidden description and visible status message', () => {
    render(
      <CharacterCount label="Summary" maxLength={10} name="summary" />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(
      screen.getByText('You can enter up to 10 characters'),
    ).toHaveClass('ofh-u-visually-hidden');
    expect(getVisibleStatusMessage()).toHaveTextContent(
      'You have 10 characters remaining',
    );
  });

  it('updates the visible count message as the user types', async () => {
    const user = userEvent.setup();

    render(
      <CharacterCount label="Summary" maxLength={10} name="summary" />,
    );
    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'hello');

    expect(getVisibleStatusMessage()).toHaveTextContent(
      'You have 5 characters remaining',
    );
  });

  it('shows error styling when the value goes over the limit', async () => {
    const user = userEvent.setup();

    render(
      <CharacterCount label="Summary" maxLength={5} name="summary" />,
    );
    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'exceeds');

    expect(textarea).toHaveClass('ofh-textarea--error');
    expect(getVisibleStatusMessage()).toHaveClass(
      'ofh-error-message',
    );
    expect(getVisibleStatusMessage()).toHaveTextContent(
      'You have 2 characters too many',
    );
    expect(getVisibleStatusMessage()?.closest('.ofh-form-group')).not.toBeNull();
  });

  it('supports thresholded status visibility', async () => {
    const user = userEvent.setup();

    render(
      <CharacterCount
        label="Summary"
        maxLength={10}
        name="summary"
        threshold={80}
      />,
    );
    const textarea = screen.getByRole('textbox');
    const status = getVisibleStatusMessage();

    expect(status).toHaveClass('ofh-character-count__message--disabled');

    await user.type(textarea, '12345678');

    expect(status).toHaveTextContent('You have 2 characters remaining');
    expect(status).not.toHaveClass(
      'ofh-character-count__message--disabled',
    );
  });

  it('supports word counts', async () => {
    const user = userEvent.setup();

    render(
      <CharacterCount label="Summary" maxWords={5} name="summary" />,
    );
    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'one two three');

    expect(getVisibleStatusMessage()).toHaveTextContent(
      'You have 2 words remaining',
    );
  });

  it('does not apply a native maxlength attribute to the textarea', () => {
    render(
      <CharacterCount label="Summary" maxLength={10} name="summary" />,
    );

    expect(screen.getByRole('textbox')).not.toHaveAttribute('maxlength');
  });

  it('supports refs to the underlying textarea', () => {
    const ref = { current: null as HTMLTextAreaElement | null };

    render(
      <CharacterCount label="Summary" maxLength={10} name="summary" ref={ref} />,
    );

    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('does not show count state or error styling when no limit is configured', async () => {
    const user = userEvent.setup();

    render(
      <CharacterCount label="Summary" name="summary" />,
    );

    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'No limit configured');

    expect(textarea).not.toHaveClass('ofh-textarea--error');
    expect(document.querySelector('.ofh-character-count__status')).toBeNull();
    expect(textarea).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CharacterCount
        hint="Do not include personal details."
        label="Summary"
        maxLength={50}
        name="summary"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
