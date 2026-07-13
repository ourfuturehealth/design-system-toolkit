import { createRef } from 'react';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { TilePattern } from './TilePattern';

describe('TilePattern', () => {
  it('renders an explicit decorative tile matrix', () => {
    const { container } = render(
      <TilePattern
        color="accent"
        tileSize="40px"
        className="custom-pattern"
        data-track="tile-pattern"
        style={{ display: 'grid' }}
        tiles={[
          [1, 2, null],
          [7, { type: 8, color: 'white' }, 9],
        ]}
      />,
    );

    const root = container.querySelector('.ofh-tile-pattern');
    const tiles = container.querySelectorAll('.ofh-tile-pattern__tile');
    const svgs = container.querySelectorAll('.ofh-tile-pattern__svg');

    expect(root).toHaveClass(
      'ofh-tile-pattern',
      'ofh-tile-pattern--color-accent',
      'custom-pattern',
    );
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-track', 'tile-pattern');
    expect(root).toHaveStyle({
      '--ofh-tile-pattern-columns': '3',
      '--ofh-tile-pattern-tile-size': '40px',
      display: 'grid',
    });
    expect(tiles).toHaveLength(6);
    expect(tiles[2]).toHaveClass('ofh-tile-pattern__tile--empty');
    expect(tiles[4]).toHaveClass('ofh-tile-pattern__tile--color-white');
    expect(tiles[4]).toHaveAttribute('data-ofh-tile-pattern-type', '8');
    expect(svgs).toHaveLength(5);
    expect(svgs[0].innerHTML).toContain('<path');
  });

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<TilePattern ref={ref} tiles={[[1]]} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ofh-tile-pattern');
  });

  it('does not render without an explicit matrix', () => {
    const { container, rerender } = render(<TilePattern tiles={[]} />);

    expect(container.querySelector('.ofh-tile-pattern')).toBeNull();

    rerender(<TilePattern tiles={[[]]} />);

    expect(container.querySelector('.ofh-tile-pattern')).toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TilePattern tiles={[[1, null], [2, 3]]} />);

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
