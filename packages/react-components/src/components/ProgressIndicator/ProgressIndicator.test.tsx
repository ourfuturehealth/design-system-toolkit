import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ProgressIndicator } from './ProgressIndicator';

describe('ProgressIndicator', () => {
  it('renders the default steps text and progressbar attributes', () => {
    render(<ProgressIndicator currentStep={2} totalSteps={5} />);

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '2');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '5');
    expect(progressbar).toHaveAttribute('aria-valuetext', 'Page 2 of 5');
    expect(progressbar).toHaveAttribute('aria-label', 'Page 2 of 5');
  });

  it('renders a segment for each step and fills completed ones', () => {
    render(<ProgressIndicator currentStep={2} totalSteps={4} />);

    const progressbar = screen.getByRole('progressbar');
    const segments = progressbar.querySelectorAll(
      '.ofh-progress-indicator__segment',
    );
    const filledSegments = progressbar.querySelectorAll(
      '.ofh-progress-indicator__segment--filled',
    );

    expect(segments).toHaveLength(4);
    expect(filledSegments).toHaveLength(2);
  });

  it('removes gaps between segments when showBars is false', () => {
    render(
      <ProgressIndicator currentStep={2} totalSteps={4} showBars={false} />,
    );

    expect(screen.getByRole('progressbar')).toHaveClass(
      'ofh-progress-indicator__track--without-bars',
    );
  });

  it('applies the toolkit classes and react className together', () => {
    const { container } = render(
      <ProgressIndicator
        currentStep={3}
        totalSteps={5}
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
        currentStep={2}
        totalSteps={5}
        label="Personal details"
      />,
    );

    expect(screen.getByText('Personal details')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-label',
      'Personal details: Page 2 of 5',
    );
  });

  it('supports optional helper text', () => {
    render(
      <ProgressIndicator
        currentStep={2}
        totalSteps={5}
        helperText="About 5 minutes left"
      />,
    );

    expect(screen.getByText('About 5 minutes left')).toBeInTheDocument();
  });

  it('clamps the current step within the valid range', () => {
    render(<ProgressIndicator currentStep={10} totalSteps={5} />);

    const progressbar = screen.getByRole('progressbar');

    expect(progressbar).toHaveAttribute('aria-valuenow', '5');
    expect(screen.getByText('Page 5 of 5')).toBeInTheDocument();
  });

  it('forwards refs to the root element', () => {
    const ref = createRef<HTMLDivElement>();

    render(<ProgressIndicator ref={ref} currentStep={1} totalSteps={3} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('ofh-progress-indicator');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <ProgressIndicator currentStep={2} totalSteps={5} />,
    );

    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

