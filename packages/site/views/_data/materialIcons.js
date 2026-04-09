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

// Custom sort: logical groupings for better usability
const icons = [...manifest.icons];

// Define logical orderings for each category
const categoryOrders = {
  DataValidation: [
    // Positive/Success
    "Check",
    "CheckCircle",
    "CheckCircleOutline",
    // Negative/Cancel
    "Close",
    "Cancel",
    "CancelOutline",
    // Add/Remove
    "AddCircle",
    "AddCircleOutline",
    "MinusCircle",
    "MinusCircleOutline",
  ],
  Action: [
    "Search",
    // Account
    "AccountCircle",
    "AccountCircleOutline",
    // Favorites
    "Favorite",
    "FavoriteOutline",
    // Calendar
    "Calendar",
    "CalendarOutline",
    // Other actions
    "FileDownloadOutline",
    "Launch",
  ],
  Arrows: [
    // Horizontal navigation
    "ChevronRight",
    "ChevronLeft",
    "ArrowRight",
    "ArrowLeft",
    // Vertical expand/collapse
    "ChevronDown",
    "ChevronUp",
    "UnfoldMore",
    "UnfoldLess",
    // Special arrows
    "ArrowCircleRight",
    "ArrowCircleRightColour",
  ],
  Graphical: [
    // Location/Places
    "FamilyHome",
    "WorkOutline",
    "HospitalOutlined",
    "LocationOutline",
    // Health/Medical
    "HealthCrossOutline",
    "HealthAndSafetyOutline",
    "TestTubeOutline",
    // Lists
    "ListAltOutline",
    "ListAltCheckedOutline",
    // Time
    "ClockOutline",
    "Clock",
    // Info
    "InfoOutline",
  ],
  Socials: [
    // Group each platform with its hover state
    "Linkedin",
    "LinkedinHover",
    "X",
    "XHover",
    "Facebook",
    "FacebookHover",
    "Youtube",
    "YoutubeHover",
    "Instagram",
    "InstagramHover",
    "Tiktok",
    "TiktokHover",
  ],
};

const iconsByCategory = categoryOrder
  .map((category) => {
    const categoryIcons = icons.filter((icon) => icon.category === category);
    
    // Stepper: preserve manifest order (numerical ListZero-ListNine)
    if (category === "Stepper") {
      // No sorting needed
    } else if (categoryOrders[category]) {
      // Use custom logical order for categories with defined orderings
      categoryIcons.sort((a, b) => {
        const indexA = categoryOrders[category].indexOf(a.name);
        const indexB = categoryOrders[category].indexOf(b.name);
        return indexA - indexB;
      });
    } else {
      // Fallback to alphabetical for any unconfigured categories
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
