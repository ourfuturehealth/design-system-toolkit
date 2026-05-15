import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { InsetText } from './InsetText';

describe('InsetText', () => {
  it('renders the default info variant with a hidden label when no heading is provided', () => {
    render(
      <InsetText text="You can report any suspected side effect to the Yellow Card safety scheme." />,
    );

    expect(document.querySelector('.ofh-inset-text')).toHaveClass(
      'ofh-inset-text--info',
      'ofh-inset-text--background-grey',
    );
    expect(
      screen.getByText('Information:', { selector: '.ofh-u-visually-hidden' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'You can report any suspected side effect to the Yellow Card safety scheme.',
      ),
    ).toBeInTheDocument();
  });

  it('renders heading, action link, and custom classes', () => {
    render(
      <InsetText
        heading="Warning"
        headingLevel={2}
        variant="warning"
        background="yellow"
        text="Bring your invitation letter with you on the day."
        actionLink={{
          text: 'View preparation guidance',
          href: '#view-preparation-guidance',
          attributes: {
            className: 'custom-action-link',
          },
        }}
        className="custom-inset-text"
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Warning', level: 2 }),
    ).toBeInTheDocument();
    expect(document.querySelector('.ofh-inset-text')).toHaveClass(
      'ofh-inset-text--warning',
      'ofh-inset-text--background-yellow',
      'custom-inset-text',
    );
    expect(
      screen.getByRole('link', { name: 'View preparation guidance' }),
    ).toHaveAttribute('href', '#view-preparation-guidance');
    expect(
      screen.queryByText('Warning:', { selector: '.ofh-u-visually-hidden' }),
    ).toBeNull();
  });

  it('renders trusted html content and forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <InsetText
        ref={ref}
        heading="Information"
        html="<p><strong>Keep this note visible</strong> while you complete the next step.</p>"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ofh-inset-text');
    expect(screen.getByText('Keep this note visible')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <InsetText
        heading="Success"
        variant="success"
        background="blue"
        text="Your preferences have been updated."
        actionLink={{
          text: 'Manage preferences',
          href: '#manage-preferences',
        }}
      />,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
