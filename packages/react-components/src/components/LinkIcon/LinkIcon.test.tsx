import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { LinkIcon } from './LinkIcon';

describe('LinkIcon', () => {
  it('renders the default left icon variant', () => {
    const { container } = render(
      <LinkIcon href="#overview">Back to overview</LinkIcon>,
    );

    expect(screen.getByRole('link', { name: 'Back to overview' })).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--ChevronLeft')).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--Launch')).toBeNull();
  });

  it('renders the default right icon variant and preserves rel tokens when opening in a new window', () => {
    const { container } = render(
      <LinkIcon
        href="https://example.com/guidance"
        iconPosition="right"
        openInNewWindow
        rel="nofollow"
      >
        External guidance
      </LinkIcon>,
    );

    expect(screen.getByRole('link', { name: 'External guidance' })).toHaveAttribute(
      'rel',
      'nofollow noopener noreferrer',
    );
    expect(screen.getByRole('link', { name: 'External guidance' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(container.querySelector('.ofh-icon--Launch')).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--ChevronLeft')).toBeNull();
  });

  it('renders custom icons at the requested size', () => {
    const { container } = render(
      <LinkIcon
        href="#search"
        iconName="Search"
        iconPosition="left"
        size="medium"
      >
        Search site
      </LinkIcon>,
    );

    const icon = container.querySelector('.ofh-icon--Search');

    expect(icon).toBeInTheDocument();
    expect(container.querySelector('.ofh-link-icon')).toHaveClass(
      'ofh-link-icon--medium',
      'ofh-link-icon--icon-left',
    );
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveAttribute('height', '24');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <LinkIcon href="#overview">Back to overview</LinkIcon>,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
