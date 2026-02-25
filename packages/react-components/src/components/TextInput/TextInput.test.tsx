import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './TextInput';
import { describe, expect, it } from 'vitest';

describe('TextInput', () => {
  it('renders with label', () => {
    render(<TextInput label="Full name" />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays hint text', () => {
    render(<TextInput label="Email" hint="Enter a valid email address" />);

    expect(
      screen.getByText(/enter a valid email address/i),
    ).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<TextInput label="Phone" error="Invalid phone number" />);

    expect(screen.getByText(/invalid phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows required asterisk', () => {
    render(<TextInput label="Name" required />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('applies width classes', () => {
    render(<TextInput label="Name" width="one-half" />);
    const input = screen.getByRole('textbox');

    expect(input).toHaveClass('ofh-u-width-one-half');
  });

  describe('max characters', () => {
    const maxCharacterTests = [
      { maxLength: 2, expectedClass: 'ofh-input--width-2' },
      { maxLength: 3, expectedClass: 'ofh-input--width-3' },
      { maxLength: 4, expectedClass: 'ofh-input--width-4' },
      { maxLength: 5, expectedClass: 'ofh-input--width-5' },
      { maxLength: 10, expectedClass: 'ofh-input--width-10' },
      { maxLength: 20, expectedClass: 'ofh-input--width-20' },
    ] as const;

    maxCharacterTests.forEach(({ maxLength, expectedClass }) => {
      it(`applies ${expectedClass} class when maxLength is ${maxLength}`, () => {
        render(<TextInput label="Code" maxLength={maxLength} />);
        const input = screen.getByRole('textbox');

        expect(input).toHaveClass(expectedClass);
      });
    });

    it('does not apply width class when maxLength is undefined', () => {
      render(<TextInput label="Code" />);
      const input = screen.getByRole('textbox');

      expect(input.className).not.toMatch(/ofh-input--width-\d+/);
    });
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<TextInput label="Name" />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'John Doe');
    expect(input).toHaveValue('John Doe');
  });

  it('associates input with hint and error via aria-describedby', () => {
    render(
      <TextInput label="Email" hint="Enter your email" error="Invalid email" />,
    );
    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('aria-describedby');
  });
});
