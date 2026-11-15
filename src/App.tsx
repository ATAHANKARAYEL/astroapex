import { useMemo, useState } from 'react';
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

export default function App() {
  const [config, setConfig] = useState<MissionConfig>(DEFAULT_MISSION_CONFIG);

  const comparison = useMemo(() => compareMissionScenarios(config), [config]);

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-[#ECE8DE]">
      <Navbar atlasUrl={comparison.atlasUrl} />
      <main>
        <HeroSection config={config} comparison={comparison} />
        <ModulesSection
          config={config}
          comparison={comparison}
          onUpdateConfig={setConfig}
        />
        <DownloadSection config={config} comparison={comparison} />
        <AboutSection />
        <ContributorsSection />
      </main>
      <Footer atlasUrl={comparison.atlasUrl} />
    </div>
  );
}
