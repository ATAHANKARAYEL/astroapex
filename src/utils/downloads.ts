import {
  CONTRIBUTORS,
  type ComparisonResult,
  type MissionConfig,
} from './atlasData';
import { TRANSLATIONS, type TranslationBundle } from './i18n';

export interface DownloadArtifact {
  id: string;
  formatKey: 'htmlFormat' | 'csvFormat' | 'jsonFormat' | 'mdFormat';
  titleKey: 'htmlTitle' | 'csvTitle' | 'jsonTitle' | 'mdTitle';
  descKey: 'htmlDesc' | 'csvDesc' | 'jsonDesc' | 'mdDesc';
  filename: string;
  mimeType: string;
  featured?: boolean;
  buildContent: (
    config: MissionConfig,
    comparison: ComparisonResult,
    t?: TranslationBundle
  ) => string;
}

export function buildComparisonCsv(
  config: MissionConfig,
  comparison: ComparisonResult
): string {
  const headers = [
    'Scenario',
    'Site',
    'Latitude (deg)',
    'Longitude (deg)',
    'Start UTC',
    'Duration (days)',
    'Sun Visible (h)',
    'Earth Visible (h)',
    'Simultaneous (h)',
    'Longest Darkness (h)',
    'Longest Comm Gap (h)',
    'Peak Sun Elev (deg)',
    'Energy Yield (kWh/m2)',
    'Min Battery (%)',
  ];

  const rows = [
    [
      'A',
      config.siteA.name,
      config.siteA.lat,
      config.siteA.lon,
      config.startUtc,
      config.durationDays,
      comparison.siteA.sunHours,
      comparison.siteA.earthHours,
      comparison.siteA.bothHours,
      comparison.siteA.longestDarkHours,
      comparison.siteA.longestCommGapHours,
      comparison.siteA.peakSunElevDeg,
      comparison.siteA.energyYieldKwhPerM2,
      comparison.siteA.minBatteryPct,
    ],
    [
      'B',
      config.siteB.name,
      config.siteB.lat,
      config.siteB.lon,
      config.startUtc,
      config.durationDays,
      comparison.siteB.sunHours,
      comparison.siteB.earthHours,
      comparison.siteB.bothHours,
      comparison.siteB.longestDarkHours,
      comparison.siteB.longestCommGapHours,
      comparison.siteB.peakSunElevDeg,
      comparison.siteB.energyYieldKwhPerM2,
      comparison.siteB.minBatteryPct,
    ],
  ];

  const csvBody = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  return `\uFEFF${csvBody}\n`;
}

export function buildMissionConfigJson(
  config: MissionConfig,
  comparison: ComparisonResult
): string {
  const payload = {
    project: 'AstroApex',
    school: 'Sınav İncek Fen Lisesi',
    generatedAt: new Date().toISOString(),
    liveAtlasUrl: comparison.atlasUrl,
    missionParameters: {
      startUtc: config.startUtc,
      durationDays: config.durationDays,
      loadWatts: config.loadWatts,
      batteryKwh: config.batteryKwh,
      solarAreaM2: config.solarAreaM2,
    },
    scenarios: {
      A: {
        site: config.siteA,
        metrics: comparison.siteA,
      },
      B: {
        site: config.siteB,
        metrics: comparison.siteB,
      },
    },
    verdict: {
      preferredScenario: comparison.winner,
      simultaneousDeltaHours: comparison.bothDeltaHours,
    },
    contributors: CONTRIBUTORS,
  };

  return JSON.stringify(payload, null, 2);
}

