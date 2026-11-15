import { useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import moduleLunarGlobeImg from '../assets/images/module_lunar_globe_1794743853931.jpg';
import {
  LUNAR_SITES,
  MISSION_PRESETS,
  type ComparisonResult,
  type MissionConfig,
  type SiteMetrics,
} from '../utils/atlasData';
import type { TranslationBundle } from '../utils/i18n';

interface ModulesSectionProps {
  config: MissionConfig;
  comparison: ComparisonResult;
  onUpdateConfig: (updater: (prev: MissionConfig) => MissionConfig) => void;
  t: TranslationBundle;
}

type ModuleId = 'compare' | 'sky' | 'time' | 'map';

export function ModulesSection({
  config,
  comparison,
  onUpdateConfig,
  t,
}: ModulesSectionProps) {
  const [activeTabId, setActiveTabId] = useState<ModuleId>('compare');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [imgError, setImgError] = useState(false);

  const moduleTabs = [
    {
      id: 'compare' as const,
      indexLabel: t.tab1Label,
      title: t.tab1Title,
      lead: t.tab1Lead,
      bullets: t.tab1Bullets,
      metricValue: t.tab1Metric,
    },
    {
      id: 'sky' as const,
      indexLabel: t.tab2Label,
      title: t.tab2Title,
      lead: t.tab2Lead,
      bullets: t.tab2Bullets,
      metricValue: t.tab2Metric,
    },
    {
      id: 'time' as const,
      indexLabel: t.tab3Label,
      title: t.tab3Title,
      lead: t.tab3Lead,
      bullets: t.tab3Bullets,
      metricValue: t.tab3Metric,
    },
    {
      id: 'map' as const,
      indexLabel: t.tab4Label,
      title: t.tab4Title,
      lead: t.tab4Lead,
      bullets: t.tab4Bullets,
      metricValue: t.tab4Metric,
    },
  ];

  const activeModule =
    moduleTabs.find((tab) => tab.id === activeTabId) ?? moduleTabs[0];

  const totalHours = config.durationDays * 24;

  const handlePresetSelect = (presetId: string) => {
    const preset = MISSION_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onUpdateConfig((prev) => ({
      ...prev,
      presetId: preset.id,
      siteA: LUNAR_SITES[preset.siteAId],
      siteB: LUNAR_SITES[preset.siteBId],
      startUtc: preset.startUtc,
      durationDays: preset.durationDays,
    }));
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(comparison.atlasUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(false);
    }
  };

  const getRatingText = (key: SiteMetrics['powerRatingKey']) => {
    if (key === 'strong') return t.ratingStrong;
    if (key === 'limited') return t.ratingLimited;
    return t.ratingWeak;
  };

  const maxBothWinnerLabel =
    comparison.winner === 'equal'
      ? t.verdictEqual
      : `${
          comparison.winner === 'A' ? config.siteA.name : config.siteB.name
        } — ${t.verdictMoreSuffix} +${comparison.bothDeltaHours} ${t.hoursUnit}`;

  return (
    <section
      id="moduller"
      className="mx-auto max-w-[1200px] border-t border-[#272C36] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium tracking-wider uppercase text-[#949AA8]">
            {t.modulesKicker}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#ECE8DE] sm:text-3xl [text-wrap:balance]">
            {t.modulesTitle}
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-[#949AA8]">
          {t.modulesLead}
        </p>
      </div>

      {/* Module Selector Tabs */}
      <div
        role="tablist"
        aria-label={t.modulesTitle}
        className="mt-8 grid grid-cols-1 gap-2 rounded-xl border border-[#272C36] bg-[#12151A] p-1.5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {moduleTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActiveTabId(tab.id)}
              className={`rounded-lg px-4 py-2.5 text-start text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                isActive
                  ? 'bg-[#ECE8DE] text-[#0A0C0F]'
                  : 'text-[#949AA8] hover:bg-[#191D24] hover:text-[#ECE8DE]'
              }`}
            >
              {tab.indexLabel}
            </button>
          );
        })}
      </div>

      {/* Active Module Detail Split */}
      <div className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        <div className="flex flex-col justify-between rounded-xl border border-[#272C36] bg-[#12151A] p-6 sm:p-8 lg:col-span-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#949AA8]">
              <span>{activeModule.indexLabel}</span>
              <span className="font-mono-tabular text-[#5AA9FF]">
                {activeModule.metricValue}
              </span>
            </div>

            <h3 className="mt-3 font-display text-2xl font-semibold text-[#ECE8DE]">
              {activeModule.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#949AA8]">
              {activeModule.lead}
            </p>

            <ul className="mt-6 space-y-3 border-t border-[#272C36] pt-5">
              {activeModule.bullets.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-[#ECE8DE]/90"
                >
                  <span className="font-mono-tabular text-[#949AA8]" aria-hidden="true">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={comparison.atlasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-[#363D4A] bg-[#191D24] px-4 py-2.5 text-xs font-semibold text-[#ECE8DE] whitespace-nowrap transition-colors hover:border-[#ECE8DE]"
            >
              <span>{t.viewInLiveAtlas}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#272C36] bg-[#12151A] lg:col-span-5">
          {!imgError ? (
            <img
              src={moduleLunarGlobeImg}
              alt="Lunar South Pole LOLA topographic relief map"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full min-h-[260px] w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[260px] items-center justify-center bg-[#191D24] p-6 text-sm text-[#949AA8]">
              LOLA Topographic Relief
            </div>
          )}
        </div>
      </div>

      {/* Interactive Scenario & Power Preview Console */}
      <div className="mt-10 rounded-xl border border-[#272C36] bg-[#12151A] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#272C36] pb-6 lg:flex-row lg:items-center">
          <div>
            <h3 className="font-display text-xl font-semibold text-[#ECE8DE]">
              {t.simTitle}
            </h3>
            <p className="mt-1 text-sm text-[#949AA8]">
              {t.simLead}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleCopyUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#363D4A] bg-[#191D24] px-3.5 py-2 text-xs font-medium text-[#ECE8DE] whitespace-nowrap transition-colors hover:border-[#ECE8DE]"
            >
              {copiedUrl ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#57D9A3]" aria-hidden="true" />
                  <span>{t.copiedLink}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.copyLink}</span>
                </>
              )}
            </button>
            <a
              href={comparison.atlasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#ECE8DE] px-4 py-2 text-xs font-semibold text-[#0A0C0F] whitespace-nowrap transition-colors hover:bg-white"
            >
              <span>{t.openSelectedScenario}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Preset & Parameter Controls */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <div>
              <span className="block text-xs font-medium text-[#949AA8]">
                {t.presetsLabel}
              </span>
              <div className="mt-2 flex flex-col gap-2">
                {MISSION_PRESETS.map((preset) => {
                  const selected = config.presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`flex items-center justify-between rounded-lg border px-3.5 py-2.5 text-start text-sm transition-colors ${
                        selected
                          ? 'border-[#ECE8DE] bg-[#191D24] text-[#ECE8DE]'
                          : 'border-[#272C36] bg-[#0A0C0F]/60 text-[#949AA8] hover:border-[#363D4A] hover:text-[#ECE8DE]'
                      }`}
                    >
                      <span className="font-medium">{preset.label}</span>
                      <span className="font-mono-tabular text-xs opacity-80">
                        {preset.durationDays}d
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#949AA8]">{t.durationLabel}</span>
                <select
                  value={config.durationDays}
                  onChange={(e) =>
                    onUpdateConfig((prev) => ({
                      ...prev,
                      durationDays: Number(e.target.value),
                    }))
                  }
                  className="rounded-lg border border-[#363D4A] bg-[#191D24] px-3 py-2 font-mono-tabular text-sm text-[#ECE8DE] focus:border-[#5AA9FF] focus:outline-none"
                >
                  <option value={7}>7 {t.daysUnit}</option>
                  <option value={14}>14 {t.daysUnit}</option>
                  <option value={21}>21 {t.daysUnit}</option>
                  <option value={28}>28 {t.daysUnit} {t.lunarDaySuffix}</option>
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#949AA8]">{t.loadLabel}</span>
                <input
                  type="number"
                  min={20}
                  max={2000}
                  step={10}
                  value={config.loadWatts}
                  onChange={(e) =>
                    onUpdateConfig((prev) => ({
                      ...prev,
                      loadWatts: Math.max(20, Number(e.target.value) || 200),
                    }))
                  }
                  className="rounded-lg border border-[#363D4A] bg-[#191D24] px-3 py-2 font-mono-tabular text-sm text-[#ECE8DE] focus:border-[#5AA9FF] focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#949AA8]">{t.batteryLabel}</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  step={1}
                  value={config.batteryKwh}
                  onChange={(e) =>
                    onUpdateConfig((prev) => ({
                      ...prev,
                      batteryKwh: Math.max(1, Number(e.target.value) || 10),
                    }))
                  }
                  className="rounded-lg border border-[#363D4A] bg-[#191D24] px-3 py-2 font-mono-tabular text-sm text-[#ECE8DE] focus:border-[#5AA9FF] focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs text-[#949AA8]">{t.solarAreaLabel}</span>
                <input
                  type="number"
                  min={0.5}
                  max={50}
                  step={0.5}
                  value={config.solarAreaM2}
                  onChange={(e) =>
                    onUpdateConfig((prev) => ({
                      ...prev,
                      solarAreaM2: Math.max(0.5, Number(e.target.value) || 2),
                    }))
                  }
                  className="rounded-lg border border-[#363D4A] bg-[#191D24] px-3 py-2 font-mono-tabular text-sm text-[#ECE8DE] focus:border-[#5AA9FF] focus:outline-none"
                />
              </label>
            </div>
          </div>

          {/* Comparative Output Panel */}
          <div className="flex flex-col justify-between rounded-xl border border-[#272C36] bg-[#0A0C0F]/80 p-5 lg:col-span-7">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium text-[#949AA8]">
                  {t.verdictLabel}
                </span>
                <span className="font-mono-tabular text-xs text-[#57D9A3]">
                  {t.totalWindowLabel}: {totalHours} {t.hoursUnit}
                </span>
              </div>
              <p className="mt-1.5 font-display text-lg font-semibold text-[#ECE8DE]">
                {maxBothWinnerLabel}
              </p>

              <div className="mt-5 space-y-4">
                {[
                  {
                    label: `A · ${config.siteA.name}`,
                    metrics: comparison.siteA,
                  },
                  {
                    label: `B · ${config.siteB.name}`,
                    metrics: comparison.siteB,
                  },
                ].map((row) => {
                  const sunPct = Math.round((row.metrics.sunHours / totalHours) * 100);
                  const earthPct = Math.round((row.metrics.earthHours / totalHours) * 100);
                  const bothPct = Math.round((row.metrics.bothHours / totalHours) * 100);
                  return (
                    <div key={row.label} className="space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-[#ECE8DE]">{row.label}</span>
                        <span className="font-mono-tabular text-[#949AA8]">
                          {t.sunWord} {row.metrics.sunHours} {t.hoursUnit} · {t.earthWord}{' '}
                          {row.metrics.earthHours} {t.hoursUnit} · {t.bothWord}{' '}
                          <strong className="text-[#57D9A3]">
                            {row.metrics.bothHours} {t.hoursUnit}
                          </strong>
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-2 overflow-hidden rounded-full bg-[#191D24]" title={`${t.sunWord} %${sunPct}`}>
                          <div
                            className="h-full rounded-full bg-[#FFB648]"
                            style={{ width: `${Math.min(100, sunPct)}%` }}
                          />
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#191D24]" title={`${t.earthWord} %${earthPct}`}>
                          <div
                            className="h-full rounded-full bg-[#5AA9FF]"
                            style={{ width: `${Math.min(100, earthPct)}%` }}
                          />
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#191D24]" title={`${t.bothWord} %${bothPct}`}>
                          <div
                            className="h-full rounded-full bg-[#57D9A3]"
                            style={{ width: `${Math.min(100, bothPct)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 overflow-x-auto border-t border-[#272C36] pt-4">
              <table className="w-full text-start text-xs tabular-nums">
                <thead>
                  <tr className="text-[#949AA8]">
                    <th className="py-1.5 text-start font-medium">{t.metricCol}</th>
                    <th className="py-1.5 text-start font-medium">{config.siteA.name}</th>
                    <th className="py-1.5 text-start font-medium">{config.siteB.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#272C36]/60 font-mono-tabular text-[#ECE8DE]">
                  <tr>
                    <td className="py-2 font-sans text-[#949AA8]">{t.metricDark}</td>
                    <td className="py-2">{comparison.siteA.longestDarkHours} {t.hoursUnit}</td>
                    <td className="py-2">{comparison.siteB.longestDarkHours} {t.hoursUnit}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-[#949AA8]">{t.metricCommGap}</td>
                    <td className="py-2">{comparison.siteA.longestCommGapHours} {t.hoursUnit}</td>
                    <td className="py-2">{comparison.siteB.longestCommGapHours} {t.hoursUnit}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-[#949AA8]">{t.metricEnergy}</td>
                    <td className="py-2">{comparison.siteA.energyYieldKwhPerM2} kWh/m²</td>
                    <td className="py-2">{comparison.siteB.energyYieldKwhPerM2} kWh/m²</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-sans text-[#949AA8]">{t.metricBattery}</td>
                    <td className="py-2">%{comparison.siteA.minBatteryPct} ({getRatingText(comparison.siteA.powerRatingKey)})</td>
                    <td className="py-2">%{comparison.siteB.minBatteryPct} ({getRatingText(comparison.siteB.powerRatingKey)})</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
