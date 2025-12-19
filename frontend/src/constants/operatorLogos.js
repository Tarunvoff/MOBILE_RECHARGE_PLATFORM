const OPERATOR_META = {
  AIR: {
    name: 'Airtel',
    logo: 'https://www.logo.wine/a/logo/Airtel_India/Airtel_India-Logo.wine.svg',
  },
  JIO: {
    name: 'Jio',
    logo: 'https://www.logo.wine/a/logo/Jio/Jio-Logo.wine.svg',
  },
  VI: {
    name: 'Vi',
    logo: 'https://pnghdpro.com/wp-content/themes/pnghdpro/download/social-media-and-brands/vi-vodafone-idea-app-icon.png',
  },
  BSN: {
    name: 'BSNL',
    logo: 'https://www.logo.wine/a/logo/Bharat_Sanchar_Nigam_Limited/Bharat_Sanchar_Nigam_Limited-Logo.wine.svg',
  },
  TPD: {
    name: 'Tata Play',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Tata_Play_2022_logo.svg/2560px-Tata_Play_2022_logo.svg.png',
  },
  DST: {
    name: 'Dish TV',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4C-NUmWTrbMaFHcHH2Gw5UCEP1Q87m-mDbg&s',
  },
  SND: {
    name: 'Sun Direct',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/SD-HD-Logo.svg',
  },
  BES: {
    name: 'BESCOM Electricity',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCEC9zwlJKypLXgaI619UnlqGXY2H7uxDnyQ&s',
  },
  BWSSB: {
    name: 'Bangalore Water Board',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn_2e8i26pGSRq1HFYWeFfd92SDPLHyz1RHw&s',
  },
  ACTF: {
    name: 'ACT Fibernet',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu5PMHu1uP0cpygIq7oEUyoZ3e_h6qlyYCug&s',
  },
  JIOD: {
    name: 'Jio Data Booster',
    logo: 'https://www.logo.wine/a/logo/Jio/Jio-Logo.wine.svg',
  },
  AIRD: {
    name: 'Airtel Data Booster',
    logo: 'https://www.logo.wine/a/logo/Airtel_India/Airtel_India-Logo.wine.svg',
  },
};

const ALT_NAME_TO_CODE = {
  'AIRTEL DATA BOOSTER': 'AIRD',
  'AIRTEL': 'AIR',
  'RELIANCE JIO': 'JIO',
  'JIO DATA BOOSTER': 'JIOD',
  'VODAFONE IDEA': 'VI',
  'TATA PLAY': 'TPD',
  'TATA PLAY DTH': 'TPD',
  'TATA SKY': 'TPD',
  'DISH TV': 'DST',
  'SUN DIRECT': 'SND',
  'BESCOM ELECTRICITY': 'BES',
  BESCOM: 'BES',
  'BANGALORE WATER BOARD': 'BWSSB',
  BWSSB: 'BWSSB',
  'ACT FIBERNET': 'ACTF',
};

const SERVICE_FALLBACKS = {
  MOBILE: 'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=512&q=80',
  DTH: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=512&q=80',
  BILL: 'https://images.unsplash.com/photo-1589739905946-5eeaf957068d?auto=format&fit=crop&w=512&q=80',
  DATA: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=512&q=80',
};

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=512&q=80';

const getCodeFromName = (name = '') => {
  if (!name) return null;
  const normalized = name.trim().toUpperCase();
  return ALT_NAME_TO_CODE[normalized] ||
    Object.entries(OPERATOR_META).find(([, meta]) => meta.name.toUpperCase() === normalized)?.[0] ||
    null;
};

export const getOperatorLogo = ({ code, name, serviceType, logo } = {}) => {
  const normalizedCode = code?.toUpperCase?.();
  const metaByCode = normalizedCode ? OPERATOR_META[normalizedCode] : null;
  if (metaByCode?.logo) return metaByCode.logo;

  const derivedCode = getCodeFromName(name);
  if (derivedCode && OPERATOR_META[derivedCode]?.logo) {
    return OPERATOR_META[derivedCode].logo;
  }

  if (logo) return logo;

  const normalizedService = serviceType?.toUpperCase?.();
  if (normalizedService && SERVICE_FALLBACKS[normalizedService]) {
    return SERVICE_FALLBACKS[normalizedService];
  }

  return DEFAULT_FALLBACK;
};

export const LANDING_OPERATOR_CODES = ['AIR', 'JIO', 'VI', 'BSN', 'TPD', 'DST'];

export const LANDING_OPERATORS = LANDING_OPERATOR_CODES.map((code) => ({
  name: OPERATOR_META[code]?.name || code,
  logo: OPERATOR_META[code]?.logo || DEFAULT_FALLBACK,
}));

export default OPERATOR_META;