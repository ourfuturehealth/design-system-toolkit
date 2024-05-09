const highlightjs = require('highlight.js');

module.exports = function configuration(eleventyConfig) {
  // Watch the site CSS and JS builds so they trigger a hot reload when they change.
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget('site/dist/css/');
  eleventyConfig.addWatchTarget('site/dist/js/');

  // Documentation assets e.g. images, PDFs.
  eleventyConfig.addPassthroughCopy({ 'site/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'site/components': 'components' });

  // Toolkit CSS & JavaScript assets.
  // These compiled toolkit assets are used by `site/views/_includes/standalone-example-layout.njk`.
  eleventyConfig.addPassthroughCopy({ dist: 'ofh-design-system-toolkit' });

  // Toolkit image assets.
  // We're copying these directly from their source so they're watched
  // by Eleventy in development and trigger a hot reload when assets change.
  eleventyConfig.addPassthroughCopy({ 'packages/assets': 'ofh-design-system-toolkit/assets' });

  // iframe-resizer is used by the isolated design examples (loaded in iframes).
  eleventyConfig.addPassthroughCopy({ 'node_modules/iframe-resizer/': 'iframe-resizer' });

  // Prevent the output of toolkit CSS and JS assets in watch mode
  // triggering multiple rebuilds of the docs site.
  eleventyConfig.setWatchThrottleWaitTime(1000);

  eleventyConfig.addFilter('highlight', (code, language) => {
    const languages = language ? [language] : false;
    return highlightjs.highlightAuto(code.trim(), languages).value;
  });

  return {
    dir: {
      input: 'site/views/',
      output: 'site/dist/',
    },
  };
};
