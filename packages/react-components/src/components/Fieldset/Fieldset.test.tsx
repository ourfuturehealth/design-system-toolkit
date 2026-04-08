import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Fieldset } from './Fieldset';

describe('Fieldset', () => {
  it('renders a fieldset with the base class and children', () => {
    render(
      <Fieldset>
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(screen.getByText('Grouped content').closest('fieldset')).toHaveClass(
      'ofh-fieldset',
    );
  });

  it('renders a legend when provided', () => {
    render(
      <Fieldset legend="What is your address?">
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(screen.getByText('What is your address?').closest('legend')).toHaveClass(
      'ofh-fieldset__legend',
    );
  });

  it('maps legendSize values to the published legend classes', () => {
    render(
      <Fieldset legend="Contact details" legendSize="large">
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(screen.getByText('Contact details').closest('legend')).toHaveClass(
      'ofh-fieldset__legend',
      'ofh-fieldset__legend--l',
    );
  });

  it('treats legendSize none as the base legend styling', () => {
    render(
      <Fieldset legend="Contact details" legendSize="none">
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(screen.getByText('Contact details').closest('legend')).toHaveClass(
      'ofh-fieldset__legend',
    );
    expect(screen.getByText('Contact details').closest('legend')).not.toHaveClass(
      'ofh-fieldset__legend--s',
      'ofh-fieldset__legend--m',
      'ofh-fieldset__legend--l',
      'ofh-fieldset__legend--xl',
    );
  });

  it('renders the legend as a page heading when requested', () => {
    render(
      <Fieldset
        isPageHeading
        legend="What is your address?"
        legendSize="large"
      >
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'What is your address?' }),
    ).toHaveClass('ofh-fieldset__heading');
  });

  it('combines describedBy and aria-describedby values', () => {
    render(
      <Fieldset
        aria-describedby="external-description"
        describedBy="fieldset-hint"
        legend="Contact details"
      >
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(screen.getByText('Grouped content').closest('fieldset')).toHaveAttribute(
      'aria-describedby',
      'fieldset-hint external-description',
    );
  });

  it('forwards native attributes and custom classes', () => {
    render(
      <Fieldset className="custom-fieldset" data-testid="fieldset" id="contact-details">
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(screen.getByTestId('fieldset')).toHaveClass(
      'ofh-fieldset',
      'custom-fieldset',
    );
    expect(screen.getByTestId('fieldset')).toHaveAttribute('id', 'contact-details');
  });

  it('does not render a legend when none is provided', () => {
    const { container } = render(
      <Fieldset>
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(container.querySelector('legend')).toBeNull();
  });

  it('supports refs to the fieldset element', () => {
    const ref = React.createRef<HTMLFieldSetElement>();

    render(
      <Fieldset ref={ref}>
        <div>Grouped content</div>
      </Fieldset>,
    );

    expect(ref.current).toBeInstanceOf(HTMLFieldSetElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Fieldset describedBy="fieldset-hint" legend="What is your address?">
        <p className="ofh-hint" id="fieldset-hint">
          Include your postcode if you know it.
        </p>
        <label className="ofh-label" htmlFor="address-line-1">
          Address line 1
        </label>
        <input className="ofh-input" id="address-line-1" type="text" />
      </Fieldset>,
    );

    const results = await axe(container);

    expect(results.violations).toEqual([]);
  });
});
