export interface SiteDefinition {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  elevationM: number;
  mask: 'lola' | 'flat' | 'ridge';
  summary: string;
}

export interface MissionConfig {
  presetId: string;
  siteA: SiteDefinition;
  siteB: SiteDefinition;
  startUtc: string;
  durationDays: number;
  loadWatts: number;
  batteryKwh: number;
  solarAreaM2: number;
  lang: 'tr' | 'en';
}

export interface SiteMetrics {
  sunHours: number;
  earthHours: number;
  bothHours: number;
  longestDarkHours: number;
  longestCommGapHours: number;
  peakSunElevDeg: number;
  energyYieldKwhPerM2: number;
  minBatteryPct: number;
  powerRatingKey: 'strong' | 'limited' | 'weak';
  commRatingKey: 'continuous' | 'intermittent' | 'relay';
}

export interface ComparisonResult {
  siteA: SiteMetrics;
  siteB: SiteMetrics;
  winner: 'A' | 'B' | 'equal';
  bothDeltaHours: number;
  atlasUrl: string;
}

export const LIVE_ATLAS_BASE_URL = 'https://fermanaliaslan.github.io/AstroApex/';

export const DEFAULT_ATLAS_URL =
  'https://fermanaliaslan.github.io/AstroApex/#a=ridge|-89.4632|-137.49|2027-01-08T00:00|lola&b=malapert|-85.9948|-0.23578|2027-01-08T00:00|lola&d=14&l=en&p=200|10|2';

export const LUNAR_SITES: Record<string, SiteDefinition> = {
  ridge: {
    id: 'ridge',
    name: 'Connecting Ridge',
    region: 'Shackleton – de Gerlache',
    lat: -89.4632,
    lon: -137.49,
    elevationM: 1210,
    mask: 'lola',
    summary: 'Artemis III South Pole ridge candidate with high solar illumination.',
  },
  malapert: {
    id: 'malapert',
    name: 'Malapert Massif',
    region: 'Malapert Plateau',
    lat: -85.9948,
    lon: -0.23578,
    elevationM: 4920,
    mask: 'lola',
    summary: 'High-elevation plateau offering near-continuous direct-to-Earth link.',
  },
  shackleton: {
    id: 'shackleton',
    name: 'Shackleton Rim',
    region: 'Shackleton Crater',
    lat: -89.68,
    lon: 129.2,
    elevationM: 1480,
    mask: 'lola',
    summary: 'Crater rim bordering permanently shadowed regions.',
  },
  degerlache: {
    id: 'degerlache',
    name: 'de Gerlache Rim',
    region: 'de Gerlache Plateau',
    lat: -88.32,
    lon: -68.1,
    elevationM: 1120,
    mask: 'lola',
    summary: 'South pole ridge providing balanced terrain slope and thermal profile.',
  },
  nobile: {
    id: 'nobile',
    name: 'Nobile Rim',
    region: 'Nobile Region',
    lat: -85.2,
    lon: 53.4,
    elevationM: 1640,
    mask: 'lola',
    summary: 'Broad landing ellipse suited for surface rover traverses.',
  },
  haworth: {
    id: 'haworth',
    name: 'Haworth Massif',
    region: 'Haworth North Ridge',
    lat: -87.45,
    lon: -5.18,
    elevationM: 2150,
    mask: 'lola',
    summary: 'Near-side communication geometry adjacent to cold traps.',
  },
};

export interface MissionPreset {
  id: string;
  label: string;
  siteAId: string;
  siteBId: string;
  startUtc: string;
  durationDays: number;
}

export const MISSION_PRESETS: MissionPreset[] = [
  {
    id: 'ridge-malapert',
    label: 'Connecting Ridge ↔ Malapert Massif',
    siteAId: 'ridge',
    siteBId: 'malapert',
    startUtc: '2027-01-08T00:00',
    durationDays: 14,
  },
  {
    id: 'shackleton-degerlache',
    label: 'Shackleton Rim ↔ de Gerlache Rim',
    siteAId: 'shackleton',
    siteBId: 'degerlache',
    startUtc: '2027-02-14T00:00',
    durationDays: 14,
  },
  {
    id: 'nobile-haworth',
    label: 'Nobile Rim ↔ Haworth Massif',
    siteAId: 'nobile',
    siteBId: 'haworth',
    startUtc: '2027-03-20T00:00',
    durationDays: 21,
  },
];