export function buildTechnicalBriefMarkdown(
  config: MissionConfig,
  comparison: ComparisonResult,
  t: TranslationBundle = TRANSLATIONS.tr
): string {
  const winnerLabel =
    comparison.winner === 'equal'
      ? t.verdictEqual
      : `${
          comparison.winner === 'A' ? config.siteA.name : config.siteB.name
        } ${t.verdictMoreSuffix} +${comparison.bothDeltaHours} ${t.hoursUnit}`;

  return [
    `# ${t.mdTitle}`,
    ``,
    `- **${t.aboutSchool}:** AstroApex`,
    `- **URL:** ${comparison.atlasUrl}`,
    `- **UTC:** ${config.startUtc}`,
    `- **${t.durationLabel}:** ${config.durationDays} ${t.daysUnit}`,
    `- **${t.powerBudgetLabel}:** ${config.loadWatts} W · ${config.batteryKwh} kWh · ${config.solarAreaM2} m²`,
    ``,
    `## ${t.tab1Title}`,
    ``,
    `| ${t.metricCol} | ${config.siteA.name} | ${config.siteB.name} |`,
    `| --- | --- | --- |`,
    `| ${t.sunWord} (${t.hoursUnit}) | ${comparison.siteA.sunHours} | ${comparison.siteB.sunHours} |`,
    `| ${t.earthWord} (${t.hoursUnit}) | ${comparison.siteA.earthHours} | ${comparison.siteB.earthHours} |`,
    `| ${t.bothWord} (${t.hoursUnit}) | ${comparison.siteA.bothHours} | ${comparison.siteB.bothHours} |`,
    `| ${t.metricDark} | ${comparison.siteA.longestDarkHours} ${t.hoursUnit} | ${comparison.siteB.longestDarkHours} ${t.hoursUnit} |`,
    `| ${t.metricCommGap} | ${comparison.siteA.longestCommGapHours} ${t.hoursUnit} | ${comparison.siteB.longestCommGapHours} ${t.hoursUnit} |`,
    `| ${t.metricBattery} | %${comparison.siteA.minBatteryPct} | %${comparison.siteB.minBatteryPct} |`,
    ``,
    `**${t.verdictLabel}:** ${winnerLabel}`,
    ``,
    `## ${t.contribTitle}`,
    ...CONTRIBUTORS.map((name) => `- ${name}`),
    ``,
  ].join('\n');
}

