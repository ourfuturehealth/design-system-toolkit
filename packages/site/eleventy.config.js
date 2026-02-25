const highlightjs = require("highlight.js");
const nunjucks = require("nunjucks");

module.exports = function configuration(eleventyConfig) {
  // Watch the site CSS and JS builds so they trigger a hot reload when they change.
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget("./dist/css/");
  eleventyConfig.addWatchTarget("./dist/js/");
  eleventyConfig.addWatchTarget("../toolkit/assets/");
  eleventyConfig.addWatchTarget("../toolkit/dist/");

  // Documentation assets e.g. images, PDFs.
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ components: "components" });

  // Toolkit CSS & JavaScript assets.
  // These compiled toolkit assets are used by `views/_includes/standalone-example-layout.njk`.
  eleventyConfig.addPassthroughCopy({
    "../toolkit/dist": "ofh-design-system-toolkit",
  });

  // iframe-resizer is used by the isolated design examples (loaded in iframes).
  eleventyConfig.addPassthroughCopy({
    "node_modules/iframe-resizer/": "iframe-resizer",
  });

  // Prevent the output of toolkit CSS and JS assets in watch mode
  // triggering multiple rebuilds of the docs site.
  eleventyConfig.setWatchThrottleWaitTime(100);

  const nunjucksEnv = nunjucks.configure(
    [
      "views/",
      "views/_includes/",
      "./",
      "../toolkit/components/",
      "../toolkit/",
    ],
    {
      watch: false,
      noCache: true,
    },
  );

  eleventyConfig.setLibrary("njk", nunjucksEnv);

  eleventyConfig.addFilter("highlight", (code, language) => {
    const languages = language ? [language] : false;
    return highlightjs.highlightAuto(code.trim(), languages).value;
  });

  return {
    dir: {
      input: "views/",
      output: "dist/",
    },
  };
};
