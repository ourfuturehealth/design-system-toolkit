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
    "Done",
    "CheckCircle",
    "CheckCircleOutline",
    // Negative/Cancel
    "Close",
    "Cancel",
    "CancelOutlined",
    // Add/Remove
    "AddCircle",
    "RemoveCircle",
  ],
  Action: [
    "Search",
    // Account
    "AccountCircle",
    "AccountCircleOutlined",
    // Favorites
    "Favorite",
    "FavoriteBorderOutlined",
    // Calendar
    "CalendarToday",
    "CalendarTodayOutlined",
    // Other actions
    "FileDownloadOutlined",
    "Launch",
  ],
  Arrows: [
    // Horizontal navigation
    "ChevronRight",
    "ChevronLeft",
    "East",
    "West",
    // Vertical expand/collapse
    "ExpandMore",
    "ExpandLess",
    "UnfoldMore",
    "UnfoldLess",
    // Special arrows
    "ArrowCircleRight",
    "ArrowCircleRightColour",
  ],
  Graphical: [
    // Location/Places
    "FamilyHome",
    "WorkOutlineOutlined",
    "HospitalOutlined",
    "FmdGoodOutlined",
    // Health/Medical
    "HealthCrossOutlined",
    "HealthAndSafetyOutlined",
    "TestTubeOutlined",
    // Lists
    "ListAltOutlined",
    "ListAltCheckedOutlined",
    // Time
    "AccessTime",
    "WatchLater",
    // Info
    "InfoOutlined",
  ],
  Socials: [
    // Group each platform with its hover state
    "LinkedIn",
    "LinkedInHover",
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
    
    // Stepper: preserve manifest order (numerical LooksZero-LooksNine)
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
