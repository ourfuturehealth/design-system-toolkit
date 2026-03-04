const fs = require('node:fs');
const path = require('node:path');

const iconsDir = path.resolve(__dirname, '../assets/icons');
const spritePath = path.resolve(__dirname, '../assets/icons/icon-sprite.svg');

const files = fs
  .readdirSync(iconsDir)
  .filter((file) => file.endsWith('.svg'))
  .sort();

function extractSvgParts(svg) {
  const viewBoxMatch = svg.match(/viewBox\s*=\s*"([^"]+)"/i);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

  const bodyMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const body = bodyMatch ? bodyMatch[1].trim() : '';

  return { viewBox, body };
}

const symbols = files.map((file) => {
  const filePath = path.join(iconsDir, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { viewBox, body } = extractSvgParts(raw);
  const id = `ofh-icon-${path.basename(file, '.svg')}`;

  return `  <symbol id="${id}" viewBox="${viewBox}">\n${body.split('\n').map((line) => `    ${line}`).join('\n')}\n  </symbol>`;
});

const sprite = [
  '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">',
  ...symbols,
  '</svg>',
  ''
].join('\n');

fs.writeFileSync(spritePath, sprite);
console.log(`Built sprite with ${symbols.length} symbols -> ${path.relative(process.cwd(), spritePath)}`);
