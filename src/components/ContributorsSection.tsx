import { CONTRIBUTORS } from '../utils/atlasData';

export function ContributorsSection() {
  return (
    <section
      id="emegi-gecenler"
      className="mx-auto max-w-[1200px] border-t border-[#272C36] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium tracking-wider uppercase text-[#949AA8]">
            Proje Ekibi
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[#ECE8DE] sm:text-3xl">
            Emeği Geçenler
          </h2>
        </div>
        <p className="max-w-md text-sm text-[#949AA8]">
          AstroApex atlasının tasarım, yörünge hesaplama, güç modelleme ve yayın
          süreçlerine katkı sağlayan ekip üyeleri.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {CONTRIBUTORS.map((member, index) => (
          <article
            key={member.name}
            className={`flex flex-col justify-between rounded-xl border border-[#272C36] bg-[#12151A] p-6 ${
              index < 3 ? 'lg:col-span-2' : 'lg:col-span-3'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#949AA8]">
                <span className="font-mono-tabular">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{member.role}</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold text-[#ECE8DE]">
                {member.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#949AA8]">
                {member.focus}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
