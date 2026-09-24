import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { ProgressIndicator } from './ProgressIndicator';
import type { ProgressIndicatorProps } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('accepts only an optional string label', () => {
    expectTypeOf<ProgressIndicatorProps['label']>().toEqualTypeOf<string | undefined>();
  });

  it('renders percentage-based progressbar attributes', () => {
    render(<ProgressIndicator progressState={40} totalSegments={5} />);

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '40');
    expect(progressbar).toHaveAttribute('aria-valuemin', '1');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuetext', '40%');
    expect(progressbar).toHaveAccessibleName('Progress bar');
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

  it.each([
    [undefined, undefined, 'ofh-progress-indicator'],
    ['toolkit-progress', undefined, 'ofh-progress-indicator toolkit-progress'],
    [undefined, 'custom-progress', 'ofh-progress-indicator custom-progress'],
    ['toolkit-progress', 'custom-progress', 'ofh-progress-indicator toolkit-progress custom-progress'],
    ['', '', 'ofh-progress-indicator'],
  ])('merges classes=%s and className=%s on the root', (classes, className, expectedClasses) => {
    const { container } = render(
      <ProgressIndicator
        progressState={60}
        totalSegments={5}
        classes={classes}
        className={className}
      />,
    );

    expect(container.firstElementChild).toHaveAttribute('class', expectedClasses);
    expect(container.firstElementChild).not.toHaveAttribute('classes');
  });

  it('supports an optional label and includes it in the accessible name', () => {
    render(
      <ProgressIndicator
        progressState={40}
        totalSegments={5}
        label="Personal details"
      />,
    );

    const label = screen.getByText('Personal details');

    expect(label).toHaveTextContent('Personal details');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-labelledby', label.id);
    expect(screen.getByRole('progressbar')).toHaveAccessibleName(
      'Personal details',
    );
  });

  it('omits an empty string label and uses the default accessible name', () => {
    const { container } = render(
      <ProgressIndicator progressState={40} totalSegments={5} label="" />,
    );

    expect(container.querySelector('.ofh-progress-indicator__label')).toBeNull();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-labelledby');
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Progress bar');
  });

  it('supports optional helper text', () => {
    render(
      <ProgressIndicator
        progressState={40}
        totalSegments={5}
        helperText="About 5 minutes left"
      />,
    );

    const helperText = screen.getByText('About 5 minutes left');

    expect(helperText).toHaveTextContent('Progress bar: About 5 minutes left');
    expect(helperText.firstElementChild).toHaveClass('ofh-u-visually-hidden');
  });

  it.each([-25, 0, 0.5, 1])(
    'enforces the 1%% minimum for progressState=%s',
    (progressState) => {
      render(<ProgressIndicator progressState={progressState} totalSegments={8} />);

      const progressbar = screen.getByRole('progressbar');

      expect(progressbar).toHaveAttribute('aria-valuenow', '1');
      expect(progressbar).toHaveAttribute('aria-valuemin', '1');
      expect(progressbar).toHaveAttribute('aria-valuemax', '100');
      expect(progressbar).toHaveAttribute('aria-valuetext', '1%');
      expect(progressbar).toHaveAccessibleName('Progress bar');
      expect(
        progressbar.querySelectorAll('.ofh-progress-indicator__segment'),
      ).toHaveLength(8);
      expect(
        progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled'),
      ).toHaveLength(0);
      expect(
        progressbar.querySelector('.ofh-progress-indicator__segment-progress'),
      ).toHaveStyle({ width: '0%' });
    },
  );

  it.each([100, 125])('enforces the 100%% maximum for progressState=%s', (progressState) => {
    render(<ProgressIndicator progressState={progressState} totalSegments={8} />);

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    expect(progressbar).toHaveAttribute('aria-valuemin', '1');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    expect(progressbar).toHaveAttribute('aria-valuetext', '100%');
    expect(
      progressbar.querySelectorAll('.ofh-progress-indicator__segment'),
    ).toHaveLength(8);
    expect(
      progressbar.querySelectorAll(
        '.ofh-progress-indicator__segment--filled',
      ),
    ).toHaveLength(8);
    expect(
      progressbar.querySelector('.ofh-progress-indicator__segment-progress'),
    ).toBeNull();
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
      <ProgressIndicator
        progressState={40}
        totalSegments={5}
        label="Personal details"
        progressText="Page 2 of 5"
        helperText="About 5 minutes left"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

