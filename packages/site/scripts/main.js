// Import and initialize the design system toolkit components
import '@ourfuturehealth/toolkit/ofh';

// Import and initialize documentation site specific components
import DesignExample from './design-example';

document.addEventListener('DOMContentLoaded', () => {
  const designExamples = document.querySelectorAll(DesignExample.selector());
  const fragment = window.location.hash;
  const target = document.getElementById(fragment.slice(1));
  let loaded = false;
  let corrected = false;
  let resizeTimeout;

  function scheduleCorrection() {
    if (!loaded || corrected || !target || !target.matches('.design-example')) return;
    clearTimeout(resizeTimeout);
    // Resize messages can arrive just after load. Scroll once they have settled.
    resizeTimeout = setTimeout(() => {
      corrected = true;
      if (window.location.hash === fragment) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }, 150);
  }

  designExamples.forEach(example => new DesignExample(example, scheduleCorrection));
  if (!target || !target.matches('.design-example')) return;

  const pageLoaded = document.readyState === 'complete' ? Promise.resolve() :
    new Promise(resolve => window.addEventListener('load', resolve, { once: true }));

  Promise.all([pageLoaded, document.fonts.ready]).then(() => {
    loaded = true;
    scheduleCorrection();
  });
});
