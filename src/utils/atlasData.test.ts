import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAstroApexUrl,
  compareMissionScenarios,
  CONTRIBUTORS,
  DEFAULT_ATLAS_URL,
  DEFAULT_MISSION_CONFIG,
  LUNAR_SITES,
} from './atlasData';
import {
  buildComparisonCsv,
  buildMissionConfigJson,
  buildOfflineAtlasLauncherHtml,
  buildTechnicalBriefMarkdown,
} from './downloads';
import { LANGUAGES, TRANSLATIONS } from './i18n';

test('buildAstroApexUrl reproduces exact default hash format for Ridge vs Malapert', () => {
  const url = buildAstroApexUrl({
    ...DEFAULT_MISSION_CONFIG,
    lang: 'en',
  });
  assert.equal(url, DEFAULT_ATLAS_URL);
});

test('compareMissionScenarios computes consistent positive metrics and respects duration scaling', () => {
  const r14 = compareMissionScenarios(DEFAULT_MISSION_CONFIG);
  const r28 = compareMissionScenarios({
    ...DEFAULT_MISSION_CONFIG,
    durationDays: 28,
  });

  assert.ok(r14.siteA.sunHours > 0);
  assert.ok(r14.siteB.earthHours > r14.siteA.earthHours);
  assert.ok(r28.siteA.sunHours > r14.siteA.sunHours);
  assert.ok(r14.siteA.minBatteryPct >= 5 && r14.siteA.minBatteryPct <= 98);
});

test('all 5 requested contributors are registered as plain names without subtext', () => {
  assert.deepEqual(CONTRIBUTORS, [
    'Atahan Karayel',
    'Burak Karabay',
    'Ferman Ali Aslan',
    'Melih Oğuz',
    'Bora Sancak',
  ]);
});

test('20 languages including Turkish are completely translated with zero missing keys', () => {
  assert.equal(LANGUAGES.length, 20);
  assert.ok(LANGUAGES.some((l) => l.code === 'tr'));

  const baseKeys = Object.keys(TRANSLATIONS.tr) as (keyof typeof TRANSLATIONS.tr)[];
  for (const lang of LANGUAGES) {
    const bundle = TRANSLATIONS[lang.code];
    assert.ok(bundle, `Missing bundle for ${lang.code}`);
    for (const key of baseKeys) {
      const val = bundle[key];
      if (Array.isArray(val)) {
        assert.equal(val.length, 3, `${lang.code}.${key} must have 3 bullets`);
        assert.ok(val.every((item) => typeof item === 'string' && item.trim().length > 0));
      } else {
        assert.ok(typeof val === 'string' && val.trim().length > 0, `Empty translation ${lang.code}.${key}`);
      }
    }
  }
});

test('download builders produce valid CSV, JSON, Markdown, and standalone HTML artifacts', () => {
  const cfg = {
    ...DEFAULT_MISSION_CONFIG,
    siteA: LUNAR_SITES.ridge,
    siteB: LUNAR_SITES.malapert,
  };
  const comp = compareMissionScenarios(cfg);

  const csv = buildComparisonCsv(cfg, comp);
  assert.ok(csv.includes('Connecting Ridge'));
  assert.ok(csv.includes('Malapert Massif'));

  const json = JSON.parse(buildMissionConfigJson(cfg, comp));
  assert.equal(json.school, 'Sınav İncek Fen Lisesi');
  assert.equal(json.contributors.length, 5);

  const md = buildTechnicalBriefMarkdown(cfg, comp, TRANSLATIONS.tr);
  assert.ok(md.includes('Sınav İncek Fen Lisesi'));

  const html = buildOfflineAtlasLauncherHtml(cfg, comp, TRANSLATIONS.tr);
  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.includes(comp.atlasUrl.replace(/&/g, '&amp;')));
});
