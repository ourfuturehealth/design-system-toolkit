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

// Custom sort: preserve manifest order for Stepper icons (LooksZero-LooksNine),
// alphabetically sort others
const icons = [...manifest.icons];

const iconsByCategory = categoryOrder
  .map((category) => {
    const categoryIcons = icons.filter((icon) => icon.category === category);
    // Keep original order for Stepper category (numerical LooksX icons)
    // Sort alphabetically for all other categories
    if (category !== "Stepper") {
      categoryIcons.sort((a, b) => a.name.localeCompare(b.name));
    }
    return {
      category,
      icons: categoryIcons,
    };
  })
  .filter((group) => group.icons.length > 0);

module.exports = {
  total: icons.length,
  spritePath: "/assets/icons/material-sprite.svg",
  sizeOptions: manifest.sizeOptions,
  iconsByCategory,
};
