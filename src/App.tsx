import { useEffect, useMemo, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { ContributorsSection } from './components/ContributorsSection';
import { DownloadSection } from './components/DownloadSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { ModulesSection } from './components/ModulesSection';
import { Navbar } from './components/Navbar';
import {
  compareMissionScenarios,
  DEFAULT_MISSION_CONFIG,
  type MissionConfig,
} from './utils/atlasData';
import { LANGUAGES, TRANSLATIONS, type LangCode } from './utils/i18n';

export default function App() {
  const [lang, setLang] = useState<LangCode>('tr');
  const [config, setConfig] = useState<MissionConfig>(DEFAULT_MISSION_CONFIG);

  const t = TRANSLATIONS[lang];
  const langMeta = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = langMeta.dir;
    document.title = t.pageTitle;
  }, [lang, langMeta.dir, t.pageTitle]);

  const handleChangeLang = (nextLang: LangCode) => {
    setLang(nextLang);
    const nextMeta = LANGUAGES.find((l) => l.code === nextLang) ?? LANGUAGES[0];
    setConfig((prev) => ({
      ...prev,
      lang: nextMeta.atlasLang,
    }));
  };

  const comparison = useMemo(() => compareMissionScenarios(config), [config]);

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-[#ECE8DE]">
      <Navbar atlasUrl={comparison.atlasUrl} t={t} />
      <main>
        <HeroSection
          config={config}
          comparison={comparison}
          lang={lang}
          onChangeLang={handleChangeLang}
          t={t}
        />
        <ModulesSection
          config={config}
          comparison={comparison}
          onUpdateConfig={setConfig}
          t={t}
        />
        <DownloadSection config={config} comparison={comparison} t={t} />
        <AboutSection t={t} />
        <ContributorsSection t={t} />
      </main>
      <Footer
        atlasUrl={comparison.atlasUrl}
        lang={lang}
        onChangeLang={handleChangeLang}
        t={t}
      />
    </div>
  );
}
