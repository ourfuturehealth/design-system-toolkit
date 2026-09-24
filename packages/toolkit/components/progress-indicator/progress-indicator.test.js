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
    expect(progressbar.hasAttribute('aria-hidden')).toBe(false);
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
    expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
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
});
