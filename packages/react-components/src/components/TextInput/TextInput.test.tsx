import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders with a label and input', () => {
    render(<TextInput label="Full name" />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/full name/i)).toHaveClass('ofh-label--s');
  });

  it('displays hint text', () => {
    render(<TextInput label="Email" hint="Enter a valid email address" />);

    expect(
      screen.getByText(/enter a valid email address/i),
    ).toBeInTheDocument();
  });

  it('displays error content and marks the input as invalid', () => {
    render(<TextInput errorMessage="Invalid phone number" label="Phone" />);

    expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not render a required asterisk when the input is required', () => {
    render(<TextInput label="Name" required />);

    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  it('applies fluid width classes', () => {
    render(<TextInput label="Name" width="one-half" />);

    expect(screen.getByRole('textbox')).toHaveClass('ofh-u-width-one-half');
  });

  describe('fixed widths', () => {
    const widthTests = [
      { inputWidth: 2, expectedClass: 'ofh-input--width-2' },
      { inputWidth: 3, expectedClass: 'ofh-input--width-3' },
      { inputWidth: 4, expectedClass: 'ofh-input--width-4' },
      { inputWidth: 5, expectedClass: 'ofh-input--width-5' },
      { inputWidth: 10, expectedClass: 'ofh-input--width-10' },
      { inputWidth: 20, expectedClass: 'ofh-input--width-20' },
      { inputWidth: 30, expectedClass: 'ofh-input--width-30' },
    ] as const;

    widthTests.forEach(({ inputWidth, expectedClass }) => {
      it(`applies ${expectedClass} when inputWidth is ${inputWidth}`, () => {
        render(<TextInput inputWidth={inputWidth} label="Code" />);

        expect(screen.getByRole('textbox')).toHaveClass(expectedClass);
      });
    });

    it('does not apply a fixed-width class when inputWidth is undefined', () => {
      render(<TextInput label="Code" />);

      expect(screen.getByRole('textbox').className).not.toMatch(
        /ofh-input--width-\d+/,
      );
    });
  });

  it('preserves the native maxLength attribute', () => {
    render(<TextInput label="Code" maxLength={8} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '8');
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<TextInput label="Name" />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'John Doe');

    expect(input).toHaveValue('John Doe');
  });

  it('combines hint, error, and describedBy ids in aria-describedby', () => {
    render(
      <TextInput
        describedBy="external-description"
        errorMessage="Invalid email"
        hint="Enter your email"
        label="Email"
      />,
    );
    const input = screen.getByRole('textbox');
    const inputId = input.getAttribute('id');

    expect(input).toHaveAttribute(
      'aria-describedby',
      `${inputId}-hint ${inputId}-error external-description`,
    );
  });

  it('supports rendering the label as the page heading', () => {
    render(
      <TextInput
        isPageHeading
        label="What is your name?"
        labelClassName="ofh-label--l"
      />,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /what is your name/i }),
    ).toBeInTheDocument();
  });

  it('supports the deprecated error alias', () => {
    render(<TextInput error="Enter your phone number" label="Phone number" />);

    expect(screen.getByText(/enter your phone number/i)).toBeInTheDocument();
  });

  it('supports refs to the underlying input', () => {
    const ref = { current: null as HTMLInputElement | null };

    render(<TextInput label="Name" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <TextInput
        hint="Use the name on your NHS card"
        label="Full name"
        name="full-name"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });

  it('is keyboard focusable', async () => {
    const user = userEvent.setup();
    render(<TextInput label="Full name" />);

    await user.tab();

    expect(screen.getByRole('textbox')).toHaveFocus();
  });
});
