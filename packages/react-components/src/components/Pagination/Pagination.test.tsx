import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders both pagination links with the expected labels and icons', () => {
    const { container } = render(
      <Pagination
        previousUrl="/section/treatments"
        previousPage="Treatments"
        nextUrl="/section/symptoms"
        nextPage="Symptoms"
      />,
    );

    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /previous.*treatments/i })).toHaveAttribute(
      'href',
      '/section/treatments',
    );
    expect(screen.getByRole('link', { name: /next.*symptoms/i })).toHaveAttribute(
      'href',
      '/section/symptoms',
    );
    expect(container.querySelectorAll('.ofh-icon--West')).toHaveLength(1);
    expect(container.querySelectorAll('.ofh-icon--East')).toHaveLength(1);
  });

  it('renders only the previous link when next props are missing', () => {
    render(<Pagination previousUrl="/section/treatments" previousPage="Treatments" />);

    expect(screen.getByRole('link', { name: /previous.*treatments/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /next.*symptoms/i })).toBeNull();
  });

  it('renders only the next link when previous props are missing', () => {
    render(<Pagination nextUrl="/section/symptoms" nextPage="Symptoms" />);

    expect(screen.getByRole('link', { name: /next.*symptoms/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /previous.*treatments/i })).toBeNull();
  });

  it('applies custom classes and forwards ref to the nav element', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Pagination
        ref={ref}
        className="custom-class"
        previousUrl="/section/treatments"
        previousPage="Treatments"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveClass('ofh-pagination', 'custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Pagination
        previousUrl="/section/treatments"
        previousPage="Treatments"
        nextUrl="/section/symptoms"
        nextPage="Symptoms"
      />,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
