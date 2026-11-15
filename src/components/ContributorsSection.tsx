import { CONTRIBUTORS } from '../utils/atlasData';
import type { TranslationBundle } from '../utils/i18n';

interface ContributorsSectionProps {
  t: TranslationBundle;
}

export function ContributorsSection({ t }: ContributorsSectionProps) {
  return (
    <section
      id="emegi-gecenler"
      className="mx-auto max-w-[1200px] border-t border-[#272C36] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium tracking-wider uppercase text-[#949AA8]">
            {t.contribKicker}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#ECE8DE] sm:text-3xl">
            {t.contribTitle}
          </h2>
        </div>
        <p className="text-sm text-[#949AA8]">{t.contribLead}</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {CONTRIBUTORS.map((name, index) => (
          <article
            key={name}
            className={`flex items-center justify-between rounded-xl border border-[#272C36] bg-[#12151A] px-6 py-6 ${
              index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
            }`}
          >
            <h3 className="font-display text-xl font-semibold text-[#ECE8DE]">
              {name}
            </h3>
            <span className="font-mono-tabular text-xs text-[#949AA8]">
              {String(index + 1).padStart(2, '0')}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
