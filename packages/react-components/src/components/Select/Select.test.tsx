import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Select } from './Select';

const items = [
  { value: '', text: 'Choose an option' },
  { value: 'apple', text: 'Apple' },
  { value: 'orange', text: 'Orange' },
];

describe('Select', () => {
  it('renders with a label and options', () => {
    render(<Select items={items} label="Favourite fruit" />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText(/favourite fruit/i)).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByText(/favourite fruit/i)).toHaveClass('ofh-label--s');
    expect(document.querySelector('.ofh-select__icon .ofh-icon')).toBeTruthy();
  });

  it('displays hint text', () => {
    render(
      <Select
        hint="Choose the one you eat most often."
        items={items}
        label="Favourite fruit"
      />,
    );

    expect(
      screen.getByText(/choose the one you eat most often/i),
    ).toBeInTheDocument();
  });

  it('displays error content and marks the select as invalid', () => {
    render(
      <Select
        errorMessage="Select a fruit"
        items={items}
        label="Favourite fruit"
      />,
    );

    expect(screen.getByText(/select a fruit/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('combines hint, error, and describedBy ids in aria-describedby', () => {
    render(
      <Select
        describedBy="external-description"
        errorMessage="Select a fruit"
        hint="Choose the one you eat most often."
        items={items}
        label="Favourite fruit"
      />,
    );
    const select = screen.getByRole('combobox');
    const selectId = select.getAttribute('id');

    expect(select).toHaveAttribute(
      'aria-describedby',
      `${selectId}-hint ${selectId}-error external-description`,
    );
  });

  it('uses item.selected as the initial selection when uncontrolled', () => {
    render(
      <Select
        items={[
          { value: '', text: 'Choose an option' },
          { value: 'apple', text: 'Apple' },
          { value: 'orange', text: 'Orange', selected: true },
        ]}
        label="Favourite fruit"
      />,
    );

    expect(screen.getByRole('combobox')).toHaveValue('orange');
  });

  it('prefers explicit defaultValue over item.selected', () => {
    render(
      <Select
        defaultValue="apple"
        items={[
          { value: '', text: 'Choose an option' },
          { value: 'apple', text: 'Apple' },
          { value: 'orange', text: 'Orange', selected: true },
        ]}
        label="Favourite fruit"
      />,
    );

    expect(screen.getByRole('combobox')).toHaveValue('apple');
  });

  it('supports rendering the label as the page heading', () => {
    render(
      <Select
        isPageHeading
        items={items}
        label="Which fruit do you prefer?"
        labelClassName="ofh-label--l"
      />,
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /which fruit do you prefer/i,
      }),
    ).toBeInTheDocument();
  });

  it('supports refs to the underlying select', () => {
    const ref = { current: null as HTMLSelectElement | null };

    render(<Select items={items} label="Favourite fruit" ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('handles user selection', async () => {
    const user = userEvent.setup();
    render(<Select items={items} label="Favourite fruit" />);
    const select = screen.getByRole('combobox');

    await user.selectOptions(select, 'orange');

    expect(select).toHaveValue('orange');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Select
        hint="Choose the one you eat most often."
        items={items}
        label="Favourite fruit"
        name="favourite-fruit"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });

  it('is keyboard focusable', async () => {
    const user = userEvent.setup();
    render(<Select items={items} label="Favourite fruit" />);

    await user.tab();

    expect(screen.getByRole('combobox')).toHaveFocus();
  });
});