export function buildOfflineAtlasLauncherHtml(
  config: MissionConfig,
  comparison: ComparisonResult,
  t: TranslationBundle = TRANSLATIONS.tr
): string {
  const esc = (s: string | number) =>
    String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  return `<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AstroApex · ${esc(config.siteA.name)} / ${esc(config.siteB.name)}</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; background: #0A0C0F; color: #ECE8DE; line-height: 1.55; padding: 32px 20px; }
    .wrap { max-width: 960px; margin: 0 auto; }
    .card { background: #12151A; border: 1px solid #272C36; border-radius: 12px; padding: 24px; margin-bottom: 20px; }
    h1 { margin: 0 0 8px; font-size: 28px; }
    h2 { margin: 0 0 14px; font-size: 18px; color: #ECE8DE; }
    .muted { color: #949AA8; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
    th, td { text-align: left; padding: 10px 12px; border-bottom: 1px solid #272C36; font-size: 14px; }
    th { color: #949AA8; font-weight: 500; }
    .btn { display: inline-block; margin-top: 12px; background: #ECE8DE; color: #0A0C0F; text-decoration: none; font-weight: 600; padding: 10px 18px; border-radius: 8px; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>AstroApex · ${esc(t.htmlTitle)}</h1>
      <p class="muted">${esc(t.aboutSchool)} · ${esc(config.startUtc)} UTC · ${esc(config.durationDays)} ${esc(t.daysUnit)} · ${esc(config.loadWatts)} W / ${esc(config.batteryKwh)} kWh / ${esc(config.solarAreaM2)} m²</p>
      <a class="btn" href="${esc(comparison.atlasUrl)}" target="_blank" rel="noopener noreferrer">${esc(t.openAtlas)}</a>
    </div>
    <div class="grid">
      <div class="card">
        <h2>${esc(t.scenarioALabel)} · ${esc(config.siteA.name)}</h2>
        <p class="muted mono">${esc(config.siteA.lat)}°, ${esc(config.siteA.lon)}° · LOLA</p>
      </div>
      <div class="card">
        <h2>${esc(t.scenarioBLabel)} · ${esc(config.siteB.name)}</h2>
        <p class="muted mono">${esc(config.siteB.lat)}°, ${esc(config.siteB.lon)}° · LOLA</p>
      </div>
    </div>
    <div class="card">
      <h2>${esc(t.tab1Title)}</h2>
      <table>
        <thead>
          <tr><th>${esc(t.metricCol)}</th><th>${esc(config.siteA.name)}</th><th>${esc(config.siteB.name)}</th></tr>
        </thead>
        <tbody>
          <tr><td>${esc(t.sunWord)} (${esc(t.hoursUnit)})</td><td>${esc(comparison.siteA.sunHours)}</td><td>${esc(comparison.siteB.sunHours)}</td></tr>
          <tr><td>${esc(t.earthWord)} (${esc(t.hoursUnit)})</td><td>${esc(comparison.siteA.earthHours)}</td><td>${esc(comparison.siteB.earthHours)}</td></tr>
          <tr><td>${esc(t.bothWord)} (${esc(t.hoursUnit)})</td><td>${esc(comparison.siteA.bothHours)}</td><td>${esc(comparison.siteB.bothHours)}</td></tr>
          <tr><td>${esc(t.metricDark)}</td><td>${esc(comparison.siteA.longestDarkHours)} ${esc(t.hoursUnit)}</td><td>${esc(comparison.siteB.longestDarkHours)} ${esc(t.hoursUnit)}</td></tr>
          <tr><td>${esc(t.metricCommGap)}</td><td>${esc(comparison.siteA.longestCommGapHours)} ${esc(t.hoursUnit)}</td><td>${esc(comparison.siteB.longestCommGapHours)} ${esc(t.hoursUnit)}</td></tr>
          <tr><td>${esc(t.metricBattery)}</td><td>%${esc(comparison.siteA.minBatteryPct)}</td><td>%${esc(comparison.siteB.minBatteryPct)}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h2>${esc(t.contribTitle)}</h2>
      <p class="muted">${CONTRIBUTORS.map((name) => esc(name)).join(' · ')}</p>
    </div>
  </div>
</body>
</html>`;
}

export const DOWNLOAD_ARTIFACTS: DownloadArtifact[] = [
  {
    id: 'offline-html',
    formatKey: 'htmlFormat',
    titleKey: 'htmlTitle',
    descKey: 'htmlDesc',
    filename: 'AstroApex-Cevrimdisi-Atlas.html',
    mimeType: 'text/html;charset=utf-8',
    featured: true,
    buildContent: buildOfflineAtlasLauncherHtml,
  },
  {
    id: 'metrics-csv',
    formatKey: 'csvFormat',
    titleKey: 'csvTitle',
    descKey: 'csvDesc',
    filename: 'AstroApex-Saha-Karsilastirma.csv',
    mimeType: 'text/csv;charset=utf-8',
    buildContent: buildComparisonCsv,
  },
  {
    id: 'mission-json',
    formatKey: 'jsonFormat',
    titleKey: 'jsonTitle',
    descKey: 'jsonDesc',
    filename: 'AstroApex-Gorev-Paketi.json',
    mimeType: 'application/json;charset=utf-8',
    buildContent: buildMissionConfigJson,
  },
  {
    id: 'brief-md',
    formatKey: 'mdFormat',
    titleKey: 'mdTitle',
    descKey: 'mdDesc',
    filename: 'AstroApex-Teknik-Brifing.md',
    mimeType: 'text/markdown;charset=utf-8',
    buildContent: buildTechnicalBriefMarkdown,
  },
];

export function formatByteSize(text: string): string {
  const bytes = new Blob([text]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function triggerFileDownload(
  filename: string,
  content: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
