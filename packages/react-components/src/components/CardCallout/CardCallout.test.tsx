import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { CardCallout } from './CardCallout';

describe('CardCallout', () => {
  it('renders the warning variant with body content', () => {
    render(
      <CardCallout
        heading="Warning"
        variant="warning"
        text="Check this information before you continue."
      />,
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
    expect(
      screen.getByText('Check this information before you continue.'),
    ).toBeInTheDocument();
    expect(document.querySelector('.ofh-card-callout')).toHaveClass(
      'ofh-card-callout--warning',
    );
    expect(document.querySelector('.ofh-card-callout__spacer')).toBeInTheDocument();
    expect(document.querySelector('.ofh-card-callout__body')).toBeInTheDocument();
  });

  it('renders heading HTML when provided', () => {
    render(
      <CardCallout
        heading="Ignored heading"
        variant="warning"
        headingHtml="<span>School, nursery or work</span>"
        text="Stay away until all the spots have crusted over."
      />,
    );

    expect(screen.getByText('School, nursery or work')).toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<CardCallout ref={ref} heading="Information" text="Helpful copy." />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ofh-card-callout');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CardCallout
        heading="Success"
        variant="success"
        text="Your details have been saved successfully."
      />,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
