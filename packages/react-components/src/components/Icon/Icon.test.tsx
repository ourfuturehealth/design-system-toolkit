import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders the default 24px sprite icon classes and href', () => {
    const { container } = render(<Icon name="Done" />);

    const icon = container.querySelector('svg');
    const use = container.querySelector('use');

    expect(icon).toHaveClass(
      'ofh-icon',
      'ofh-icon--material',
      'ofh-icon--24',
      'ofh-icon--Done',
    );
    expect(use).toHaveAttribute('href', expect.stringContaining('#ofh-icon-Done'));
  });

  it('renders the requested fixed size class and dimensions', () => {
    const { container } = render(<Icon name="Done" size={16} />);

    const icon = container.querySelector('svg');

    expect(icon).toHaveClass('ofh-icon--16');
    expect(icon).not.toHaveClass('ofh-icon--responsive-16');
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveAttribute('height', '16');
  });

  it('renders the responsive size class when responsiveSize is provided', () => {
    const { container } = render(<Icon name="Done" responsiveSize={32} />);

    const icon = container.querySelector('svg');

    expect(icon).toHaveClass(
      'ofh-icon',
      'ofh-icon--material',
      'ofh-icon--responsive-32',
      'ofh-icon--Done',
    );
    expect(icon).not.toHaveClass('ofh-icon--32');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('renders an accessible image when title is provided', () => {
    render(<Icon name="Done" title="Completed" />);

    expect(screen.getByRole('img', { name: 'Completed' })).toBeInTheDocument();
  });

  it('applies custom colour and extra classes', () => {
    const { container } = render(
      <Icon
        name="Done"
        color="#00725F"
        className="custom-icon"
        style={{ display: 'block' }}
      />,
    );

    expect(container.querySelector('svg')).toHaveClass('custom-icon');
    expect(container.querySelector('svg')).toHaveStyle({
      color: 'rgb(0, 114, 95)',
      display: 'block',
    });
  });

  it('passes through advanced svg props, spritePath, and event handlers', () => {
    const handleClick = vi.fn();

    const { container } = render(
      <Icon
        name="Done"
        title="Completed"
        spritePath="/custom/sprite.svg"
        data-track="icon-usage"
        aria-describedby="icon-help"
        tabIndex={-1}
        onClick={handleClick}
      />,
    );

    const icon = screen.getByRole('img', { name: 'Completed' });
    const use = container.querySelector('use');

    fireEvent.click(icon);

    expect(icon).toHaveAttribute('data-track', 'icon-usage');
    expect(icon).toHaveAttribute('aria-describedby', 'icon-help');
    expect(icon).toHaveAttribute('tabindex', '-1');
    expect(use).toHaveAttribute('href', '/custom/sprite.svg#ofh-icon-Done');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the svg element', () => {
    const ref = createRef<SVGSVGElement>();

    render(<Icon ref={ref} name="Done" />);

    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current).toHaveClass('ofh-icon');
  });

  it('has no accessibility violations for a decorative icon', async () => {
    const { container } = render(<Icon name="Done" />);

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