export const DEFAULT_MISSION_CONFIG: MissionConfig = {
  presetId: 'ridge-malapert',
  siteA: LUNAR_SITES.ridge,
  siteB: LUNAR_SITES.malapert,
  startUtc: '2027-01-08T00:00',
  durationDays: 14,
  loadWatts: 200,
  batteryKwh: 10,
  solarAreaM2: 2,
  lang: 'tr',
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function buildAstroApexUrl(config: MissionConfig): string {
  const aPart = `${config.siteA.id}|${config.siteA.lat}|${config.siteA.lon}|${config.startUtc}|${config.siteA.mask}`;
  const bPart = `${config.siteB.id}|${config.siteB.lat}|${config.siteB.lon}|${config.startUtc}|${config.siteB.mask}`;
  const pPart = `${config.loadWatts}|${config.batteryKwh}|${config.solarAreaM2}`;
  return `${LIVE_ATLAS_BASE_URL}#a=${aPart}&b=${bPart}&d=${config.durationDays}&l=${config.lang}&p=${pPart}`;
}

export function computeSiteMetrics(
  site: SiteDefinition,
  durationDays: number,
  loadWatts: number,
  batteryKwh: number,
  solarAreaM2: number
): SiteMetrics {
  const totalHours = durationDays * 24;
  const absLat = Math.abs(site.lat);

  const elevBonus = clamp(site.elevationM / 5000, 0, 1) * 0.14;
  const polarFactor = clamp((absLat - 84) / 6, 0, 1);
  const sunFraction = clamp(0.56 + polarFactor * 0.24 + elevBonus * 0.45, 0.35, 0.92);

  const lonRad = (site.lon * Math.PI) / 180;
  const nearSideBias = (Math.cos(lonRad) + 1) / 2;
  const earthFraction = clamp(0.42 + nearSideBias * 0.48 + elevBonus * 0.28, 0.2, 0.99);

  const sunHours = round1(totalHours * sunFraction);
  const earthHours = round1(totalHours * earthFraction);
  const bothFraction = clamp(
    sunFraction * earthFraction * 1.12,
    0.15,
    Math.min(sunFraction, earthFraction)
  );
  const bothHours = round1(totalHours * bothFraction);

  const longestDarkHours = round1(Math.max(4, (1 - sunFraction) * totalHours * 0.58));
  const longestCommGapHours = round1(
    earthFraction > 0.94 ? 0 : Math.max(2.5, (1 - earthFraction) * totalHours * 0.46)
  );

  const peakSunElevDeg = round1(clamp(90 - absLat + 1.54 + elevBonus * 4.2, 1.8, 12.5));
  const solarFluxKwPerM2 = 1.361;
  const panelEfficiency = 0.28;
  const energyYieldKwhPerM2 = round1(sunHours * solarFluxKwPerM2 * panelEfficiency * 0.82);

  const darkEnergyNeedKwh = (longestDarkHours * loadWatts) / 1000;
  const generationSurplusRatio =
    (solarAreaM2 * energyYieldKwhPerM2) / Math.max(0.5, (totalHours * loadWatts) / 1000);
  const socDropPct = (darkEnergyNeedKwh / Math.max(0.5, batteryKwh)) * 100;
  const minBatteryPct = Math.round(
    clamp(100 - socDropPct + Math.min(18, generationSurplusRatio * 6), 5, 98)
  );

  const powerRatingKey: SiteMetrics['powerRatingKey'] =
    minBatteryPct >= 45 && generationSurplusRatio >= 1.15
      ? 'strong'
      : minBatteryPct >= 20
        ? 'limited'
        : 'weak';

  const commRatingKey: SiteMetrics['commRatingKey'] =
    longestCommGapHours <= 1
      ? 'continuous'
      : earthFraction >= 0.45
        ? 'intermittent'
        : 'relay';

  return {
    sunHours,
    earthHours,
    bothHours,
    longestDarkHours,
    longestCommGapHours,
    peakSunElevDeg,
    energyYieldKwhPerM2,
    minBatteryPct,
    powerRatingKey,
    commRatingKey,
  };
}

export function compareMissionScenarios(config: MissionConfig): ComparisonResult {
  const siteA = computeSiteMetrics(
    config.siteA,
    config.durationDays,
    config.loadWatts,
    config.batteryKwh,
    config.solarAreaM2
  );
  const siteB = computeSiteMetrics(
    config.siteB,
    config.durationDays,
    config.loadWatts,
    config.batteryKwh,
    config.solarAreaM2
  );

  const diff = round1(siteA.bothHours - siteB.bothHours);
  const winner: ComparisonResult['winner'] =
    Math.abs(diff) < 0.5 ? 'equal' : diff > 0 ? 'A' : 'B';

  return {
    siteA,
    siteB,
    winner,
    bothDeltaHours: Math.abs(diff),
    atlasUrl: buildAstroApexUrl(config),
  };
}

export const CONTRIBUTORS: string[] = [
  'Atahan Karayel',
  'Burak Karabay',
  'Ferman Ali Aslan',
  'Melih Oğuz',
  'Bora Sancak',
];
