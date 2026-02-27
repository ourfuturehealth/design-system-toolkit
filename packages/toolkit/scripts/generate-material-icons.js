const fs = require('node:fs');
const path = require('node:path');

const materialDir = path.resolve(__dirname, '../assets/icons/material');
const manifestPath = path.join(materialDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const icons = Object.fromEntries(
  manifest.icons.map((icon) => [icon.name, icon]),
);

const bodies = {
  search: '<path d="M15.5 14h-.79l-.28-.27a6 6 0 1 0-.71.71l.27.28v.79L19 21l2-2-5.5-5zM10 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>',
  cross: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>',
  'cross-circle': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 8.5l-7 7m7 0l-7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'cross-circle-solid': '<circle cx="12" cy="12" r="10"/><path d="M15.5 8.5l-7 7m7 0l-7-7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  tick: '<path d="M9 16.2 5.5 12.7 4 14.2 9 19l11-11-1.5-1.5z"/>',
  'tick-circle': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12.5l2.3 2.3 4.7-4.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'tick-circle-solid': '<circle cx="12" cy="12" r="10"/><path d="M9 12.5l2.3 2.3 4.7-4.7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'plus-circle-solid': '<circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  'minus-circle-solid': '<circle cx="12" cy="12" r="10"/><path d="M7 12h10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  'new-tab': '<path d="M14 3h7v7h-2V6.41l-8.29 8.3-1.42-1.42 8.3-8.29H14V3z"/><path d="M5 5h6v2H7v10h10v-4h2v6H5V5z"/>',
  calendar: '<path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm11 8H6v10h12V10z"/>',
  'calendar-solid': '<path d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2z"/>',
  heart: '<path d="M12 21s-7-4.35-9.2-8.1C1.3 10.5 2.6 7 6 7c2 0 3.1 1.1 4 2.3C10.9 8.1 12 7 14 7c3.4 0 4.7 3.5 3.2 5.9C19 16.65 12 21 12 21z" fill="none" stroke="currentColor" stroke-width="2"/>',
  'heart-solid': '<path d="M12 21s-7-4.35-9.2-8.1C1.3 10.5 2.6 7 6 7c2 0 3.1 1.1 4 2.3C10.9 8.1 12 7 14 7c3.4 0 4.7 3.5 3.2 5.9C19 16.65 12 21 12 21z"/>',
  user: '<circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21c1.8-3.2 5-5 8-5s6.2 1.8 8 5" fill="none" stroke="currentColor" stroke-width="2"/>',
  'user-solid': '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.8-3.2 5-5 8-5s6.2 1.8 8 5"/>',
  download: '<path d="M11 4h2v8h3l-4 4-4-4h3V4zm-6 14h14v2H5z"/>',
  'chevron-left': '<path d="M8.5 12c0-.3.1-.5.3-.7l5-5c.4-.4 1-.4 1.4 0s.4 1 0 1.4L10.9 12l4.3 4.3c.4.4.4 1 0 1.4s-1 .4-1.4 0l-5-5c-.2-.2-.3-.4-.3-.7z"/>',
  'chevron-right': '<path d="M15.5 12a1 1 0 0 1-.29.71l-5 5a1 1 0 0 1-1.42-1.42l4.3-4.29-4.3-4.29a1 1 0 0 1 1.42-1.42l5 5a1 1 0 0 1 .29.71z"/>',
  'chevron-up': '<path d="M12 8.5a1 1 0 0 1 .71.29l5 5a1 1 0 0 1-1.42 1.42L12 11.91l-4.29 4.3a1 1 0 0 1-1.42-1.42l5-5A1 1 0 0 1 12 8.5z"/>',
  'chevron-down': '<path d="M12 15.5a1 1 0 0 1-.71-.29l-5-5a1 1 0 0 1 1.42-1.42L12 12.09l4.29-4.3a1 1 0 0 1 1.42 1.42l-5 5a1 1 0 0 1-.71.29z"/>',
  'arrow-right': '<path d="M19.6 11.66l-2.73-3A.51.51 0 0 0 16 9v2H5a1 1 0 0 0 0 2h11v2a.5.5 0 0 0 .32.46.39.39 0 0 0 .18 0 .52.52 0 0 0 .37-.16l2.73-3a.5.5 0 0 0 0-.64z"/>',
  'arrow-left': '<path d="M4.1 12.3l2.7 3c.2.2.5.2.7 0 .1-.1.1-.2.1-.3v-2h11c.6 0 1-.4 1-1s-.4-1-1-1h-11V9c0-.2-.1-.4-.3-.5h-.2c-.1 0-.3.1-.4.2l-2.7 3c0 .2 0 .4.1.6z"/>',
  'arrow-right-solid': '<circle cx="12" cy="12" r="10"/><path d="M7 12h8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="m12 8 4 4-4 4" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  'arrow-right-solid-color': '<circle cx="12" cy="12" r="10" fill="#FFC62C"/><path d="M7 12h8" fill="none" stroke="#011D4B" stroke-width="2" stroke-linecap="round"/><path d="m12 8 4 4-4 4" fill="none" stroke="#011D4B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  clock: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v6l4 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  'clock-solid': '<circle cx="12" cy="12" r="10"/><path d="M12 7v6l4 2" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
  location: '<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zm0-9a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>',
  expand: '<path d="M7 11h10v2H7zM11 7h2v10h-2z"/>',
  collapse: '<path d="M7 11h10v2H7z"/>',
  information: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="8" r="1"/>'
};

function placeholderBody(name) {
  if (name.startsWith('stepper-')) {
    return '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>';
  }

  return '<rect x="5" y="5" width="14" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>';
}

for (const { name } of manifest.icons) {
  const body = bodies[name] || placeholderBody(name);
  const filePath = path.join(materialDir, `${name}.svg`);
  const content = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">',
    `  ${body}`,
    '</svg>'
  ].join('\n');

  fs.writeFileSync(filePath, `${content}\n`);
}

console.log(`Generated ${manifest.icons.length} material icon SVG files.`);
