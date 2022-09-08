/**
 * Global data file for design-examples.
 *
 * Finds all design system example templates under views/design-system/
 * and exports an array of examples to be rendered e.g.
 *
 * [
 *   {
 *     item: 'skip-link',
 *     layout: 'design-example-wrapper.njk',
 *     permalink: 'design-example/components/skip-link/default/',
 *     templatePath: '../design-system/components/skip-link/default/index.njk'
 *   }
 *   ...
 * ]
 */

const path = require('node:path');
const glob = require('glob');

const isNotNull = (value) => value !== null;

function exampleToRender({ group, item, type }) {
  // TODO: Move part of this path into the design wrapper templates
  const templatePath = `../design-system/${group}/${item}/${type}/index.njk`;

  return {
    item,
    layout: 'design-example-wrapper.njk',
    permalink: `design-example/${group}/${item}/${type}/`,
    templatePath,
  };
}

const designSystemTemplatesPath = path.join(__dirname, '../design-system/');
const exampleTemplatesGlobPattern = path.join(designSystemTemplatesPath, '*/**/index.njk');

// TODO: Render each example x each wrapper template
module.exports = glob.sync(exampleTemplatesGlobPattern)
  .map((examplePath) => {
    const cleanPath = examplePath
      .replace(designSystemTemplatesPath, '')
      .replace('/index.njk', '');

    // Structure: {group}/{item}/{type}
    const pathParts = cleanPath.split('/');

    const isExamplePath = pathParts.length === 3;
    if (isExamplePath) {
      const [group, item, type] = pathParts;

      return { group, item, type };
    }

    return null;
  })
  .filter(isNotNull)
  .map(exampleToRender);

// ----

// TODO: Have fullpage and blankpage as part of file name, not query string
//       Will need to modify the design-example.njk macro
// const req = { query: {} };
// const displayFullPage = req.query.fullpage === 'true';
// const blankPage = req.query.blankpage === 'true';

// Wrap the example HTML in a basic html base template.
// These live under views/_includes/
// let layout = 'design-example-wrapper.njk';
// if (displayFullPage) {
//   layout = 'design-example-wrapper-full.njk';
// }
// if (blankPage) {
//   layout = 'design-example-wrapper-blank.njk';
// }
