import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders the default 24px icon classes and bundled SVG body', () => {
    const { container } = render(<Icon name="Check" />);

    const icon = container.querySelector('svg');
    const use = container.querySelector('use');
    const group = container.querySelector('g');

    expect(icon).toHaveClass(
      'ofh-icon',
      'ofh-icon--material',
      'ofh-icon--24',
      'ofh-icon--Check',
    );
    expect(icon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(use).toBeNull();
    expect(group?.innerHTML).toContain('<path');
  });

  it('renders the requested fixed size class and dimensions', () => {
    const { container } = render(<Icon name="Check" size={16} />);

    const icon = container.querySelector('svg');

    expect(icon).toHaveClass('ofh-icon--16');
    expect(icon).not.toHaveClass('ofh-icon--responsive-16');
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveAttribute('height', '16');
  });

  it('renders the responsive size class when responsiveSize is provided', () => {
    const { container } = render(<Icon name="Check" responsiveSize={32} />);

    const icon = container.querySelector('svg');

    expect(icon).toHaveClass(
      'ofh-icon',
      'ofh-icon--material',
      'ofh-icon--responsive-32',
      'ofh-icon--Check',
    );
    expect(icon).not.toHaveClass('ofh-icon--32');
    expect(icon).toHaveAttribute('width', '32');
    expect(icon).toHaveAttribute('height', '32');
  });

  it('renders no bundled SVG body for an unknown icon name', () => {
    const { container } = render(<Icon name="NotARealIcon" />);

    const icon = container.querySelector('svg');
    const use = container.querySelector('use');
    const group = container.querySelector('g');

    expect(icon).toHaveClass(
      'ofh-icon',
      'ofh-icon--material',
      'ofh-icon--24',
      'ofh-icon--NotARealIcon',
    );
    expect(icon).not.toHaveAttribute('viewBox');
    expect(use).toBeNull();
    expect(group).toBeNull();
  });

  it('renders an accessible image when title is provided', () => {
    render(<Icon name="Check" title="Completed" />);

    expect(screen.getByRole('img', { name: 'Completed' })).toBeInTheDocument();
  });

  it('applies custom colour and extra classes', () => {
    const { container } = render(
      <Icon
        name="Check"
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

  it('passes through advanced svg props and event handlers', () => {
    const handleClick = vi.fn();

    const { container } = render(
      <Icon
        name="Check"
        title="Completed"
        data-track="icon-usage"
        aria-describedby="icon-help"
        tabIndex={-1}
        onClick={handleClick}
      />,
    );

    const icon = screen.getByRole('img', { name: 'Completed' });
    const use = container.querySelector('use');
    const group = container.querySelector('g');

    fireEvent.click(icon);

    expect(icon).toHaveAttribute('data-track', 'icon-usage');
    expect(icon).toHaveAttribute('aria-describedby', 'icon-help');
    expect(icon).toHaveAttribute('tabindex', '-1');
    expect(use).toBeNull();
    expect(group?.innerHTML).toContain('<path');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to the svg element', () => {
    const ref = createRef<SVGSVGElement>();

    render(<Icon ref={ref} name="Check" />);

    expect(ref.current).toBeInstanceOf(SVGSVGElement);
    expect(ref.current).toHaveClass('ofh-icon');
  });

  it('has no accessibility violations for a decorative icon', async () => {
    const { container } = render(<Icon name="Check" />);

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
