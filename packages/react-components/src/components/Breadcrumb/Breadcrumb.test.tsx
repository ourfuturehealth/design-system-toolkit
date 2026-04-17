import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Breadcrumb, type BreadcrumbItem } from './Breadcrumb';

const ancestorItems: BreadcrumbItem[] = [
  {
    text: 'Health A to Z',
    href: '/health-a-to-z',
  },
  {
    text: 'Conditions',
    href: '/health-a-to-z/conditions',
  },
];

describe('Breadcrumb', () => {
  it('renders the breadcrumb trail and current item', () => {
    render(
      <Breadcrumb
        items={ancestorItems}
        current={{
          text: 'Eczema',
          href: '/health-a-to-z/conditions/eczema',
        }}
      />,
    );

    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    expect(screen.getAllByText('Health A to Z')).toHaveLength(1);
    expect(screen.getAllByText('Conditions')).toHaveLength(1);
    expect(screen.getAllByText('Eczema')).toHaveLength(2);
  });

  it('renders text-only items when href is not provided', () => {
    render(
      <Breadcrumb
        items={[
          {
            text: 'Health A to Z',
            href: '/health-a-to-z',
          },
          {
            text: 'Conditions',
          },
        ]}
      />,
    );

    const textOnlyItem = screen.getByText('Conditions');

    expect(textOnlyItem.tagName).toBe('SPAN');
  });

  it('uses the final current item as the mobile back-link label without the Back to prefix', () => {
    const { container } = render(
      <Breadcrumb
        items={ancestorItems}
        current={{
          text: 'Eczema',
          href: '/health-a-to-z/conditions/eczema',
        }}
      />,
    );

    const backLink = container.querySelector('.ofh-breadcrumb__backlink');

    expect(backLink).not.toBeNull();
    expect(backLink?.textContent?.trim()).toBe('Eczema');
  });

  it('falls back to the last linked ancestor for the mobile back link when current is not provided', () => {
    const { container } = render(<Breadcrumb items={ancestorItems} />);

    const backLink = container.querySelector('.ofh-breadcrumb__backlink');

    expect(backLink).not.toBeNull();
    expect(backLink?.textContent?.trim()).toBe('Conditions');
    expect(backLink).toHaveAttribute('href', '/health-a-to-z/conditions');
  });

  it('forwards refs and combines toolkit classes with className', () => {
    const ref = { current: null as HTMLElement | null };

    render(
      <Breadcrumb
        ref={ref}
        items={ancestorItems}
        classes="app-breadcrumb"
        className="qa-breadcrumb"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveClass('ofh-breadcrumb');
    expect(ref.current).toHaveClass('app-breadcrumb');
    expect(ref.current).toHaveClass('qa-breadcrumb');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Breadcrumb
        items={ancestorItems}
        current={{
          text: 'Eczema',
          href: '/health-a-to-z/conditions/eczema',
        }}
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
