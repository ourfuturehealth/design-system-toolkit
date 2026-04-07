import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { SkipLink } from './SkipLink';

describe('SkipLink', () => {
  it('renders the default skip link copy and destination', () => {
    render(<SkipLink />);

    const link = screen.getByRole('link', {
      name: /skip to main content/i,
    });

    expect(link).toHaveClass('ofh-skip-link');
    expect(link).toHaveAttribute('href', '#maincontent');
  });

  it('accepts custom label and href', () => {
    render(<SkipLink href="#results">Skip to results</SkipLink>);

    const link = screen.getByRole('link', { name: /skip to results/i });

    expect(link).toHaveAttribute('href', '#results');
  });

  it('forwards refs to the anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(<SkipLink ref={ref}>Skip to content</SkipLink>);

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('passes through additional anchor props', () => {
    const onClick = vi.fn();

    render(
      <SkipLink
        data-track="skip-link"
        aria-label="Skip navigation"
        onClick={onClick}
      >
        Skip to main content
      </SkipLink>,
    );

    const link = screen.getByRole('link', { name: /skip navigation/i });

    expect(link).toHaveAttribute('data-track', 'skip-link');
  });

  it('handles clicks', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<SkipLink onClick={onClick}>Skip to main content</SkipLink>);

    await user.click(screen.getByRole('link'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SkipLink />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
