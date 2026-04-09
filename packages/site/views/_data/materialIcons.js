const path = require("node:path");

const manifestPath = path.join(
  __dirname,
  "../../../toolkit/assets/icons/manifest.json",
);
const manifest = require(manifestPath);

const categoryOrder = [
  "DataValidation",
  "Action",
  "Arrows",
  "Graphical",
  "Stepper",
  "Socials",
];

const icons = [...manifest.icons];

const iconsByCategory = categoryOrder
  .map((category) => {
    const categoryIcons = icons.filter((icon) => icon.category === category);

    if (category === 'Stepper') {
      const stepperOrder = [
        'ListZero',
        'ListOne',
        'ListTwo',
        'ListThree',
        'ListFour',
        'ListFive',
        'ListSix',
        'ListSeven',
        'ListEight',
        'ListNine',
      ];

      categoryIcons.sort((a, b) => {
        return stepperOrder.indexOf(a.name) - stepperOrder.indexOf(b.name);
      });
    } else {
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
  spritePath: "/assets/icons/icon-sprite.svg",
  sizeOptions: manifest.sizeOptions,
  iconsByCategory,
};
