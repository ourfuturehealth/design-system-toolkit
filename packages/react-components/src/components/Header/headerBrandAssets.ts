import ofhLogoDefault from '@ourfuturehealth/toolkit/assets/logos/ofh-logo-default.svg?url';
import nhsPartnershipEnglandDesktop from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-england-desktop.svg?url';
import nhsPartnershipEnglandDesktopInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-england-desktop-inverted.svg?url';
import nhsPartnershipEnglandLargeDesktop from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-england-large-desktop.svg?url';
import nhsPartnershipEnglandLargeDesktopInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-england-large-desktop-inverted.svg?url';
import nhsPartnershipEnglandMobile from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-england-mobile.svg?url';
import nhsPartnershipEnglandMobileInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-england-mobile-inverted.svg?url';
import nhsPartnershipEnglandTablet from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-england-tablet.svg?url';
import nhsPartnershipEnglandTabletInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-england-tablet-inverted.svg?url';
import nhsPartnershipNorthernIrelandDesktop from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-northern-ireland-desktop.svg?url';
import nhsPartnershipNorthernIrelandDesktopInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-northern-ireland-desktop-inverted.svg?url';
import nhsPartnershipNorthernIrelandLargeDesktop from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-northern-ireland-large-desktop.svg?url';
import nhsPartnershipNorthernIrelandLargeDesktopInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-northern-ireland-large-desktop-inverted.svg?url';
import nhsPartnershipNorthernIrelandMobile from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-northern-ireland-mobile.svg?url';
import nhsPartnershipNorthernIrelandMobileInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-northern-ireland-mobile-inverted.svg?url';
import nhsPartnershipNorthernIrelandTablet from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-northern-ireland-tablet.svg?url';
import nhsPartnershipNorthernIrelandTabletInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-northern-ireland-tablet-inverted.svg?url';
import nhsPartnershipScotlandDesktop from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-scotland-desktop.svg?url';
import nhsPartnershipScotlandDesktopInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-scotland-desktop-inverted.svg?url';
import nhsPartnershipScotlandLargeDesktop from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-scotland-large-desktop.svg?url';
import nhsPartnershipScotlandLargeDesktopInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-scotland-large-desktop-inverted.svg?url';
import nhsPartnershipScotlandMobile from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-scotland-mobile.svg?url';
import nhsPartnershipScotlandMobileInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-scotland-mobile-inverted.svg?url';
import nhsPartnershipScotlandTablet from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-scotland-tablet.svg?url';
import nhsPartnershipScotlandTabletInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-scotland-tablet-inverted.svg?url';
import nhsPartnershipWalesDesktop from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-wales-desktop.svg?url';
import nhsPartnershipWalesDesktopInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-wales-desktop-inverted.svg?url';
import nhsPartnershipWalesLargeDesktop from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-wales-large-desktop.svg?url';
import nhsPartnershipWalesLargeDesktopInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-wales-large-desktop-inverted.svg?url';
import nhsPartnershipWalesMobile from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-wales-mobile.svg?url';
import nhsPartnershipWalesMobileInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-wales-mobile-inverted.svg?url';
import nhsPartnershipWalesTablet from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-wales-tablet.svg?url';
import nhsPartnershipWalesTabletInverted from '@ourfuturehealth/toolkit/assets/logos/nhs-partnership-wales-tablet-inverted.svg?url';

export type HeaderBrandNhsLogo = 'england' | 'scotland' | 'wales' | 'northern-ireland';

type HeaderBrandAssetSet = {
  desktop: string;
  desktopInverted: string;
  largeDesktop: string;
  largeDesktopInverted: string;
  mobile: string;
  mobileInverted: string;
  tablet: string;
  tabletInverted: string;
};

export const headerBrandLogoAssets = {
  ofhDefault: ofhLogoDefault,
  nhs: {
    england: {
      desktop: nhsPartnershipEnglandDesktop,
      desktopInverted: nhsPartnershipEnglandDesktopInverted,
      largeDesktop: nhsPartnershipEnglandLargeDesktop,
      largeDesktopInverted: nhsPartnershipEnglandLargeDesktopInverted,
      mobile: nhsPartnershipEnglandMobile,
      mobileInverted: nhsPartnershipEnglandMobileInverted,
      tablet: nhsPartnershipEnglandTablet,
      tabletInverted: nhsPartnershipEnglandTabletInverted,
    },
    'northern-ireland': {
      desktop: nhsPartnershipNorthernIrelandDesktop,
      desktopInverted: nhsPartnershipNorthernIrelandDesktopInverted,
      largeDesktop: nhsPartnershipNorthernIrelandLargeDesktop,
      largeDesktopInverted: nhsPartnershipNorthernIrelandLargeDesktopInverted,
      mobile: nhsPartnershipNorthernIrelandMobile,
      mobileInverted: nhsPartnershipNorthernIrelandMobileInverted,
      tablet: nhsPartnershipNorthernIrelandTablet,
      tabletInverted: nhsPartnershipNorthernIrelandTabletInverted,
    },
    scotland: {
      desktop: nhsPartnershipScotlandDesktop,
      desktopInverted: nhsPartnershipScotlandDesktopInverted,
      largeDesktop: nhsPartnershipScotlandLargeDesktop,
      largeDesktopInverted: nhsPartnershipScotlandLargeDesktopInverted,
      mobile: nhsPartnershipScotlandMobile,
      mobileInverted: nhsPartnershipScotlandMobileInverted,
      tablet: nhsPartnershipScotlandTablet,
      tabletInverted: nhsPartnershipScotlandTabletInverted,
    },
    wales: {
      desktop: nhsPartnershipWalesDesktop,
      desktopInverted: nhsPartnershipWalesDesktopInverted,
      largeDesktop: nhsPartnershipWalesLargeDesktop,
      largeDesktopInverted: nhsPartnershipWalesLargeDesktopInverted,
      mobile: nhsPartnershipWalesMobile,
      mobileInverted: nhsPartnershipWalesMobileInverted,
      tablet: nhsPartnershipWalesTablet,
      tabletInverted: nhsPartnershipWalesTabletInverted,
    },
  } satisfies Record<HeaderBrandNhsLogo, HeaderBrandAssetSet>,
};
