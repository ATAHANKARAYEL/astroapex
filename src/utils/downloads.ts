import {
  CONTRIBUTORS,
  type ComparisonResult,
  type MissionConfig,
} from './atlasData';

export interface DownloadArtifact {
  id: string;
  title: string;
  formatLabel: string;
  filename: string;
  mimeType: string;
  description: string;
  featured?: boolean;
  buildContent: (config: MissionConfig, comparison: ComparisonResult) => string;
}

export function buildComparisonCsv(
  config: MissionConfig,
  comparison: ComparisonResult
): string {
  const headers = [
    'Senaryo',
    'Saha Adi',
    'Enlem (deg)',
    'Boylam (deg)',
    'Baslangic UTC',
    'Sure (gun)',
    'Gunes Gorunur (sa)',
    'Dunya Gorunur (sa)',
    'Ortak Gorus (sa)',
    'En Uzun Karanlik (sa)',
    'En Uzun Iletisim Kesintisi (sa)',
    'Maks Gunes Yukselimi (deg)',
    'Enerji Verimi (kWh/m2)',
    'Min Batarya (%)',
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
    project: 'AstroApex · Ay İniş Sahası Gezgini',
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
    contributors: CONTRIBUTORS.map((c) => `${c.name} (${c.role})`),
  };

  return JSON.stringify(payload, null, 2);
}

export function buildTechnicalBriefMarkdown(
  config: MissionConfig,
  comparison: ComparisonResult
): string {
  const winnerLabel =
    comparison.winner === 'equal'
      ? 'İki saha eşit ortak görüş süresine sahiptir.'
      : `Senaryo ${comparison.winner} (${
          comparison.winner === 'A' ? config.siteA.name : config.siteB.name
        }) +${comparison.bothDeltaHours} saat daha fazla Güneş+Dünya ortak görüş penceresi sunar.`;

  return [
    `# AstroApex Teknik Görev Brifingi`,
    ``,
    `- **Canlı Atlas Bağlantısı:** ${comparison.atlasUrl}`,
    `- **Görev Başlangıcı (UTC):** ${config.startUtc}`,
    `- **Görev Süresi:** ${config.durationDays} gün`,
    `- **Güç Konfigürasyonu:** ${config.loadWatts} W yük · ${config.batteryKwh} kWh batarya · ${config.solarAreaM2} m² solar panel`,
    ``,
    `## Saha Karşılaştırma Özeti`,
    ``,
    `| Ölçüm | Senaryo A: ${config.siteA.name} | Senaryo B: ${config.siteB.name} |`,
    `| --- | --- | --- |`,
    `| Koordinat | ${config.siteA.lat}°, ${config.siteA.lon}° | ${config.siteB.lat}°, ${config.siteB.lon}° |`,
    `| Güneş Görünür (sa) | ${comparison.siteA.sunHours} | ${comparison.siteB.sunHours} |`,
    `| Dünya Görünür (sa) | ${comparison.siteA.earthHours} | ${comparison.siteB.earthHours} |`,
    `| Ortak Görüş (sa) | ${comparison.siteA.bothHours} | ${comparison.siteB.bothHours} |`,
    `| En Uzun Karanlık (sa) | ${comparison.siteA.longestDarkHours} | ${comparison.siteB.longestDarkHours} |`,
    `| Min Batarya (%) | %${comparison.siteA.minBatteryPct} | %${comparison.siteB.minBatteryPct} |`,
    ``,
    `**Ortak Görüş Değerlendirmesi:** ${winnerLabel}`,
    ``,
    `## Emeği Geçenler`,
    ...CONTRIBUTORS.map((c) => `- **${c.name}** — ${c.role}`),
    ``,
  ].join('\n');
}

