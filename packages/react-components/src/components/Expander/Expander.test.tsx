import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Expander } from './Expander';

describe('Expander', () => {
  it('renders the expanded accordion summary icons and content panel', () => {
    const { container } = render(
      <Expander summary="Opening times">
        <p>Example content</p>
      </Expander>,
    );

    expect(screen.getByText('Opening times')).toHaveClass(
      'ofh-details__summary-text',
    );
    expect(container.querySelector('.ofh-details')).toBeInTheDocument();
    expect(container.querySelector('.ofh-expander')).toBeInTheDocument();
    expect(container.querySelector('.ofh-details__summary--expander')).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--AddCircle')).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--RemoveCircle')).toBeInTheDocument();
    expect(container.querySelector('.ofh-details__panel--expander')).toBeInTheDocument();
  });

  it('forwards standard details attributes and refs', () => {
    const ref = createRef<HTMLDetailsElement>();

    render(
      <Expander
        ref={ref}
        summary="Status"
        data-testid="expander-root"
        open
      >
        <p>Open content</p>
      </Expander>,
    );

    const expander = screen.getByTestId('expander-root');

    expect(expander).toHaveAttribute('open');
    expect(ref.current).toBeInstanceOf(HTMLDetailsElement);
    expect(ref.current).toHaveClass('ofh-expander');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Expander summary="More information">
        <p>Helpful content</p>
      </Expander>,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
