import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { SummaryList } from './SummaryList';

describe('SummaryList', () => {
  const rows = [
    {
      key: { text: 'Name' },
      value: { text: 'Sarah Philips' },
      actions: {
        items: [
          {
            href: '#name',
            text: 'Change',
            visuallyHiddenText: 'name',
          },
        ],
      },
    },
    {
      key: { text: 'Contact details' },
      value: {
        html: '<p>07700 900457</p><p>sarah.phillips@example.com</p>',
      },
    },
  ];

  it('renders summary list rows with toolkit classes', () => {
    render(<SummaryList rows={rows} />);

    const summaryList = document.querySelector('.ofh-summary-list');

    expect(summaryList).toHaveClass(
      'ofh-summary-list',
      'ofh-summary-list--padded',
    );
    expect(document.querySelectorAll('.ofh-summary-list__row')).toHaveLength(2);
    expect(screen.getByText('Name')).toHaveClass('ofh-summary-list__key');
    expect(screen.getByText('Sarah Philips')).toHaveClass(
      'ofh-summary-list__value',
    );
    expect(
      screen.getByRole('link', { name: 'Change name' }),
    ).toBeInTheDocument();
  });

  it('prefers html content over text content', () => {
    render(
      <SummaryList
        rows={[
          {
            key: {
              text: 'Fallback key',
              html: '<span>HTML key</span>',
            },
            value: {
              text: 'Fallback value',
              html: '<span>HTML value</span>',
            },
          },
        ]}
      />,
    );

    expect(screen.getByText('HTML key')).toBeInTheDocument();
    expect(screen.queryByText('Fallback key')).not.toBeInTheDocument();
    expect(screen.getByText('HTML value')).toBeInTheDocument();
    expect(screen.queryByText('Fallback value')).not.toBeInTheDocument();
  });

  it('renders multiple actions with visible separators', () => {
    render(
      <SummaryList
        rows={[
          {
            key: { text: 'Name' },
            value: { text: 'Sarah Philips' },
            actions: {
              items: [
                {
                  href: '#change',
                  text: 'Change',
                  visuallyHiddenText: 'name',
                },
                {
                  href: '#remove',
                  text: 'Remove',
                  visuallyHiddenText: 'name',
                },
              ],
            },
          },
        ]}
      />,
    );

    expect(screen.getByRole('link', { name: 'Change name' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Remove name' })).toBeInTheDocument();
    expect(document.querySelectorAll('.ofh-summary-list__actions-list-item')).toHaveLength(2);
  });

  it('applies compact and no-border modifiers together', () => {
    render(
      <SummaryList
        rows={rows}
        padded={false}
        noBorder
        className="custom-summary-list"
      />,
    );

    const summaryList = document.querySelector('.ofh-summary-list');

    expect(summaryList).toHaveClass(
      'ofh-summary-list--compact',
      'ofh-summary-list--no-border',
      'custom-summary-list',
    );
  });

  it('forwards refs to the summary list element', () => {
    const ref = createRef<HTMLDListElement>();

    render(<SummaryList ref={ref} rows={rows} />);

    expect(ref.current).toBeInstanceOf(HTMLDListElement);
    expect(ref.current).toHaveClass('ofh-summary-list');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SummaryList rows={rows} />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
