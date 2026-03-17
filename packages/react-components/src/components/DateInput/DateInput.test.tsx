import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { DateInput } from './DateInput';

describe('DateInput', () => {
  it('renders the grouped fields with default day, month, and year inputs', () => {
    render(
      <DateInput
        id="dob"
        legend="What is your date of birth?"
        namePrefix="dob"
      />,
    );

    expect(
      screen.getByRole('group', { name: /what is your date of birth/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^day$/i)).toHaveAttribute('id', 'dob-day');
    expect(screen.getByLabelText(/^month$/i)).toHaveAttribute('id', 'dob-month');
    expect(screen.getByLabelText(/^year$/i)).toHaveAttribute('id', 'dob-year');
    expect(screen.getByLabelText(/^day$/i)).toHaveAttribute('name', 'dob-day');
  });

  it('displays hint text and error content and wires aria-describedby', () => {
    render(
      <DateInput
        describedBy="external-description"
        errorMessage="Enter a real date of birth"
        hint="For example, 31 3 1980"
        id="dob"
        legend="What is your date of birth?"
      />,
    );
    const fieldset = screen.getByRole('group', {
      name: /what is your date of birth/i,
    });

    expect(screen.getByText(/for example, 31 3 1980/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a real date of birth/i)).toBeInTheDocument();
    expect(fieldset).toHaveAttribute(
      'aria-describedby',
      'dob-hint dob-error external-description',
    );
  });

  it('supports custom items, classes, and initial values', () => {
    render(
      <DateInput
        id="appointment-date"
        items={[
          {
            name: 'day',
            label: 'Day',
            value: '01',
            className: 'ofh-input--width-2 ofh-input--error',
            autoComplete: 'bday-day',
          },
          {
            name: 'month',
            label: 'Month',
            value: '02',
            className: 'ofh-input--width-2',
          },
          {
            name: 'year',
            label: 'Year',
            value: '1990',
            className: 'ofh-input--width-4',
            inputMode: 'numeric',
          },
        ]}
        legend="What is your date of birth?"
        namePrefix="appointment-date"
      />,
    );

    expect(screen.getByLabelText(/^day$/i)).toHaveValue('01');
    expect(screen.getByLabelText(/^day$/i)).toHaveClass('ofh-input--error');
    expect(screen.getByLabelText(/^day$/i)).toHaveAttribute(
      'autocomplete',
      'bday-day',
    );
    expect(screen.getByLabelText(/^year$/i)).toHaveValue('1990');
  });

  it('renders the legend as the page heading when requested', () => {
    render(<DateInput isPageHeading legend="What is your date of birth?" />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /what is your date of birth/i,
      }),
    ).toBeInTheDocument();
  });

  it('supports refs to the underlying fieldset', () => {
    const ref = { current: null as HTMLFieldSetElement | null };

    render(<DateInput legend="What is your date of birth?" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('group'));
  });

  it('handles user input in each field', async () => {
    const user = userEvent.setup();
    render(
      <DateInput
        id="dob"
        legend="What is your date of birth?"
        namePrefix="dob"
      />,
    );

    await user.type(screen.getByLabelText(/^day$/i), '15');
    await user.type(screen.getByLabelText(/^month$/i), '03');
    await user.type(screen.getByLabelText(/^year$/i), '1984');

    expect(screen.getByLabelText(/^day$/i)).toHaveValue('15');
    expect(screen.getByLabelText(/^month$/i)).toHaveValue('03');
    expect(screen.getByLabelText(/^year$/i)).toHaveValue('1984');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <DateInput
        hint="For example, 31 3 1980"
        id="dob"
        legend="What is your date of birth?"
        namePrefix="dob"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });

  it('is keyboard focusable', async () => {
    const user = userEvent.setup();
    render(
      <DateInput
        id="dob"
        legend="What is your date of birth?"
        namePrefix="dob"
      />,
    );

    await user.tab();

    expect(screen.getByLabelText(/^day$/i)).toHaveFocus();
  });
});
