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
  assert.ok(r14.siteB.earthHours > r14.siteA.earthHours, 'Malapert near 0 lon should have higher Earth visibility');
  assert.ok(r28.siteA.sunHours > r14.siteA.sunHours);
  assert.ok(r14.siteA.minBatteryPct >= 5 && r14.siteA.minBatteryPct <= 98);
});

test('all 5 requested contributors are registered accurately', () => {
  const names = CONTRIBUTORS.map((c) => c.name);
  assert.deepEqual(names, [
    'Atahan Karayel',
    'Burak Karabay',
    'Ferman Ali Aslan',
    'Melih Oğuz',
    'Bora Sancak',
  ]);
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
  assert.equal(json.scenarios.A.site.id, 'ridge');
  assert.equal(json.contributors.length, 5);

  const md = buildTechnicalBriefMarkdown(cfg, comp);
  assert.ok(md.includes('AstroApex Teknik Görev Brifingi'));

  const html = buildOfflineAtlasLauncherHtml(cfg, comp);
  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.includes(comp.atlasUrl.replace(/&/g, '&amp;')));
});
