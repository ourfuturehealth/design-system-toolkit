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

  it.each([
    [11, 12, 11, 12],
    [10, 5, 5, 5],
    [0, 5, 1, 5],
    [-2, 5, 1, 5],
    [1, 1, 1, 1],
    [2, 0, 1, 1],
    [2, -3, 1, 1],
    [2, 4.4, 2, 4],
    [2, 4.6, 2, 5],
  ])('derives page text, fill, and ARIA from currentStep=%s and totalSteps=%s', (
    currentStep,
    totalSteps,
    expectedStep,
    expectedTotal,
  ) => {
    const { container } = render(
      <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} label="Personal details" />,
    );

    const pageText = `Page ${expectedStep} of ${expectedTotal}`;
    const progressbar = screen.getByRole('progressbar', { name: `Personal details, ${pageText}` });
    const segments = progressbar.querySelectorAll('.ofh-progress-indicator__segment');
    const partialSegment = progressbar.querySelector('.ofh-progress-indicator__segment-progress');

    expect(screen.getByText(pageText)).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(progressbar).toHaveAttribute('aria-valuenow', String(expectedStep));
    expect(progressbar).toHaveAttribute('aria-valuemin', '1');
    expect(progressbar).toHaveAttribute('aria-valuemax', String(expectedTotal));
    expect(progressbar).not.toHaveAttribute('aria-valuetext');
    expect(progressbar.querySelector('.ofh-progress-indicator__header')).toHaveAttribute('aria-hidden', 'true');
    expect(segments).toHaveLength(expectedTotal);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(expectedStep);
    segments.forEach((segment, index) => {
      expect(segment.classList.contains('ofh-progress-indicator__segment--filled')).toBe(index < expectedStep);
    });
    if (expectedStep === expectedTotal) {
      expect(partialSegment).toBeNull();
    } else {
      expect(partialSegment).toHaveStyle({ width: '0%' });
    }
    expect(container.firstElementChild).not.toHaveAttribute('currentStep');
    expect(container.firstElementChild).not.toHaveAttribute('totalSteps');
  });

  it.each([
    [2, 100, 3, 3, 0, 'Page 3 of 8'],
    [2, 125, 3, 3, 0, 'Page 3 of 8'],
    [2, -25, 2, 2, 0, 'Page 2 of 8'],
    [8, 50, 8, 8, null, 'Page 8 of 8'],
  ])('includes partial progress in step mode for currentStep=%s and subSegmentProgress=%s', (
    currentStep,
    subSegmentProgress,
    expectedProgress,
    expectedFilled,
    expectedPartial,
    pageText,
  ) => {
    render(<ProgressIndicator currentStep={currentStep} totalSteps={8} subSegmentProgress={subSegmentProgress} />);

    const progressbar = screen.getByRole('progressbar');
    const partialSegment = progressbar.querySelector('.ofh-progress-indicator__segment-progress');

    expect(screen.getByText(pageText)).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', String(expectedProgress));
    expect(progressbar).toHaveAttribute('aria-valuemin', '1');
    expect(progressbar).toHaveAttribute('aria-valuemax', '8');
    expect(progressbar).toHaveAccessibleName(`Progress, ${pageText}`);
    expect(progressbar).not.toHaveAttribute('aria-valuetext');
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(expectedFilled);
    if (expectedPartial === null) {
      expect(partialSegment).toBeNull();
    } else {
      expect(partialSegment).toHaveStyle({ width: `${expectedPartial}%` });
    }
  });

  it('renders step-based progressbar attributes', () => {
    render(<ProgressIndicator currentStep={2} totalSteps={5} />);

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '2');
    expect(progressbar).toHaveAttribute('aria-valuemin', '1');
    expect(progressbar).toHaveAttribute('aria-valuemax', '5');
    expect(progressbar).not.toHaveAttribute('aria-valuetext');
    expect(progressbar).toHaveAccessibleName('Progress, Page 2 of 5');
  });

  it('maps the current step onto the total step count', () => {
    render(<ProgressIndicator currentStep={2} totalSteps={8} />);

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
        currentStep={2}
        totalSteps={8}
        subSegmentProgress={40}
      />,
    );

    expect(
      screen
        .getByRole('progressbar')
        .querySelector('.ofh-progress-indicator__segment-progress'),
    ).toHaveStyle({ width: '40%' });
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2.4');
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuetext');
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Progress, Page 3 of 8');
    expect(screen.getByText('Page 3 of 8')).toBeInTheDocument();
  });

  it('clamps sub-segment progress between 0 and 100', () => {
    const { rerender } = render(
      <ProgressIndicator
        currentStep={2}
        totalSteps={8}
        subSegmentProgress={125}
      />,
    );

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
    expect(
      screen.getByRole('progressbar').querySelectorAll('.ofh-progress-indicator__segment--filled'),
    ).toHaveLength(3);
    expect(
      screen
        .getByRole('progressbar')
        .querySelector('.ofh-progress-indicator__segment-progress'),
    ).toHaveStyle({ width: '0%' });

    rerender(
      <ProgressIndicator
        currentStep={2}
        totalSteps={8}
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
        currentStep={2}
        totalSteps={4}
        showBars={false}
      />,
    );

    expect(screen.getByRole('progressbar').querySelector('.ofh-progress-indicator__track')).toHaveClass(
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
        currentStep={3}
        totalSteps={5}
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
        currentStep={2}
        totalSteps={5}
        label="Personal details"
      />,
    );

    const label = screen.getByText('Personal details');

    expect(label).toHaveTextContent('Personal details');
    expect(label.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByRole('progressbar')).toHaveAccessibleName(
      'Personal details, Page 2 of 5',
    );
  });

  it('omits an empty string label and uses the default accessible name', () => {
    const { container } = render(
      <ProgressIndicator currentStep={2} totalSteps={5} label="" />,
    );

    expect(container.querySelector('.ofh-progress-indicator__label')).toBeNull();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-labelledby');
    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Progress, Page 2 of 5');
  });

  it.each([
    ['Personal details', 'Personal details'],
    [undefined, 'Progress'],
    ['', 'Progress'],
    ['   ', 'Progress'],
    [' Personal details ', 'Personal details'],
  ])('uses the shared name and generated value contract for label=%s', (
    label,
    expectedName,
  ) => {
    const { container } = render(
      <ProgressIndicator
        currentStep={2}
        totalSteps={8}
        label={label}
      />,
    );

    const progressbar = screen.getByRole('progressbar', { name: `${expectedName}, Page 2 of 8` });

    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(progressbar).toHaveAttribute('aria-valuenow', '2');
    expect(progressbar).toHaveAttribute('aria-valuemin', '1');
    expect(progressbar).toHaveAttribute('aria-valuemax', '8');
    expect(progressbar).not.toHaveAttribute('aria-valuetext');
    expect(progressbar.closest('[aria-hidden="true"], [hidden]')).toBeNull();
    expect(progressbar.querySelector('.ofh-progress-indicator__track')).toHaveAttribute('aria-hidden', 'true');
    const header = container.querySelector<HTMLDivElement>('.ofh-progress-indicator__header');
    expect(progressbar).toContainElement(header);
    expect(header).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps label then page text in one accessible name before the native value and helper', () => {
    render(
      <ProgressIndicator
        currentStep={2}
        totalSteps={8}
        label="Personal details"
        helperText="About 5 minutes left"
      />,
    );

    const progressbar = screen.getByRole('progressbar', { name: 'Personal details, Page 2 of 8' });
    const label = screen.getByText('Personal details');
    const pageText = screen.getByText('Page 2 of 8');
    const helper = screen.getByText('About 5 minutes left');

    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(label.nextElementSibling).toBe(pageText);
    expect(label.tagName).toBe('SPAN');
    expect(label.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(pageText.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(progressbar).not.toHaveAttribute('aria-valuetext');
    expect(progressbar).toHaveAttribute('aria-valuenow', '2');
    expect(progressbar).toHaveAttribute('aria-valuemin', '1');
    expect(progressbar).toHaveAttribute('aria-valuemax', '8');
    expect(progressbar.nextElementSibling).toBe(helper);
    expect(helper.closest('[aria-hidden="true"]')).toBeNull();
  });

  it('supports optional helper text', () => {
    render(
      <ProgressIndicator
        currentStep={2}
        totalSteps={5}
        helperText="About 5 minutes left"
      />,
    );

    const helperText = screen.getByText('About 5 minutes left');

    expect(helperText).toHaveTextContent('About 5 minutes left');
    expect(helperText.querySelector('.ofh-u-visually-hidden')).toBeNull();
    expect(helperText.closest('[role="progressbar"], [aria-hidden="true"]')).toBeNull();
  });

  it.each([-25, 0, 0.5, 1])(
    'enforces the first step minimum for currentStep=%s',
    (currentStep) => {
      render(<ProgressIndicator currentStep={currentStep} totalSteps={8} />);

      const progressbar = screen.getByRole('progressbar');

      expect(progressbar).toHaveAttribute('aria-valuenow', '1');
      expect(progressbar).toHaveAttribute('aria-valuemin', '1');
      expect(progressbar).toHaveAttribute('aria-valuemax', '8');
      expect(progressbar).not.toHaveAttribute('aria-valuetext');
      expect(progressbar).toHaveAccessibleName('Progress, Page 1 of 8');
      expect(
        progressbar.querySelectorAll('.ofh-progress-indicator__segment'),
      ).toHaveLength(8);
      expect(
        progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled'),
      ).toHaveLength(1);
      expect(
        progressbar.querySelector('.ofh-progress-indicator__segment-progress'),
      ).toHaveStyle({ width: '0%' });
    },
  );

  it.each([8, 125])('clamps currentStep=%s to the final step', (currentStep) => {
    render(<ProgressIndicator currentStep={currentStep} totalSteps={8} />);

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '8');
    expect(progressbar).toHaveAttribute('aria-valuemin', '1');
    expect(progressbar).toHaveAttribute('aria-valuemax', '8');
    expect(progressbar).not.toHaveAttribute('aria-valuetext');
    expect(progressbar).toHaveAccessibleName('Progress, Page 8 of 8');
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
      <ProgressIndicator ref={ref} currentStep={1} totalSteps={3} />,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ofh-progress-indicator');
  });

  it.each<ProgressIndicatorProps>([
    { currentStep: 2, totalSteps: 5 },
    { currentStep: 2, totalSteps: 5, subSegmentProgress: 50 },
  ])('has no accessibility violations for %j', async (progressProps) => {
    const { container } = render(
      <ProgressIndicator
        {...progressProps}
        label="Personal details"
        helperText="About 5 minutes left"
      />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

