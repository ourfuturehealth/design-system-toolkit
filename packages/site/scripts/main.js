// Import and initialize the design system toolkit components
import "@ourfuturehealth/toolkit/ofh";

// Import and initialize documentation site specific components
import DesignExample from "./design-example";

document.addEventListener("DOMContentLoaded", () => {
  const designExamples = document.querySelectorAll(DesignExample.selector());
  designExamples.forEach((example) => {
    new DesignExample(example);
  });
});
