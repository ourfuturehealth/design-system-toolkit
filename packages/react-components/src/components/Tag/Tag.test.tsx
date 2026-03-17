import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders the toolkit class and text content', () => {
    render(<Tag text="Inactive" />);

    const tag = screen.getByText('Inactive');

    expect(tag).toBeInTheDocument();
    expect(tag.tagName).toBe('STRONG');
    expect(tag).toHaveClass('ofh-tag');
  });

  it('prefers html over text', () => {
    render(
      <Tag
        text="Fallback content"
        html="<span><strong>Beta</strong> feature</span>"
        classes="ofh-tag--brand"
      />,
    );

    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Fallback content')).not.toBeInTheDocument();
  });

  it('applies toolkit classes and react className together', () => {
    render(
      <Tag
        text="Ready"
        classes="ofh-tag--blue"
        className="custom-tag"
      />,
    );

    expect(screen.getByText('Ready')).toHaveClass(
      'ofh-tag',
      'ofh-tag--blue',
      'custom-tag',
    );
  });

  it('passes through attributes and standard html props', () => {
    render(
      <Tag
        text="Status"
        id="status-tag"
        title="Current status"
        attributes={{
          'data-testid': 'status-tag',
          'aria-live': 'polite',
        }}
      />,
    );

    const tag = screen.getByTestId('status-tag');

    expect(tag).toHaveAttribute('id', 'status-tag');
    expect(tag).toHaveAttribute('title', 'Current status');
    expect(tag).toHaveAttribute('aria-live', 'polite');
  });

  it('forwards refs to the strong element', () => {
    const ref = createRef<HTMLElement>();

    render(<Tag ref={ref} text="Neutral" />);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('STRONG');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Tag text="Delayed" classes="ofh-tag--yellow" />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
