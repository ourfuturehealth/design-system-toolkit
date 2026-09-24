const { getHTMLCode } = require('../../../site/views/_data/helpers');

describe('Our Future Health progress indicator macro', () => {
  beforeEach(() => {
    document.body.innerHTML = getHTMLCode('tests/fixtures/progress-indicator/steps.njk');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    [10, 5],
    [5, 5],
    [2, 2],
    [1, 1],
    [0.5, 1],
    [0, 1],
    [-1, 1],
  ])('renders step %s as page %s of 5', (currentStep, expectedStep) => {
    const indicator = document.querySelector(`[data-current-step="${currentStep}"]`);
    const progressbar = indicator.querySelector('[role="progressbar"]');
    const pageText = `Page ${expectedStep} of 5`;

    expect(indicator.querySelector('.ofh-progress-indicator__steps').textContent).toBe(pageText);
    expect(progressbar.getAttribute('aria-valuenow')).toBe(String(expectedStep));
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('5');
    expect(progressbar.getAttribute('aria-valuetext')).toBe(pageText);
    expect(progressbar.getAttribute('aria-label')).toBe('Progress Bar');
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment')).toHaveLength(5);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(expectedStep);
  });

  it.each([
    [1, 1, 1],
    [3, 3, 2],
    [8, 8, 2],
    [0, 1, 1],
    [-3, 1, 1],
    [4.4, 4, 2],
    [4.6, 5, 2],
  ])('normalizes totalSteps=%s to %s segments with %s filled', (totalSteps, expectedTotal, expectedStep) => {
    const indicator = document.querySelector(`[data-total-steps="${totalSteps}"]`);
    const progressbar = indicator.querySelector('[role="progressbar"]');
    const segments = progressbar.querySelectorAll('.ofh-progress-indicator__segment');
    const pageText = `Page ${expectedStep} of ${expectedTotal}`;

    expect(segments).toHaveLength(expectedTotal);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(expectedStep);
    segments.forEach((segment, index) => {
      expect(segment.classList.contains('ofh-progress-indicator__segment--filled')).toBe(index < expectedStep);
    });
    expect(progressbar.getAttribute('aria-label')).toBe('Progress Bar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe(String(expectedStep));
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe(String(expectedTotal));
    expect(progressbar.getAttribute('aria-valuetext')).toBe(pageText);
    expect(indicator.querySelector('.ofh-progress-indicator__steps').textContent).toBe(pageText);
  });

  it.each([1, 2, 3])('uses Progress Bar as the accessible name for label case %s', (labelCase) => {
    const progressbar = document.querySelector(`[data-label-case="${labelCase}"] [role="progressbar"]`);

    expect(progressbar.getAttribute('aria-label')).toBe('Progress Bar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('2');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('8');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('Page 2 of 8');
  });

  it('groups the visible page text and track into one accessible progress bar', () => {
    const indicator = document.querySelector('[data-label-case="1"]');
    const progressbar = indicator.querySelector('[role="progressbar"]');
    const pageLabel = indicator.querySelector('.ofh-progress-indicator__steps');
    const header = indicator.querySelector('.ofh-progress-indicator__header');
    const track = indicator.querySelector('.ofh-progress-indicator__track');
    const helper = indicator.querySelector('.ofh-progress-indicator__helper');

    expect(indicator.querySelectorAll('[role="progressbar"]')).toHaveLength(1);
    expect(pageLabel.closest('[role="progressbar"]')).toBe(progressbar);
    expect(track.closest('[role="progressbar"]')).toBe(progressbar);
    expect(header.getAttribute('aria-hidden')).toBe('true');
    expect(track.getAttribute('aria-hidden')).toBe('true');
    expect(progressbar.closest('[aria-hidden="true"], [hidden]')).toBeNull();
    expect(track.classList.contains('ofh-progress-indicator__track--without-bars')).toBe(false);
    expect(progressbar.getAttribute('aria-label')).toBe('Progress Bar');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('Page 2 of 8');
    expect(helper.textContent).toBe('About 5 minutes left');
    expect(helper.closest('[role="progressbar"], [aria-hidden="true"]')).toBeNull();
  });

  it('preserves percentage progress and free-form progress text', () => {
    const indicator = document.querySelector('[data-percentage]');
    const progressbar = indicator.querySelector('[role="progressbar"]');

    expect(indicator.querySelector('.ofh-progress-indicator__steps').textContent).toBe('Custom progress text');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('40');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('Custom progress text');
    expect(progressbar.getAttribute('aria-label')).toBe('Progress Bar');
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(2);
    expect(progressbar.querySelector('.ofh-progress-indicator__segment-progress').style.width).toBe('50%');
  });

  it('announces the page text as the value in percentage mode', () => {
    const indicator = document.querySelector('[data-percentage-page]');
    const progressbar = indicator.querySelector('[role="progressbar"]');
    const pageLabel = indicator.querySelector('.ofh-progress-indicator__steps');

    expect(pageLabel.closest('[role="progressbar"]')).toBe(progressbar);
    expect(progressbar.getAttribute('aria-label')).toBe('Progress Bar');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('Page 2 of 8');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('25');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
  });

  it('falls back to the percentage value when no progress text is supplied', () => {
    const progressbar = document.querySelector('[data-percentage-without-text] [role="progressbar"]');

    expect(progressbar.getAttribute('aria-label')).toBe('Progress Bar');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('40%');
  });

  it.each([
    [-25, 1, 0],
    [0, 1, 0],
    [0.5, 1, 0],
    [1, 1, 0],
    [25, 25, 2],
    [100, 100, 8],
    [125, 100, 8],
  ])('clamps progressState=%s to %s percent with %s filled segments', (progressState, expectedProgress, expectedFilled) => {
    const indicator = document.querySelector(`[data-progress-state="${progressState}"]`);
    const progressbar = indicator.querySelector('[role="progressbar"]');
    const partialSegments = progressbar.querySelectorAll('.ofh-progress-indicator__segment-progress');

    expect(indicator.querySelector('.ofh-progress-indicator__header')).toBeNull();
    expect(indicator.querySelector('.ofh-progress-indicator__helper')).toBeNull();
    expect(progressbar.getAttribute('aria-label')).toBe('Progress Bar');
    expect(progressbar.getAttribute('aria-valuenow')).toBe(String(expectedProgress));
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
    expect(progressbar.getAttribute('aria-valuetext')).toBe(`${expectedProgress}%`);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment')).toHaveLength(8);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(expectedFilled);
    expect(partialSegments).toHaveLength(expectedProgress === 100 ? 0 : 1);
    if (partialSegments.length) {
      expect(partialSegments[0].style.width).toBe('0%');
    }
  });

  it.each([
    [-25, 0],
    [0, 0],
    [40, 40],
    [100, 100],
    [125, 100],
  ])('clamps subSegmentProgress=%s to %s percent on the current segment', (subSegmentProgress, expectedProgress) => {
    const progressbar = document.querySelector(`[data-sub-segment-progress="${subSegmentProgress}"] [role="progressbar"]`);
    const segments = progressbar.querySelectorAll('.ofh-progress-indicator__segment');
    const partialSegments = progressbar.querySelectorAll('.ofh-progress-indicator__segment-progress');

    expect(segments).toHaveLength(8);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(2);
    expect(partialSegments).toHaveLength(1);
    expect(partialSegments[0].parentElement).toBe(segments[2]);
    expect(partialSegments[0].style.width).toBe(`${expectedProgress}%`);
    expect(progressbar.getAttribute('aria-valuenow')).toBe('25');
  });

  it.each([true, false])('sets the gap modifier for showBars=%s', (showBars) => {
    const track = document.querySelector(`[data-show-bars="${showBars}"] .ofh-progress-indicator__track`);

    expect(track.classList.contains('ofh-progress-indicator__track--without-bars')).toBe(!showBars);
    expect(track.querySelectorAll('.ofh-progress-indicator__segment')).toHaveLength(5);
  });

  it('adds custom classes and attributes to the root without replacing toolkit classes', () => {
    const indicator = document.querySelector('[data-show-bars="false"] .ofh-progress-indicator');

    expect(indicator.className).toBe('ofh-progress-indicator custom-progress extra-progress');
    expect(indicator.getAttribute('data-tracking')).toBe('progress');
    expect(indicator.hasAttribute('classes')).toBe(false);
    expect(indicator.querySelector('[role="progressbar"]').getAttribute('aria-label')).toBe('Progress Bar');
  });

  it('prioritizes clamped step values over percentage props and free-form progress text', () => {
    const indicator = document.querySelector('[data-step-precedence]');
    const progressbar = indicator.querySelector('[role="progressbar"]');

    expect(indicator.querySelector('.ofh-progress-indicator__steps').textContent).toBe('Page 5 of 5');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('5');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('5');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('Page 5 of 5');
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment')).toHaveLength(5);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(5);
    expect(progressbar.querySelector('.ofh-progress-indicator__segment-progress')).toBeNull();
  });
});
