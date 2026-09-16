import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders percentage-based progressbar attributes', () => {
    render(<ProgressIndicator progressState={40} totalSegments={5} />);

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '40');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuetext', '40%');
    expect(progressbar).toHaveAttribute('aria-label', '40%');
  });

  it('maps the progress percentage onto the fixed segment count', () => {
    render(<ProgressIndicator progressState={25} totalSegments={8} />);

    const progressbar = screen.getByRole('progressbar');
    const segments = progressbar.querySelectorAll(
      '.ofh-progress-indicator__segment',
    );
    const filledSegments = progressbar.querySelectorAll(
      '.ofh-progress-indicator__segment--filled',
    );

    expect(segments).toHaveLength(8);
    expect(filledSegments).toHaveLength(2);
  });

  it('partially fills the segment representing the current state', () => {
    render(
      <ProgressIndicator
        progressState={25}
        totalSegments={8}
        subSegmentProgress={40}
      />,
    );

    expect(
      screen
        .getByRole('progressbar')
        .querySelector('.ofh-progress-indicator__segment-progress'),
    ).toHaveStyle({ width: '40%' });
  });

  it('clamps sub-segment progress between 0 and 100', () => {
    const { rerender } = render(
      <ProgressIndicator
        progressState={25}
        totalSegments={8}
        subSegmentProgress={125}
      />,
    );

    expect(
      screen
        .getByRole('progressbar')
        .querySelector('.ofh-progress-indicator__segment-progress'),
    ).toHaveStyle({ width: '100%' });

    rerender(
      <ProgressIndicator
        progressState={25}
        totalSegments={8}
        subSegmentProgress={-25}
      />,
    );

    expect(
      screen
        .getByRole('progressbar')
        .querySelector('.ofh-progress-indicator__segment-progress'),
    ).toHaveStyle({ width: '0%' });
  });

  it('removes gaps between segments when showBars is false', () => {
    render(
      <ProgressIndicator
        progressState={50}
        totalSegments={4}
        showBars={false}
      />,
    );

    expect(screen.getByRole('progressbar')).toHaveClass(
      'ofh-progress-indicator__track--without-bars',
    );
  });

  it('applies the toolkit classes and react className together', () => {
    const { container } = render(
      <ProgressIndicator
        progressState={60}
        totalSegments={5}
        className="custom-progress"
      />,
    );

    expect(container.firstElementChild).toHaveClass(
      'ofh-progress-indicator',
      'custom-progress',
    );
  });

  it('supports an optional label and includes it in the accessible name', () => {
    render(
      <ProgressIndicator
        progressState={40}
        totalSegments={5}
        label="Personal details"
      />,
    );

    expect(screen.getByText('Personal details')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Personal details: 40%',
    );
  });

  it('supports optional free-form progress text', () => {
    render(
      <ProgressIndicator
        progressState={25}
        totalSegments={8}
        progressText="Page 2 of 8"
      />,
    );

    expect(screen.getByText('Page 2 of 8')).toBeInTheDocument();
  });

  it('supports optional helper text', () => {
    render(
      <ProgressIndicator
        progressState={40}
        totalSegments={5}
        helperText="About 5 minutes left"
      />,
    );

    expect(screen.getByText('About 5 minutes left')).toBeInTheDocument();
  });

  it('clamps the progress percentage within the valid range', () => {
    render(<ProgressIndicator progressState={125} totalSegments={5} />);

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    expect(progressbar).toHaveAttribute('aria-valuetext', '100%');
    expect(
      progressbar.querySelectorAll(
        '.ofh-progress-indicator__segment--filled',
      ),
    ).toHaveLength(5);
  });

  it('forwards refs to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ProgressIndicator ref={ref} progressState={33} totalSegments={3} />,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ofh-progress-indicator');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ProgressIndicator progressState={40} totalSegments={5} />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

