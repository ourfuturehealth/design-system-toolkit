import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { LinkIcon } from './LinkIcon';

describe('LinkIcon', () => {
  it('renders the default left icon pattern', () => {
    const { container } = render(<LinkIcon href="#back">Go back</LinkIcon>);

    const link = screen.getByRole('link', { name: /go back/i });
    const icon = container.querySelector('svg');
    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass(
      'ofh-link-icon',
      'ofh-link-icon--small',
      'ofh-link-icon--icon-left',
    );
    expect(link).toHaveClass('ofh-link-icon__link');
    expect(icon).toHaveClass('ofh-link-icon__icon', 'ofh-icon--ChevronLeft');
  });

  it('renders the right icon pattern with the launch icon by default', () => {
    const { container } = render(
      <LinkIcon href="https://example.com" iconPosition="right">
        Open external service
      </LinkIcon>,
    );

    const link = screen.getByRole('link', { name: /open external service/i });
    const children = Array.from(link.children);
    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('ofh-link-icon--icon-right');
    expect(children[0]).toHaveClass('ofh-link-icon__text');
    expect(children[1]).toHaveClass('ofh-link-icon__icon');
    expect(container.querySelector('svg')).toHaveClass('ofh-icon--Launch');
  });

  it('supports medium size and explicit icon names', () => {
    const { container } = render(
      <LinkIcon href="#back" iconName="ChevronLeft" size="medium">
        Go back
      </LinkIcon>,
    );

    const icon = container.querySelector('svg');
    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('ofh-link-icon--medium');
    expect(icon).toHaveClass('ofh-icon--24');
  });

  it('supports icon-only colour overrides', () => {
    const { container } = render(
      <LinkIcon href="#search" iconName="Search" iconColor="#005eb8">
        Search results
      </LinkIcon>,
    );

    const icon = container.querySelector('svg');

    expect(icon).toHaveStyle({ color: 'rgb(0, 94, 184)' });
  });

  it('opens in a new window when requested', () => {
    render(
      <LinkIcon href="https://example.com" openInNewWindow>
        Open external service
      </LinkIcon>,
    );

    const link = screen.getByRole('link', { name: /open external service/i });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('handles clicks', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <LinkIcon href="#back" onClick={onClick}>
        Go back
      </LinkIcon>,
    );

    await user.click(screen.getByRole('link'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards refs to the anchor element', () => {
    const ref = createRef<HTMLAnchorElement>();

    render(
      <LinkIcon ref={ref} href="#back">
        Go back
      </LinkIcon>,
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<LinkIcon href="#back">Go back</LinkIcon>);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
