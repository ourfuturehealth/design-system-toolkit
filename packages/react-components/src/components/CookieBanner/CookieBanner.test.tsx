import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { CookieBanner } from './CookieBanner';

describe('CookieBanner', () => {
  it('renders the approved defaults with safe external links', () => {
    render(<CookieBanner />);

    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Cookies on Our Future Health',
    });
    const privacyNotice = screen.getByRole('link', { name: 'privacy notice' });

    expect(heading).toHaveClass('ofh-cookie-banner__heading');
    expect(privacyNotice).toHaveAttribute(
      'href',
      'https://ourfuturehealth.org.uk/privacy',
    );
    expect(privacyNotice).toHaveAttribute('target', '_blank');
    expect(privacyNotice).toHaveAttribute('rel', 'noopener noreferrer');
    expect(screen.getByRole('button', { name: "I'm OK with analytics cookies" })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('calls the consent callbacks and forwards action attributes', async () => {
    const onAccept = vi.fn();
    const onReject = vi.fn();
    const user = userEvent.setup();

    render(
      <CookieBanner
        onAccept={onAccept}
        onReject={onReject}
        acceptButtonAttributes={{ 'data-cookie-choice': 'accept' }}
        rejectButtonAttributes={{ 'data-cookie-choice': 'reject' }}
      />,
    );

    await user.click(screen.getByRole('button', { name: "I'm OK with analytics cookies" }));
    await user.click(screen.getByRole('button', { name: 'Do not use analytics cookies' }));

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onReject).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: "I'm OK with analytics cookies" })).toHaveAttribute(
      'data-cookie-choice',
      'accept',
    );
  });

  it('supports structured overrides and custom body content', () => {
    render(
      <CookieBanner
        heading="Cookies on Example Service"
        headingLevel={3}
        privacyNotice={{ href: '/privacy', label: 'privacy information', attributes: { target: '_self' } }}
        acceptLabel="Accept analytics"
      >
        <p>Custom body content for this service.</p>
      </CookieBanner>,
    );

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      'Cookies on Example Service',
    );
    expect(screen.getByText('Custom body content for this service.')).toBeInTheDocument();
    expect(screen.queryByText('We use small data files')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Accept analytics' })).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<CookieBanner />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
