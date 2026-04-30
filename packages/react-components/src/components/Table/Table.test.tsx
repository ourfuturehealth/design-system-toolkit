import { createRef } from 'react';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Table } from './Table';

const defaultHead = [
  { content: 'Skin symptoms' },
  { content: 'Possible cause' },
];

const defaultRows = [
  [
    { content: 'Blisters on lips or around the mouth' },
    { content: 'Cold sores' },
  ],
  [
    { content: 'Itchy, dry, cracked, sore' },
    { content: 'Eczema' },
  ],
];

describe('Table', () => {
  it('renders a standard table with caption, headings, and rows', () => {
    render(
      <Table
        caption="Skin symptoms and possible causes"
        head={defaultHead}
        rows={defaultRows}
      />,
    );

    expect(screen.getByText('Skin symptoms and possible causes')).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Skin symptoms' })).toBeVisible();
    expect(screen.getByRole('cell', { name: 'Cold sores' })).toBeVisible();
  });

  it('renders row headers when firstCellIsHeader is enabled', () => {
    render(
      <Table
        caption="Treatments by type"
        firstCellIsHeader
        head={[
          { content: 'Treatment' },
          { content: 'Uses' },
        ]}
        rows={[
          [
            { content: 'Antibiotics' },
            { content: 'Treat bacterial infections' },
          ],
        ]}
      />,
    );

    expect(screen.getByRole('rowheader', { name: 'Antibiotics' })).toBeVisible();
  });

  it('renders responsive cell headings using explicit headers or head text fallbacks', () => {
    const { container } = render(
      <Table
        responsive
        caption="Ibuprofen tablet dosages for children"
        head={[
          { content: 'Age' },
          { content: 'How much?' },
          { content: 'How often?' },
        ]}
        rows={[
          [
            { content: '7 to 9 years' },
            { content: '200mg', header: 'Dose' },
            { content: 'Max 3 times in 24 hours' },
          ],
        ]}
      />,
    );

    const responsiveHeadings = Array.from(
      container.querySelectorAll('.ofh-table-responsive__heading'),
    ).map((element) => element.textContent);

    expect(responsiveHeadings).toEqual(['Age', 'Dose', 'How often?']);
    expect(
      within(container).getByText('7 to 9 years', {
        selector: '.ofh-table-responsive__content',
      }),
    ).toBeVisible();
  });

  it('forwards ref and supports custom classes', () => {
    const ref = createRef<HTMLTableElement>();

    render(
      <Table
        ref={ref}
        classes="custom-table"
        className="layout-hook"
        head={defaultHead}
        rows={defaultRows}
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLTableElement);
    expect(ref.current).toHaveClass('ofh-table', 'custom-table', 'layout-hook');
  });

  it('passes colSpan and rowSpan through to rendered cells', () => {
    render(
      <Table
        caption="Clinic availability by day"
        head={[
          { content: 'Day' },
          { content: 'Morning clinic' },
          { content: 'Afternoon clinic' },
          { content: 'Notes' },
        ]}
        rows={[
          [
            { content: 'Monday', rowSpan: 2 },
            { content: 'Children' },
            { content: 'Adults' },
            { content: 'Walk-ins available' },
          ],
          [
            { content: 'Urgent care', colSpan: 2 },
            { content: 'Limited appointments' },
          ],
        ]}
      />,
    );

    expect(screen.getByText('Monday').closest('td')).toHaveAttribute('rowspan', '2');
    expect(screen.getByText('Urgent care').closest('td')).toHaveAttribute('colspan', '2');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Table
        caption="Skin symptoms and possible causes"
        head={defaultHead}
        rows={defaultRows}
      />,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
