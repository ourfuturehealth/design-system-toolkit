import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Radios } from './Radios';

const items = [
  {
    value: 'email',
    label: 'Email',
    hint: 'We will send updates by email.',
  },
  {
    value: 'phone',
    label: 'Phone',
    conditional: <div>Enter your phone number</div>,
    inputProps: {
      'aria-describedby': 'external-phone-hint',
    },
  },
  { divider: 'or' as const },
  {
    value: 'post',
    label: 'Post',
  },
];

describe('Radios', () => {
  it('renders the fieldset, supporting text, and divider', () => {
    render(
      <Radios
        hint="Choose one way for us to contact you."
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    expect(
      screen.getByRole('group', { name: /how should we contact you/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/choose one way for us to contact you/i),
    ).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
  });

  it('wires top-level supporting text to the fieldset', () => {
    render(
      <Radios
        describedBy="external-description"
        errorMessage="Select how we should contact you"
        hint="Choose one way for us to contact you."
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    expect(
      screen.getByRole('group').getAttribute('aria-describedby'),
    ).toContain('external-description');
    expect(
      screen.getByText(/select how we should contact you/i),
    ).toBeInTheDocument();
  });

  it('combines per-item hint text with input aria-describedby', () => {
    render(
      <Radios
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    expect(screen.getByLabelText('Phone').getAttribute('aria-describedby')).toContain(
      'external-phone-hint',
    );
    expect(screen.getByLabelText('Email').getAttribute('aria-describedby')).toContain(
      'contact-method-1-item-hint',
    );
  });

  it('updates the checked radio and conditional content', async () => {
    const user = userEvent.setup();

    render(
      <Radios
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    await user.click(screen.getByLabelText('Phone'));
    const conditional = document.getElementById('conditional-contact-method-2');

    expect(screen.getByLabelText('Phone')).toBeChecked();
    expect(conditional).not.toHaveClass('ofh-radios__conditional--hidden');

    await user.click(screen.getByLabelText('Post'));

    expect(screen.getByLabelText('Post')).toBeChecked();
    expect(conditional).toHaveClass('ofh-radios__conditional--hidden');
  });

  it('calls onChange with the next selected value', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Radios
        items={items}
        legend="How should we contact you?"
        name="contact-method"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Phone'));

    expect(onChange).toHaveBeenCalledWith(
      'phone',
      expect.objectContaining({ type: 'change' }),
    );
  });

  it('supports refs to the underlying fieldset', () => {
    const ref = { current: null as HTMLFieldSetElement | null };

    render(
      <Radios
        items={items}
        legend="How should we contact you?"
        name="contact-method"
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByRole('group'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Radios
        hint="Choose one way for us to contact you."
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
