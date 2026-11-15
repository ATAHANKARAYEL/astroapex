import type { TranslationBundle } from '../utils/i18n';

interface AboutSectionProps {
  t: TranslationBundle;
}

export function AboutSection({ t }: AboutSectionProps) {
  return (
    <section
      id="biz-kimiz"
      className="mx-auto max-w-[1200px] border-t border-[#272C36] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="text-xs font-medium tracking-wider uppercase text-[#5AA9FF]">
            {t.aboutKicker} · {t.aboutSchool}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#ECE8DE] sm:text-3xl [text-wrap:balance]">
            {t.aboutTitle}
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[#949AA8] sm:text-base">
            {t.aboutP1}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#949AA8] sm:text-base">
            {t.aboutP2}
          </p>
        </div>

        <div className="grid grid-cols-1 divide-y divide-[#272C36] rounded-xl border border-[#272C36] bg-[#12151A] lg:col-span-5">
          <div className="flex items-baseline justify-between gap-4 p-6">
            <p className="text-sm text-[#949AA8]">{t.aboutStat1Label}</p>
            <p className="font-mono-tabular text-2xl font-semibold text-[#ECE8DE]">
              {t.aboutStat1Value}
            </p>
          </div>
          <div className="flex items-baseline justify-between gap-4 p-6">
            <p className="text-sm text-[#949AA8]">{t.aboutStat2Label}</p>
            <p className="font-mono-tabular text-2xl font-semibold text-[#ECE8DE]">
              {t.aboutStat2Value}
            </p>
          </div>
          <div className="flex items-baseline justify-between gap-4 p-6">
            <p className="text-sm text-[#949AA8]">{t.aboutStat3Label}</p>
            <p className="font-mono-tabular text-2xl font-semibold text-[#5AA9FF]">
              {t.aboutStat3Value}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
