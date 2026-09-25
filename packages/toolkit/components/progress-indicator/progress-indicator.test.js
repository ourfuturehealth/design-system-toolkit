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
    expect(progressbar.hasAttribute('aria-valuetext')).toBe(false);
    expect(progressbar.getAttribute('aria-label')).toBe(`Personal details, ${pageText}`);
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
    expect(progressbar.getAttribute('aria-label')).toBe(`Progress, ${pageText}`);
    expect(progressbar.getAttribute('aria-valuenow')).toBe(String(expectedStep));
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe(String(expectedTotal));
    expect(progressbar.hasAttribute('aria-valuetext')).toBe(false);
    expect(indicator.querySelector('.ofh-progress-indicator__steps').textContent).toBe(pageText);
  });

  it.each([
    [1, 'Personal details'],
    [2, 'Progress'],
    [3, 'Progress'],
  ])('uses the label or fallback name for step-mode label case %s', (labelCase, expectedName) => {
    const progressbar = document.querySelector(`[data-label-case="${labelCase}"] [role="progressbar"]`);

    expect(progressbar.getAttribute('aria-label')).toBe(`${expectedName}, Page 2 of 8`);
    expect(progressbar.getAttribute('aria-valuenow')).toBe('2');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('8');
    expect(progressbar.hasAttribute('aria-valuetext')).toBe(false);
  });

  it('groups the visible page text and track into one accessible progress bar', () => {
    const indicator = document.querySelector('[data-label-case="1"]');
    const progressbar = indicator.querySelector('[role="progressbar"]');
    const pageLabel = indicator.querySelector('.ofh-progress-indicator__steps');
    const label = indicator.querySelector('.ofh-progress-indicator__label');
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
    expect(progressbar.getAttribute('aria-label')).toBe('Personal details, Page 2 of 8');
    expect(progressbar.hasAttribute('aria-valuetext')).toBe(false);
    expect(label.nextElementSibling).toBe(pageLabel);
    expect(progressbar.nextElementSibling).toBe(helper);
    expect(helper.textContent).toBe('About 5 minutes left');
    expect(helper.closest('[role="progressbar"], [aria-hidden="true"]')).toBeNull();
  });

  it.each([
    [1, 'Personal details', 'Page 2 of 8'],
    [2, 'Progress', 'Page 2 of 8'],
    [3, 'Progress', 'Page 2 of 8'],
    [4, 'Progress', 'Page 2 of 8'],
    [5, 'Personal details', 'Page 2 of 8'],
  ])('uses the shared name and value contract for announcement case %s', (caseNumber, expectedName, expectedValue) => {
    const indicator = document.querySelector(`[data-announcement-case="${caseNumber}"]`);
    const progressbar = indicator.querySelector('[role="progressbar"]');
    const header = indicator.querySelector('.ofh-progress-indicator__header');

    expect(indicator.querySelectorAll('[role="progressbar"]')).toHaveLength(1);
    expect(progressbar.getAttribute('aria-label')).toBe(`${expectedName}, ${expectedValue}`);
    expect(progressbar.getAttribute('aria-valuenow')).toBe('2');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('8');
    expect(progressbar.hasAttribute('aria-valuetext')).toBe(false);
    expect(progressbar.closest('[aria-hidden="true"], [hidden]')).toBeNull();
    expect(progressbar.querySelector('.ofh-progress-indicator__track').getAttribute('aria-hidden')).toBe('true');
    expect(header.closest('[role="progressbar"]')).toBe(progressbar);
    expect(header.getAttribute('aria-hidden')).toBe('true');
  });

  it.each([
    [-25, 2, 2, 0, 'Page 2 of 8'],
    [0, 2, 2, 0, 'Page 2 of 8'],
    [40, 2.4, 2, 40, 'Page 3 of 8'],
    [100, 3, 3, 0, 'Page 3 of 8'],
    [125, 3, 3, 0, 'Page 3 of 8'],
  ])('clamps subSegmentProgress=%s to an overall %s steps', (subSegmentProgress, expectedProgress, expectedFilled, expectedPartial, valueText) => {
    const progressbar = document.querySelector(`[data-sub-segment-progress="${subSegmentProgress}"] [role="progressbar"]`);
    const segments = progressbar.querySelectorAll('.ofh-progress-indicator__segment');
    const partialSegments = progressbar.querySelectorAll('.ofh-progress-indicator__segment-progress');

    expect(segments).toHaveLength(8);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(expectedFilled);
    expect(partialSegments).toHaveLength(1);
    expect(partialSegments[0].parentElement).toBe(segments[expectedFilled]);
    expect(partialSegments[0].style.width).toBe(`${expectedPartial}%`);
    expect(progressbar.getAttribute('aria-valuenow')).toBe(String(expectedProgress));
    expect(progressbar.hasAttribute('aria-valuetext')).toBe(false);
    expect(progressbar.getAttribute('aria-label')).toBe(`Progress, ${valueText}`);
  });

  it.each([
    [1, 2.5, 2, 50, 'Page 3 of 8'],
    [2, 3, 3, 0, 'Page 3 of 8'],
    [3, 8, 8, null, 'Page 8 of 8'],
  ])('includes partial progress in the step value for case %s', (caseNumber, expectedProgress, expectedFilled, expectedPartial, pageText) => {
    const indicator = document.querySelector(`[data-step-partial-case="${caseNumber}"]`);
    const progressbar = indicator.querySelector('[role="progressbar"]');
    const partialSegment = progressbar.querySelector('.ofh-progress-indicator__segment-progress');

    expect(indicator.querySelector('.ofh-progress-indicator__steps').textContent).toBe(pageText);
    expect(progressbar.getAttribute('aria-valuenow')).toBe(String(expectedProgress));
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('8');
    expect(progressbar.hasAttribute('aria-valuetext')).toBe(false);
    expect(progressbar.getAttribute('aria-label')).toBe(`Progress, ${pageText}`);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(expectedFilled);
    if (expectedPartial === null) {
      expect(partialSegment).toBeNull();
    } else {
      expect(partialSegment.style.width).toBe(`${expectedPartial}%`);
    }
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
    expect(indicator.querySelector('[role="progressbar"]').getAttribute('aria-label')).toBe('Progress, Page 2 of 5');
  });

  it('generates page text and progress without a label or helper', () => {
    const indicator = document.querySelector('[data-generated-progress]');
    const progressbar = indicator.querySelector('[role="progressbar"]');

    expect(indicator.querySelector('.ofh-progress-indicator__label')).toBeNull();
    expect(indicator.querySelector('.ofh-progress-indicator__helper')).toBeNull();
    expect(indicator.querySelector('.ofh-progress-indicator__steps').textContent).toBe('Page 11 of 12');
    expect(progressbar.getAttribute('aria-label')).toBe('Progress, Page 11 of 12');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('11');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('1');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('12');
    expect(progressbar.hasAttribute('aria-valuetext')).toBe(false);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment')).toHaveLength(12);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(11);
    expect(progressbar.querySelector('.ofh-progress-indicator__segment-progress').style.width).toBe('0%');
  });
});
