import type React from 'react';
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a labelled search field and submit button', () => {
    render(
      <SearchInput
        action="/search"
        label="Search the site"
      />,
    );

    expect(
      screen.getByRole('searchbox', { name: 'Search the site' }),
    ).toHaveAttribute('name', 'q');
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
    expect(screen.getByRole('search')).toHaveAttribute('action', '/search');
  });

  it('supports placeholder, default value, and input props', () => {
    render(
      <SearchInput
        defaultValue="genomics"
        label="Search resources"
        name="term"
        placeholder="Search resources"
        inputProps={{
          autoComplete: 'off',
          'data-track': 'search-input',
        }}
      />,
    );

    const input = screen.getByRole('searchbox', {
      name: 'Search resources',
    });

    expect(input).toHaveValue('genomics');
    expect(input).toHaveAttribute('placeholder', 'Search resources');
    expect(input).toHaveAttribute('autocomplete', 'off');
    expect(input).toHaveAttribute('data-track', 'search-input');
    expect(input).toHaveAttribute('name', 'term');
  });

  it('submits the form when Enter is pressed in the input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    render(
      <SearchInput
        label="Search the site"
        onSubmit={onSubmit}
      />,
    );

    await user.type(
      screen.getByRole('searchbox', { name: 'Search the site' }),
      'cohort{enter}',
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not mix a top-level defaultValue with controlled input props', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const onChange = vi.fn();

    render(
      <SearchInput
        defaultValue="genomics"
        label="Search the site"
        inputProps={{
          onChange,
          value: 'controlled value',
        }}
      />,
    );

    expect(
      screen.getByRole('searchbox', { name: 'Search the site' }),
    ).toHaveValue('controlled value');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('forwards refs to the form and input elements', () => {
    const formRef = createRef<HTMLFormElement>();
    const inputRef = createRef<HTMLInputElement>();

    render(
      <SearchInput
        inputRef={inputRef}
        label="Search the site"
        ref={formRef}
      />,
    );

    expect(formRef.current).toBeInstanceOf(HTMLFormElement);
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <SearchInput
        action="/search"
        label="Search the site"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
