import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders neutral tags by default', () => {
    render(<Tag>Inactive</Tag>);

    const tag = screen.getByText('Inactive');

    expect(tag).toBeInTheDocument();
    expect(tag.tagName).toBe('STRONG');
    expect(tag).toHaveClass('ofh-tag', 'ofh-tag--neutral');
  });

  it('maps the variant prop to toolkit modifier classes', () => {
    render(<Tag variant="blue">Ready</Tag>);

    expect(screen.getByText('Ready')).toHaveClass('ofh-tag', 'ofh-tag--blue');
  });

  it('renders react node children', () => {
    render(
      <Tag variant="brand">
        <span>
          <strong>Beta</strong> feature
        </span>
      </Tag>,
    );

    const tag = screen.getByText(
      (_, element) =>
        element?.tagName === 'STRONG' && element.textContent === 'Beta feature',
    );

    expect(tag).toBeInTheDocument();
    expect(tag).toHaveClass('ofh-tag', 'ofh-tag--brand');
  });

  it('applies variant classes and react className together', () => {
    render(
      <Tag variant="blue" className="custom-tag">
        Ready
      </Tag>,
    );

    expect(screen.getByText('Ready')).toHaveClass(
      'ofh-tag',
      'ofh-tag--blue',
      'custom-tag',
    );
  });

  it('passes through standard html props', () => {
    render(
      <Tag id="status-tag" title="Current status" data-testid="status-tag" aria-live="polite">
        Status
      </Tag>,
    );

    const tag = screen.getByTestId('status-tag');

    expect(tag).toHaveAttribute('id', 'status-tag');
    expect(tag).toHaveAttribute('title', 'Current status');
    expect(tag).toHaveAttribute('aria-live', 'polite');
  });

  it('forwards refs to the strong element', () => {
    const ref = createRef<HTMLStrongElement>();

    render(<Tag ref={ref}>Neutral</Tag>);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('STRONG');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Tag variant="yellow">Delayed</Tag>);

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
