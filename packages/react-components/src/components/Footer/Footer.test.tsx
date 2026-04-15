import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import {
  Footer,
  type FooterLinkItem,
  type FooterSocialLinkItem,
} from './Footer';

describe('Footer', () => {
  const links: FooterLinkItem[] = [
    {
      href: '#help',
      label: 'Help and Support',
    },
    {
      href: 'https://example.com/careers',
      label: 'Careers',
      external: true,
      openInNewWindow: true,
    },
  ];

  const socialLinks: FooterSocialLinkItem[] = [
    {
      platform: 'linkedin',
      href: 'https://www.linkedin.com/company/our-future-health/',
      openInNewWindow: true,
    },
    {
      platform: 'x',
      href: 'https://x.com/',
      openInNewWindow: true,
    },
  ];

  it('renders footer links, copy, and social links', () => {
    const { container } = render(
      <Footer
        links={links}
        smallPrint="© Our Future Health 2026"
        legalText="Organisation legal text."
        socialLinks={socialLinks}
      />,
    );

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Help and Support' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Careers' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(screen.getByText('© Our Future Health 2026')).toBeInTheDocument();
    expect(screen.getByText('Organisation legal text.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--ChevronLeft')).toBeNull();
    expect(container.querySelector('.ofh-icon--Linkedin')).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--Launch')).toBeInTheDocument();
  });

  it('forwards refs and extra classes to the footer element', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Footer
        ref={ref}
        className="custom-footer"
        links={links}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveClass('ofh-footer', 'custom-footer');
  });

  it('omits the social section when no social links are provided', () => {
    render(<Footer links={links} />);

    expect(screen.queryByText('Follow us')).toBeNull();
    expect(screen.queryByRole('link', { name: 'LinkedIn' })).toBeNull();
  });

  it('supports custom footer link icons and lets small print be hidden', () => {
    const { container } = render(
      <Footer
        links={[
          {
            href: '#overview',
            label: 'Back to overview',
            iconName: 'ChevronLeft',
            iconPosition: 'left',
          },
          {
            href: '#search',
            label: 'Search site',
            iconName: 'Search',
            iconPosition: 'left',
          },
        ]}
        smallPrint={null}
      />,
    );

    expect(screen.getByRole('link', { name: 'Back to overview' })).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--ChevronLeft')).toBeInTheDocument();
    expect(container.querySelector('.ofh-icon--Search')).toBeInTheDocument();
    expect(container.querySelector('.ofh-footer__small-print')).toBeNull();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Footer
        links={links}
        smallPrint="© Our Future Health 2026"
        legalText="Organisation legal text."
        socialLinks={socialLinks}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
