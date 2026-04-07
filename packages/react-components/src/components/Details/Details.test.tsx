import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Details } from './Details';

describe('Details', () => {
  it('renders the compact disclosure summary icons and content panel', () => {
    const { container } = render(
      <Details summary="Where can I find my NHS number?">
        <p>Example content</p>
      </Details>,
    );

    expect(screen.getByText('Where can I find my NHS number?')).toHaveClass(
      'ofh-details__summary-text',
    );
    expect(container.querySelector('.ofh-details')).toBeInTheDocument();
    expect(container.querySelector('.ofh-details__summary--details')).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--ChevronRight')).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--ExpandMore')).toBeInTheDocument();
    expect(container.querySelector('.ofh-details__panel--details')).toBeInTheDocument();
  });

  it('forwards standard details attributes and refs', () => {
    const ref = createRef<HTMLDetailsElement>();

    render(
      <Details
        ref={ref}
        summary="Status"
        data-testid="details-root"
        open
      >
        <p>Open content</p>
      </Details>,
    );

    const details = screen.getByTestId('details-root');

    expect(details).toHaveAttribute('open');
    expect(ref.current).toBeInstanceOf(HTMLDetailsElement);
    expect(ref.current).toHaveClass('ofh-details');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Details summary="More information">
        <p>Helpful content</p>
      </Details>,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
