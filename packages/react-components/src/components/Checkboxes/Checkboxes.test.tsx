import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Checkboxes } from './Checkboxes';

const items = [
  {
    value: 'email',
    label: 'Email',
    hint: 'We will send updates by email.',
    exclusiveGroup: 'contact',
  },
  {
    value: 'phone',
    label: 'Phone',
    conditional: <div>Enter your phone number</div>,
    exclusiveGroup: 'contact',
    inputProps: {
      'aria-describedby': 'external-phone-hint',
    },
  },
  { divider: 'or' as const },
  {
    value: 'newsletter',
    label: 'Newsletter',
    exclusiveGroup: 'newsletter',
  },
  {
    value: 'none',
    label: 'No contact',
    exclusive: true,
    exclusiveGroup: 'contact',
  },
];

describe('Checkboxes', () => {
  it('renders the fieldset, supporting text, and divider', () => {
    render(
      <Checkboxes
        hint="Select all contact methods that apply."
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    expect(
      screen.getByRole('group', { name: /how should we contact you/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/select all contact methods that apply/i),
    ).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
  });

  it('wires top-level supporting text to the fieldset', () => {
    render(
      <Checkboxes
        describedBy="external-description"
        errorMessage="Select at least one contact method"
        hint="Select all contact methods that apply."
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    expect(
      screen.getByRole('group').getAttribute('aria-describedby'),
    ).toContain('external-description');
    expect(
      screen.getByText(/select at least one contact method/i),
    ).toBeInTheDocument();
  });

  it('combines per-item hint text with input aria-describedby', () => {
    render(
      <Checkboxes
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

  it('reveals conditional content and applies exclusive behaviour within a group only', async () => {
    const user = userEvent.setup();

    render(
      <Checkboxes
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    const conditional = document.getElementById('conditional-contact-method-2');

    expect(conditional).toHaveAttribute('hidden');

    await user.click(screen.getByLabelText('Phone'));
    await user.click(screen.getByLabelText('Newsletter'));

    expect(conditional).not.toHaveAttribute('hidden');
    expect(conditional).not.toHaveClass('ofh-checkboxes__conditional--hidden');
    expect(screen.getByLabelText('Phone')).toBeChecked();
    expect(screen.getByLabelText('Newsletter')).toBeChecked();

    await user.click(screen.getByLabelText('No contact'));

    expect(screen.getByLabelText('Phone')).not.toBeChecked();
    expect(screen.getByLabelText('No contact')).toBeChecked();
    expect(screen.getByLabelText('Newsletter')).toBeChecked();
    expect(conditional).toHaveAttribute('hidden');
    expect(conditional).toHaveClass('ofh-checkboxes__conditional--hidden');
  });

  it('calls onChange with the next selected values', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Checkboxes
        items={items}
        legend="How should we contact you?"
        name="contact-method"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Email'));

    expect(onChange).toHaveBeenCalledWith(
      ['email'],
      expect.objectContaining({ type: 'change' }),
    );
  });

  it('supports refs to the underlying fieldset', () => {
    const ref = { current: null as HTMLFieldSetElement | null };

    render(
      <Checkboxes
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
      <Checkboxes
        hint="Select all contact methods that apply."
        items={items}
        legend="How should we contact you?"
        name="contact-method"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