export function buildOfflineAtlasLauncherHtml(
  config: MissionConfig,
  comparison: ComparisonResult
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
  <title>AstroApex Çevrimdışı Görev Paketi · ${esc(config.siteA.name)} vs ${esc(config.siteB.name)}</title>
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
      <h1>AstroApex · Çevrimdışı Görev Özeti</h1>
      <p class="muted">Başlangıç: ${esc(config.startUtc)} UTC · Süre: ${esc(config.durationDays)} gün · Güç: ${esc(config.loadWatts)} W / ${esc(config.batteryKwh)} kWh / ${esc(config.solarAreaM2)} m²</p>
      <a class="btn" href="${esc(comparison.atlasUrl)}" target="_blank" rel="noopener noreferrer">Canlı AstroApex Atlasında Aç</a>
    </div>
    <div class="grid">
      <div class="card">
        <h2>Senaryo A · ${esc(config.siteA.name)}</h2>
        <p class="muted mono">${esc(config.siteA.lat)}°, ${esc(config.siteA.lon)}° · LOLA</p>
        <p>${esc(config.siteA.summary)}</p>
      </div>
      <div class="card">
        <h2>Senaryo B · ${esc(config.siteB.name)}</h2>
        <p class="muted mono">${esc(config.siteB.lat)}°, ${esc(config.siteB.lon)}° · LOLA</p>
        <p>${esc(config.siteB.summary)}</p>
      </div>
    </div>
    <div class="card">
      <h2>Karşılaştırmalı Telemetri Tablosu</h2>
      <table>
        <thead>
          <tr><th>Ölçüm</th><th>${esc(config.siteA.name)}</th><th>${esc(config.siteB.name)}</th></tr>
        </thead>
        <tbody>
          <tr><td>Güneş Görünür (sa)</td><td>${esc(comparison.siteA.sunHours)}</td><td>${esc(comparison.siteB.sunHours)}</td></tr>
          <tr><td>Dünya Görünür (sa)</td><td>${esc(comparison.siteA.earthHours)}</td><td>${esc(comparison.siteB.earthHours)}</td></tr>
          <tr><td>Ortak Görüş (sa)</td><td>${esc(comparison.siteA.bothHours)}</td><td>${esc(comparison.siteB.bothHours)}</td></tr>
          <tr><td>En Uzun Karanlık (sa)</td><td>${esc(comparison.siteA.longestDarkHours)}</td><td>${esc(comparison.siteB.longestDarkHours)}</td></tr>
          <tr><td>En Uzun İletişim Kesintisi (sa)</td><td>${esc(comparison.siteA.longestCommGapHours)}</td><td>${esc(comparison.siteB.longestCommGapHours)}</td></tr>
          <tr><td>En Düşük Batarya (%)</td><td>%${esc(comparison.siteA.minBatteryPct)}</td><td>%${esc(comparison.siteB.minBatteryPct)}</td></tr>
        </tbody>
      </table>
    </div>
    <div class="card">
      <h2>Emeği Geçenler</h2>
      <p class="muted">${CONTRIBUTORS.map((c) => esc(c.name)).join(' · ')}</p>
    </div>
  </div>
</body>
</html>`;
}

export const DOWNLOAD_ARTIFACTS: DownloadArtifact[] = [
  {
    id: 'offline-html',
    title: 'AstroApex Çevrimdışı Görev Atlası',
    formatLabel: 'HTML Paketi',
    filename: 'AstroApex-Cevrimdisi-Atlas.html',
    mimeType: 'text/html;charset=utf-8',
    description:
      'Seçili A/B sahalarının koordinatlarını, karşılaştırma tablosunu ve canlı atlasta doğrudan açılış bağlantısını içeren bağımsız çevrimdışı dosya.',
    featured: true,
    buildContent: buildOfflineAtlasLauncherHtml,
  },
  {
    id: 'metrics-csv',
    title: 'Saha Karşılaştırma Veri Seti',
    formatLabel: 'CSV Tablo',
    filename: 'AstroApex-Saha-Karsilastirma.csv',
    mimeType: 'text/csv;charset=utf-8',
    description:
      'Excel ve Python/Pandas analizleri için Güneş, Dünya, ortak görüş ve batarya metriklerini içeren tablo.',
    buildContent: buildComparisonCsv,
  },
  {
    id: 'mission-json',
    title: 'Görev Konfigürasyon Manifestosu',
    formatLabel: 'JSON Veri',
    filename: 'AstroApex-Gorev-Paketi.json',
    mimeType: 'application/json;charset=utf-8',
    description:
      'LOLA profil parametrelerini, güç bütçesini ve aktif senaryo koordinatlarını saklayan makine okunabilir yapı.',
    buildContent: buildMissionConfigJson,
  },
  {
    id: 'brief-md',
    title: 'Teknik Görev Brifingi',
    formatLabel: 'Markdown Rapor',
    filename: 'AstroApex-Teknik-Brifing.md',
    mimeType: 'text/markdown;charset=utf-8',
    description:
      'Sunumlar ve mühendislik incelemeleri için özetlenmiş karar raporu ve ekip listesi.',
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
