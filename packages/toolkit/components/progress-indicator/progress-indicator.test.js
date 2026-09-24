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
    expect(progressbar.getAttribute('aria-label')).toBe(`Personal details: ${pageText}`);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment')).toHaveLength(5);
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(expectedStep);
  });

  it('preserves percentage progress and free-form progress text', () => {
    const indicator = document.querySelector('[data-percentage]');
    const progressbar = indicator.querySelector('[role="progressbar"]');

    expect(indicator.querySelector('.ofh-progress-indicator__steps').textContent).toBe('Custom progress text');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('40');
    expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('100');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('40%');
    expect(progressbar.getAttribute('aria-label')).toBe('40%');
    expect(progressbar.querySelectorAll('.ofh-progress-indicator__segment--filled')).toHaveLength(2);
    expect(progressbar.querySelector('.ofh-progress-indicator__segment-progress').style.width).toBe('50%');
  });
});
