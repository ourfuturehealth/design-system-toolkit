import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  const items = [
    {
      title: 'Company directors',
      href: '#directors',
      status: {
        children: 'Complete',
        variant: 'green' as const,
      },
    },
    {
      title: 'Registered company details',
      href: '#company-details',
      status: {
        children: 'Incomplete',
        variant: 'blue' as const,
      },
    },
    {
      title: 'Financial history',
      hint: 'Include 5 years of the company’s relevant financial information.',
      href: '#financial-history',
      status: {
        children: 'Pending',
        variant: 'yellow' as const,
      },
    },
  ];

  it('renders task rows with linked titles, hints, and Tag statuses', () => {
    render(<TaskList idPrefix="company-details" items={items} />);

    expect(screen.getByRole('link', { name: 'Company directors' })).toHaveAttribute(
      'href',
      '#directors',
    );
    expect(screen.getByText('Financial history')).toHaveClass(
      'ofh-link',
      'ofh-task-list__link',
    );
    expect(
      screen.getByText(
        "Include 5 years of the company’s relevant financial information.",
      ),
    ).toHaveClass('ofh-task-list__hint');
    expect(screen.getByText('Complete')).toHaveClass(
      'ofh-tag',
      'ofh-tag--green',
    );
    expect(screen.getByText('Incomplete')).toHaveClass(
      'ofh-tag',
      'ofh-tag--blue',
    );
    expect(screen.getByText('Pending')).toHaveClass(
      'ofh-tag',
      'ofh-tag--yellow',
    );
  });

  it('links the title to the hint and status ids', () => {
    render(<TaskList idPrefix="company-details" items={items} />);

    expect(screen.getByRole('link', { name: 'Financial history' })).toHaveAttribute(
      'aria-describedby',
      'company-details-3-hint company-details-3-status',
    );
  });

  it('forwards ref to the list element', () => {
    const ref = createRef<HTMLUListElement>();

    render(<TaskList ref={ref} idPrefix="company-details" items={items} />);

    expect(ref.current).toBeInstanceOf(HTMLUListElement);
    expect(ref.current).toHaveClass('ofh-task-list');
  });

  it('generates unique ids when no idPrefix is provided', () => {
    render(
      <div>
        <TaskList
          items={[
            {
              title: 'First task',
              href: '#first',
              status: {
                children: 'Complete',
              },
            },
          ]}
        />
        <TaskList
          items={[
            {
              title: 'Second task',
              href: '#second',
              status: {
                children: 'Incomplete',
              },
            },
          ]}
        />
      </div>,
    );

    const firstLink = screen.getByRole('link', { name: 'First task' });
    const secondLink = screen.getByRole('link', { name: 'Second task' });

    expect(firstLink.getAttribute('aria-describedby')).not.toEqual(
      secondLink.getAttribute('aria-describedby'),
    );
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<TaskList idPrefix="company-details" items={items} />);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
