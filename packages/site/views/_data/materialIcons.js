const path = require("node:path");

const manifestPath = path.join(
  __dirname,
  "../../../toolkit/assets/icons/material/manifest.json",
);
const manifest = require(manifestPath);

const categoryOrder = [
  "Data Validation",
  "Action",
  "Arrows",
  "Graphical",
  "Stepper",
  "Socials",
];

const icons = [...manifest.icons].sort((a, b) => a.name.localeCompare(b.name));

const iconsByCategory = categoryOrder
  .map((category) => ({
    category,
    icons: icons.filter((icon) => icon.category === category),
  }))
  .filter((group) => group.icons.length > 0);

module.exports = {
  total: icons.length,
  spritePath: "/assets/icons/material-sprite.svg",
  sizeOptions: manifest.sizeOptions,
  iconsByCategory,
};
