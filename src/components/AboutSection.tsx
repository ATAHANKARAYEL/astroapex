import { useState } from 'react';
import teamMissionImg from '../assets/images/team_mission_control_1794743854608.jpg';

const TEAM_IMAGE_PATH = teamMissionImg;

export function AboutSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="biz-kimiz"
      className="mx-auto max-w-[1200px] border-t border-[#272C36] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <div className="h-full min-h-[280px] overflow-hidden rounded-xl border border-[#272C36] bg-[#12151A]">
            {!imgError ? (
              <img
                src={TEAM_IMAGE_PATH}
                alt="AstroApex mühendislik ekibinin ay topografyası ve yörünge eğrileri üzerinde çalışma ortamı"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center bg-[#191D24] p-6 text-sm text-[#949AA8]">
                AstroApex Görev Tasarım Ekibi
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between py-2 lg:col-span-6">
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-[#949AA8]">
              Biz Kimiz
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#ECE8DE] sm:text-3xl [text-wrap:balance]">
              Ay görev planlamasını herkes için erişilebilir kılan mühendislik ekibi
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#949AA8] sm:text-base">
              AstroApex ekibi olarak; karmaşık uzay mühendisliği verilerini, NASA LRO
              LOLA yükseklik profillerini ve efemeris hesaplamalarını ağır masaüstü
              yazılımlarına gerek kalmadan doğrudan tarayıcıda çalışan hızlı bir
              karar destek atlasına dönüştürüyoruz.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#949AA8] sm:text-base">
              Amacımız; araştırmacıların, öğrencilerin ve görev tasarımcılarının Ay’ın
              güney kutbundaki kritik iniş sahalarını güneşlenme, doğrudan Dünya
              iletişimi ve enerji sürdürülebilirliği açısından şeffaf biçimde
              karşılaştırabilmesini sağlamaktır.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-[#272C36] pt-6">
            <div>
              <p className="font-mono-tabular text-2xl font-semibold text-[#ECE8DE]">
                4
              </p>
              <p className="mt-1 text-xs text-[#949AA8]">Entegre Atlas Modülü</p>
            </div>
            <div>
              <p className="font-mono-tabular text-2xl font-semibold text-[#ECE8DE]">
                365 Gün
              </p>
              <p className="mt-1 text-xs text-[#949AA8]">Yıllık Pencere Taraması</p>
            </div>
            <div>
              <p className="font-mono-tabular text-2xl font-semibold text-[#ECE8DE]">
                LOLA
              </p>
              <p className="mt-1 text-xs text-[#949AA8]">Gerçek Ufuk Profili</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
