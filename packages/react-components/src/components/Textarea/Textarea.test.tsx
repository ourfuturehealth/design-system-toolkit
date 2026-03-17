import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders with a label and textarea', () => {
    render(<Textarea label="Tell us more" />);

    expect(screen.getByLabelText(/tell us more/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/tell us more/i)).toHaveClass('ofh-label--s');
  });

  it('defaults to 5 rows', () => {
    render(<Textarea label="Tell us more" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });

  it('supports custom rows', () => {
    render(<Textarea label="Tell us more" rows={10} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '10');
  });

  it('displays hint text', () => {
    render(<Textarea hint="Do not include personal details." label="Details" />);

    expect(
      screen.getByText(/do not include personal details/i),
    ).toBeInTheDocument();
  });

  it('displays error content and marks the textarea as invalid', () => {
    render(<Textarea errorMessage="Enter more detail" label="Details" />);

    expect(screen.getByText(/enter more detail/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('combines hint, error, and describedBy ids in aria-describedby', () => {
    render(
      <Textarea
        describedBy="external-description"
        errorMessage="Enter more detail"
        hint="Give us enough information to help."
        label="Details"
      />,
    );
    const textarea = screen.getByRole('textbox');
    const textareaId = textarea.getAttribute('id');

    expect(textarea).toHaveAttribute(
      'aria-describedby',
      `${textareaId}-hint ${textareaId}-error external-description`,
    );
  });

  it('supports rendering the label as the page heading', () => {
    render(
      <Textarea
        isPageHeading
        label="Can you provide more detail?"
        labelClassName="ofh-label--l"
      />,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /can you provide more detail/i,
      }),
    ).toBeInTheDocument();
  });

  it('supports refs to the underlying textarea', () => {
    const ref = { current: null as HTMLTextAreaElement | null };

    render(<Textarea label="Details" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Details" />);
    const textarea = screen.getByRole('textbox');

    await user.type(textarea, 'More detail goes here');

    expect(textarea).toHaveValue('More detail goes here');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Textarea
        hint="Do not include personal details."
        label="Tell us more"
        name="details"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });

  it('is keyboard focusable', async () => {
    const user = userEvent.setup();
    render(<Textarea label="Tell us more" />);

    await user.tab();

    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});
