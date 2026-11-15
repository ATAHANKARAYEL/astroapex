import { CONTRIBUTORS } from '../utils/atlasData';
import { LANGUAGES, type LangCode, type TranslationBundle } from '../utils/i18n';

interface FooterProps {
  atlasUrl: string;
  lang: LangCode;
  onChangeLang: (lang: LangCode) => void;
  t: TranslationBundle;
}

export function Footer({ atlasUrl, lang, onChangeLang, t }: FooterProps) {
  return (
    <footer className="border-t border-[#272C36] bg-[#0A0C0F]">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <span className="font-display text-base font-semibold text-[#ECE8DE]">
            AstroApex
          </span>
          <p className="mt-1 text-xs text-[#949AA8]">
            {t.footerSubtitle} · {CONTRIBUTORS.join(', ')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-[#949AA8]">
          <a href="#genel-bakis" className="hover:text-[#ECE8DE]">
            {t.navOverview}
          </a>
          <a href="#moduller" className="hover:text-[#ECE8DE]">
            {t.navModules}
          </a>
          <a href="#indir" className="hover:text-[#ECE8DE]">
            {t.navDownload}
          </a>
          <a href="#biz-kimiz" className="hover:text-[#ECE8DE]">
            {t.navAbout}
          </a>
          <a
            href={atlasUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#ECE8DE] hover:underline"
          >
            {t.footerLiveAtlas}
          </a>
          <label className="inline-flex items-center gap-1.5 rounded-md border border-[#272C36] bg-[#12151A] px-2 py-1 text-xs text-[#ECE8DE]">
            <span className="sr-only">{t.languageLabel}</span>
            <select
              aria-label={`${t.languageLabel} (footer)`}
              value={lang}
              onChange={(e) => onChangeLang(e.target.value as LangCode)}
              className="bg-transparent text-xs text-[#ECE8DE] focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((opt) => (
                <option key={opt.code} value={opt.code} className="bg-[#12151A] text-[#ECE8DE]">
                  {opt.nativeName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </footer>
  );
}
