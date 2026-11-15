import { useState } from 'react';
import { Check, Download, FileCode2, FileSpreadsheet, FileText } from 'lucide-react';
import type { ComparisonResult, MissionConfig } from '../utils/atlasData';
import {
  DOWNLOAD_ARTIFACTS,
  formatByteSize,
  triggerFileDownload,
  type DownloadArtifact,
} from '../utils/downloads';
import type { TranslationBundle } from '../utils/i18n';

interface DownloadSectionProps {
  config: MissionConfig;
  comparison: ComparisonResult;
  t: TranslationBundle;
}

export function DownloadSection({ config, comparison, t }: DownloadSectionProps) {
  const [downloadedIds, setDownloadedIds] = useState<Record<string, string>>({});

  const handleDownload = (artifact: DownloadArtifact) => {
    const content = artifact.buildContent(config, comparison, t);
    triggerFileDownload(artifact.filename, content, artifact.mimeType);
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setDownloadedIds((prev) => ({
      ...prev,
      [artifact.id]: nowTime,
    }));
  };

  const handleDownloadAll = () => {
    DOWNLOAD_ARTIFACTS.forEach((artifact, idx) => {
      setTimeout(() => {
        handleDownload(artifact);
      }, idx * 140);
    });
  };

  const featuredArtifact = DOWNLOAD_ARTIFACTS.find((a) => a.featured) ?? DOWNLOAD_ARTIFACTS[0];
  const secondaryArtifacts = DOWNLOAD_ARTIFACTS.filter((a) => a.id !== featuredArtifact.id);

  const featuredContent = featuredArtifact.buildContent(config, comparison, t);
  const featuredSize = formatByteSize(featuredContent);

  const getIcon = (id: string) => {
    if (id === 'metrics-csv') return FileSpreadsheet;
    if (id === 'mission-json') return FileCode2;
    return FileText;
  };

  return (
    <section
      id="indir"
      className="mx-auto max-w-[1200px] border-t border-[#272C36] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium tracking-wider uppercase text-[#949AA8]">
            {t.downloadKicker}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#ECE8DE] sm:text-3xl [text-wrap:balance]">
            {t.downloadTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#949AA8]">
            {t.downloadLeadPrefix} {config.siteA.name} ↔ {config.siteB.name} ·{' '}
            {config.durationDays} {t.daysUnit} · {config.loadWatts} W
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadAll}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#363D4A] bg-[#12151A] px-5 py-2.5 text-sm font-semibold text-[#ECE8DE] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#ECE8DE] hover:bg-[#191D24]"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>{t.downloadAllBtn}</span>
        </button>
      </div>

      {/* Primary Featured Download */}
      <div className="mt-8 flex flex-col justify-between gap-6 rounded-xl border border-[#363D4A] bg-[#12151A] p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#949AA8]">
            <span className="font-medium text-[#FFB648]">{t[featuredArtifact.formatKey]}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{featuredArtifact.filename}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">{featuredSize}</span>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold text-[#ECE8DE]">
            {t[featuredArtifact.titleKey]}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#949AA8]">
            {t[featuredArtifact.descKey]}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end shrink-0">
          <button
            type="button"
            onClick={() => handleDownload(featuredArtifact)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#ECE8DE] px-6 py-3 text-sm font-semibold text-[#0A0C0F] whitespace-nowrap transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AA9FF]"
          >
            {downloadedIds[featuredArtifact.id] ? (
              <>
                <Check className="h-4 w-4 text-[#0A0C0F]" aria-hidden="true" />
                <span>{t.redownloadBtn}</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" aria-hidden="true" />
                <span>{t.downloadAtlasBtn}</span>
              </>
            )}
          </button>

          {downloadedIds[featuredArtifact.id] && (
            <span className="font-mono-tabular text-xs text-[#57D9A3]">
              {t.downloadedAtPrefix} · {downloadedIds[featuredArtifact.id]}
            </span>
          )}
        </div>
      </div>

      {/* Secondary Data & Briefing Downloads */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {secondaryArtifacts.map((artifact) => {
          const Icon = getIcon(artifact.id);
          const content = artifact.buildContent(config, comparison, t);
          const sizeLabel = formatByteSize(content);
          const downloadedAt = downloadedIds[artifact.id];
          const title = t[artifact.titleKey];

          return (
            <article
              key={artifact.id}
              className="flex flex-col justify-between rounded-xl border border-[#272C36] bg-[#12151A] p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-[#949AA8]">
                  <span className="font-medium text-[#5AA9FF]">{t[artifact.formatKey]}</span>
                  <span className="font-mono-tabular">{sizeLabel}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold text-[#ECE8DE]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#949AA8]">
                  {t[artifact.descKey]}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#272C36] pt-4">
                <span className="truncate font-mono-tabular text-xs text-[#949AA8]">
                  {downloadedAt ? `${t.downloadedAtPrefix} · ${downloadedAt}` : artifact.filename}
                </span>

                <button
                  type="button"
                  onClick={() => handleDownload(artifact)}
                  aria-label={`${title} ${t.downloadBtn}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#363D4A] bg-[#191D24] px-3.5 py-2 text-xs font-semibold text-[#ECE8DE] whitespace-nowrap shrink-0 transition-colors hover:border-[#ECE8DE]"
                >
                  {downloadedAt ? (
                    <Check className="h-3.5 w-3.5 text-[#57D9A3]" aria-hidden="true" />
                  ) : (
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  <span>{t.downloadBtn}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
