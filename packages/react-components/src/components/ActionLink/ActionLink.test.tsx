import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ActionLink } from './ActionLink';

describe('ActionLink', () => {
  it('renders the action-link surface with the coloured arrow icon', () => {
    const { container } = render(
      <ActionLink href="https://example.com">Find a service</ActionLink>,
    );

    const link = screen.getByRole('link', { name: /find a service/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveClass('ofh-action-link__link');
    expect(container.querySelector('svg')).toHaveClass(
      'ofh-action-link__icon',
      'ofh-icon--ArrowCircleRightColour',
    );
  });

  it('opens in a new window when requested', () => {
    render(
      <ActionLink href="https://example.com" openInNewWindow>
        External service
      </ActionLink>,
    );

    const link = screen.getByRole('link', { name: /external service/i });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('forwards refs to the anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <ActionLink ref={ref} href="#service">
        Service
      </ActionLink>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('handles clicks', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <ActionLink href="#service" onClick={onClick}>
        Service
      </ActionLink>,
    );

    await user.click(screen.getByRole('link'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ActionLink href="#service">Service</ActionLink>,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
