import { useState } from 'react';
import { ArrowUpRight, Download, Globe } from 'lucide-react';
import heroLunarImg from '../assets/images/hero_lunar_south_pole_1794743853868.jpg';
import type { ComparisonResult, MissionConfig } from '../utils/atlasData';
import { LANGUAGES, type LangCode, type TranslationBundle } from '../utils/i18n';

interface HeroSectionProps {
  config: MissionConfig;
  comparison: ComparisonResult;
  lang: LangCode;
  onChangeLang: (lang: LangCode) => void;
  t: TranslationBundle;
}

export function HeroSection({
  config,
  comparison,
  lang,
  onChangeLang,
  t,
}: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="genel-bakis"
      className="mx-auto max-w-[1200px] px-4 pt-10 pb-14 sm:px-6 lg:px-8 lg:pt-14 lg:pb-20"
    >
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col justify-between lg:col-span-6 py-2">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-medium tracking-wider uppercase text-[#949AA8]">
                {t.heroKicker}
              </p>

              <label className="inline-flex items-center gap-2 rounded-lg border border-[#272C36] bg-[#12151A] px-2.5 py-1.5 text-xs text-[#949AA8]">
                <Globe className="h-3.5 w-3.5 text-[#5AA9FF]" aria-hidden="true" />
                <span className="sr-only">{t.languageLabel}</span>
                <select
                  aria-label={t.languageLabel}
                  value={lang}
                  onChange={(e) => onChangeLang(e.target.value as LangCode)}
                  className="bg-transparent text-xs font-medium text-[#ECE8DE] focus:outline-none cursor-pointer"
                >
                  {LANGUAGES.map((opt) => (
                    <option key={opt.code} value={opt.code} className="bg-[#12151A] text-[#ECE8DE]">
                      {opt.nativeName}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <h1 className="mt-4 font-display text-[clamp(2.25rem,4.1vw,3.45rem)] font-semibold leading-[1.08] tracking-tight text-[#ECE8DE] [text-wrap:balance]">
              {t.heroTitle}
            </h1>
            <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-[#949AA8]">
              {t.heroLead}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href={comparison.atlasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#ECE8DE] px-6 py-3 text-sm font-semibold text-[#0A0C0F] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AA9FF]"
            >
              <span>{t.heroPrimaryCta}</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href="#indir"
              className="inline-flex items-center gap-2 rounded-lg border border-[#363D4A] bg-[#12151A] px-6 py-3 text-sm font-semibold text-[#ECE8DE] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#ECE8DE] hover:bg-[#191D24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AA9FF]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              <span>{t.heroSecondaryCta}</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative h-full min-h-[300px] overflow-hidden rounded-xl border border-[#272C36] bg-[#12151A]">
            {!imgError ? (
              <img
                src={heroLunarImg}
                alt="Lunar South Pole terrain and Earth above the horizon"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[300px] w-full items-center justify-center bg-gradient-to-br from-[#191D24] via-[#12151A] to-[#0A0C0F] p-8 text-center">
                <p className="text-sm text-[#949AA8]">
                  Connecting Ridge · Malapert Massif
                </p>
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0A0C0F]/95 via-[#0A0C0F]/55 to-transparent px-5 pt-12 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#ECE8DE]/90">
                <span className="font-medium">
                  {config.siteA.name} · {config.siteB.name}
                </span>
                <span className="font-mono-tabular text-[#949AA8]">
                  {t.heroCaptionPrefix} · {config.startUtc.replace('T', ' ')} UTC
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Telemetry Strip */}
      <div className="mt-8 grid grid-cols-1 divide-y divide-[#272C36] rounded-xl border border-[#272C36] bg-[#12151A] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
        <div className="p-5">
          <p className="text-xs font-medium text-[#949AA8]">{t.scenarioALabel}</p>
          <p className="mt-1.5 font-display text-lg font-semibold text-[#ECE8DE]">
            {config.siteA.name}
          </p>
          <p className="mt-1 font-mono-tabular text-xs text-[#FFB648]">
            {config.siteA.lat.toFixed(4)}° · {config.siteA.lon.toFixed(4)}°
          </p>
        </div>

        <div className="p-5 border-t border-[#272C36] sm:border-t-0 sm:border-l lg:border-l-0">
          <p className="text-xs font-medium text-[#949AA8]">{t.scenarioBLabel}</p>
          <p className="mt-1.5 font-display text-lg font-semibold text-[#ECE8DE]">
            {config.siteB.name}
          </p>
          <p className="mt-1 font-mono-tabular text-xs text-[#FF7AB8]">
            {config.siteB.lat.toFixed(4)}° · {config.siteB.lon.toFixed(5)}°
          </p>
        </div>

        <div className="p-5 border-t border-[#272C36] lg:border-t-0">
          <p className="text-xs font-medium text-[#949AA8]">{t.missionWindowLabel}</p>
          <p className="mt-1.5 font-mono-tabular text-lg font-semibold text-[#ECE8DE]">
            {config.durationDays} {t.daysUnit}
          </p>
          <p className="mt-1 font-mono-tabular text-xs text-[#5AA9FF]">
            {config.startUtc.split('T')[0]} · UTC 00:00
          </p>
        </div>

        <div className="p-5 border-t border-[#272C36] sm:border-l lg:border-t-0 lg:border-l-0">
          <p className="text-xs font-medium text-[#949AA8]">{t.powerBudgetLabel}</p>
          <p className="mt-1.5 font-mono-tabular text-lg font-semibold text-[#ECE8DE]">
            {config.loadWatts} W · {config.batteryKwh} kWh
          </p>
          <p className="mt-1 font-mono-tabular text-xs text-[#57D9A3]">
            {config.solarAreaM2} m² {t.panelSuffix}
          </p>
        </div>
      </div>
    </section>
  );
}
