import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Autocomplete } from './Autocomplete';

const options = ['England', 'Scotland', 'Wales', 'Northern Ireland'];

describe('Autocomplete', () => {
  it('renders with the shared input-family label and input', () => {
    render(<Autocomplete label="Country" options={options} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
    expect(screen.getByText(/country/i)).toHaveClass('ofh-label--s');
  });

  it('wires hint, error, and describedBy content to the input', () => {
    render(
      <Autocomplete
        describedBy="external-description"
        errorMessage="Select a country"
        hint="Start typing to filter the list."
        label="Country"
        options={options}
      />,
    );
    const input = screen.getByRole('combobox');
    const inputId = input.getAttribute('id');

    expect(input).toHaveAttribute(
      'aria-describedby',
      `${inputId}-hint ${inputId}-error external-description`,
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('autocomplete__input--error');
  });

  it('filters options and supports keyboard selection', async () => {
    const user = userEvent.setup();
    const onOptionSelect = vi.fn();

    render(
      <Autocomplete
        label="Country"
        onOptionSelect={onOptionSelect}
        options={options}
      />,
    );
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.type(input, 'sc');

    expect(screen.getByRole('listbox')).toHaveClass(
      'autocomplete__menu--with-suggestions',
    );
    expect(screen.getByRole('option', { name: 'Scotland' })).toBeInTheDocument();
    expect(
      screen.queryByRole('option', { name: 'England' }),
    ).not.toBeInTheDocument();

    await user.keyboard('{ArrowDown}{Enter}');

    expect(input).toHaveValue('Scotland');
    expect(onOptionSelect).toHaveBeenCalledWith('Scotland');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('uses the label text in the default no-results message', async () => {
    const user = userEvent.setup();

    render(<Autocomplete label="Country" options={options} />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.type(input, 'zzz');

    expect(
      screen.getByText('No suggestions found. Enter a new Country.'),
    ).toBeInTheDocument();
  });

  it('allows overriding the no-results message', async () => {
    const user = userEvent.setup();

    render(
      <Autocomplete
        label="Country"
        noResultsText="No matching countries"
        options={options}
      />,
    );
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.type(input, 'zzz');

    expect(screen.getByText('No matching countries')).toBeInTheDocument();
  });

  it('supports refs to the underlying input', () => {
    const ref = { current: null as HTMLInputElement | null };

    render(<Autocomplete label="Country" options={options} ref={ref} />);

    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Autocomplete
        hint="Start typing to filter the list."
        label="Country"
        options={options}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });

  it('is keyboard focusable', async () => {
    const user = userEvent.setup();
    render(<Autocomplete label="Country" options={options} />);

    await user.tab();

    expect(screen.getByRole('combobox')).toHaveFocus();
  });
});
