import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { ContentsList, type ContentsListItem } from './ContentsList';

const defaultItems: ContentsListItem[] = [
  {
    text: 'What is AMD?',
    current: true,
  },
  {
    text: 'Symptoms',
    href: '/conditions/amd/symptoms',
  },
  {
    text: 'Getting diagnosed',
    href: '/conditions/amd/getting-diagnosed',
  },
];

describe('ContentsList', () => {
  it('renders the contents list with a current item and linked items', () => {
    render(<ContentsList items={defaultItems} />);

    expect(screen.getByLabelText('Pages in this guide')).toBeInTheDocument();
    expect(screen.getByText('Contents')).toHaveClass('ofh-u-visually-hidden');
    expect(screen.getByText('What is AMD?').tagName).toBe('SPAN');
    expect(screen.getByText('Symptoms').tagName).toBe('A');
  });

  it('forwards anchorProps to linked items', () => {
    render(
      <ContentsList
        items={[
          {
            text: 'Symptoms',
            href: '/conditions/amd/symptoms',
            anchorProps: {
              target: '_blank',
              rel: 'noreferrer',
              'data-track': 'contents-list-link',
            },
          },
        ]}
      />,
    );

    const link = screen.getByRole('link', { name: 'Symptoms' });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
    expect(link).toHaveAttribute('data-track', 'contents-list-link');
  });

  it('forwards refs and merges classes with className', () => {
    const ref = { current: null as HTMLElement | null };

    render(
      <ContentsList
        ref={ref}
        items={defaultItems}
        classes="app-contents-list"
        className="qa-contents-list"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveClass('ofh-contents-list');
    expect(ref.current).toHaveClass('app-contents-list');
    expect(ref.current).toHaveClass('qa-contents-list');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<ContentsList items={defaultItems} />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
