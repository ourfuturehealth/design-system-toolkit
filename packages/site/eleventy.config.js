const highlightjs = require("highlight.js");
const nunjucks = require("nunjucks");

module.exports = function configuration(eleventyConfig) {
  // Watch source Sass/JS files so Eleventy can trigger browser reloads when
  // assets are rebuilt by external watchers.
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget("./styles/");
  eleventyConfig.addWatchTarget("./scripts/");
  eleventyConfig.addWatchTarget("../toolkit/core/");
  eleventyConfig.addWatchTarget("../toolkit/components/");
  eleventyConfig.addWatchTarget("../toolkit/ofh.scss");
  eleventyConfig.addWatchTarget("../toolkit/assets/");
  // Note: ../toolkit/dist/ is handled by passthrough copy and doesn't need watching

  // Documentation assets e.g. images, PDFs.
  eleventyConfig.addPassthroughCopy({ assets: "assets" });
  eleventyConfig.addPassthroughCopy({ components: "components" });
  eleventyConfig.addPassthroughCopy({
    "../toolkit/assets/icons/material-sprite.svg": "assets/icons/material-sprite.svg",
  });

  // Toolkit CSS & JavaScript assets.
  // These compiled toolkit assets are used by `views/_includes/standalone-example-layout.njk`.
  // The bundle task now includes assets (logos, favicons, icons) in dist/assets/.
  eleventyConfig.addPassthroughCopy({
    "../toolkit/dist": "ofh-design-system-toolkit",
  });

  // iframe-resizer is used by the isolated design examples (loaded in iframes).
  eleventyConfig.addPassthroughCopy({
    "node_modules/iframe-resizer/": "iframe-resizer",
  });

  // Prevent the output of toolkit CSS and JS assets in watch mode
  // triggering multiple rebuilds of the docs site.
  eleventyConfig.setWatchThrottleWaitTime(300);

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
