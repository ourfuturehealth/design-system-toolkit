import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { CardDoDont } from './CardDoDont';

describe('CardDoDont', () => {
  it('renders a do list with the default heading', () => {
    render(
      <CardDoDont
        items={[
          { item: 'cover blisters that are likely to burst' },
          { item: 'wash your hands before touching a burst blister' },
        ]}
      />,
    );

    expect(screen.getByText('Do')).toBeInTheDocument();
    expect(
      screen.getByText('cover blisters that are likely to burst'),
    ).toBeInTheDocument();
    expect(document.querySelector('.ofh-card-do-dont__spacer')).toBeInTheDocument();
    expect(document.querySelector('.ofh-card-do-dont__body')).toBeInTheDocument();
  });

  it('renders a don’t list without the legacy prefix by default', () => {
    render(
      <CardDoDont
        type="dont"
        items={[{ item: 'burst a blister yourself' }]}
      />,
    );

    expect(screen.getByText('Don’t')).toBeInTheDocument();
    expect(screen.getByText('burst a blister yourself')).toBeInTheDocument();
    expect(
      screen.queryByText('do not burst a blister yourself'),
    ).not.toBeInTheDocument();
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<CardDoDont ref={ref} items={[{ item: 'Keep items short' }]} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ofh-card-do-dont');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <CardDoDont
        type="do"
        items={[
          { item: 'cover blisters that are likely to burst' },
          { item: 'wash your hands before touching a burst blister' },
        ]}
      />,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
