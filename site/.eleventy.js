const highlightjs = require('highlight.js');

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("baseUrl", process.env.BASE_URL || "");

  // Documentation assets e.g. images, PDFs.
  eleventyConfig.addPassthroughCopy("assets");

  // Toolkit CSS & JavaScript assets.
  // These compiled toolkit assets are used by `site/views/_includes/standalone-example-layout.njk`.
  eleventyConfig.addPassthroughCopy({ "../dist": "nhsuk-frontend" });

  // Toolkit image assets.
  // We're copying these directly from their source so they're watched
  // by Eleventy in development and trigger a hot reload when assets change.
  eleventyConfig.addPassthroughCopy({ "../packages/assets": "nhsuk-frontend/assets" });

  // Prevent the output of toolkit CSS and JS assets in watch mode
  // triggering multiple rebuilds of the docs site.
  eleventyConfig.setWatchThrottleWaitTime(1000);

  eleventyConfig.addFilter("highlight", (code, language) => {
    const languages = language ? [language] : false;
    return highlightjs.highlightAuto(code.trim(), languages).value;
  });

  return {
    dir: {
      input: "views",
      output: "dist",
    },
  };
};
