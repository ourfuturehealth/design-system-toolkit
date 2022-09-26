/**
 * Global data file for design-examples.
 *
 * Finds all design system example templates under views/design-system/
 * and exports an array of examples to be rendered e.g.
 *
 * [
 *   {
 *     group: 'components',
 *     item: 'radios',
 *     layout: { name: 'default', template: 'design-example-wrapper.njk' },
 *     type: 'conditional'
 *   },
 *   ...
 * ]
 */

const path = require('node:path');
const glob = require('glob');

const isNotNull = (value) => value !== null;

function exampleToRender(layout) {
  return function createExampleSettings({ group, item, type }) {
    return {
      group,
      item,
      layout,
      type,
    };
  };
}

const designSystemTemplatesPath = path.join(__dirname, '../design-system/');
const exampleTemplatesGlobPattern = path.join(designSystemTemplatesPath, '*/**/index.njk');

const examples = glob.sync(exampleTemplatesGlobPattern)
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
  .filter(isNotNull);

const layouts = [
  { name: 'default', template: 'design-example-wrapper.njk' },
  { name: 'fullpage', template: 'design-example-wrapper-full.njk' },
  { name: 'blankpage', template: 'design-example-wrapper-blank.njk' },
];

const examplesToRender = layouts.flatMap((layout) => examples.map(exampleToRender(layout)));

module.exports = examplesToRender;
