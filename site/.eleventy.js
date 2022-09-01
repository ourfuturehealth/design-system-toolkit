const highlightjs = require('highlight.js');

module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("baseUrl", process.env.BASE_URL || "");

  // Documentation assets e.g. images, PDFs
  eleventyConfig.addPassthroughCopy("assets");

  // Toolkit CSS & JavaScript assets
  eleventyConfig.addPassthroughCopy({ "../dist": "nhsuk-frontend" });
  // Toolkit image assets - TODO: Potentially don't need to copy all of ../packages/
  eleventyConfig.addPassthroughCopy({ "../packages": "nhsuk-frontend" });

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
