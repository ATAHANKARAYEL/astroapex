interface FooterProps {
  atlasUrl: string;
}

export function Footer({ atlasUrl }: FooterProps) {
  return (
    <footer className="border-t border-[#272C36] bg-[#0A0C0F]">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-6 px-4 py-10 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <span className="font-display text-base font-semibold text-[#ECE8DE]">
            AstroApex
          </span>
          <p className="mt-1 text-xs text-[#949AA8]">
            Ay Güney Kutbu İniş Sahası Gezgini · Atahan Karayel, Burak Karabay,
            Ferman Ali Aslan, Melih Oğuz, Bora Sancak
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#949AA8]">
          <a href="#genel-bakis" className="hover:text-[#ECE8DE]">
            Genel Bakış
          </a>
          <a href="#moduller" className="hover:text-[#ECE8DE]">
            Modüller
          </a>
          <a href="#indir" className="hover:text-[#ECE8DE]">
            İndir
          </a>
          <a href="#biz-kimiz" className="hover:text-[#ECE8DE]">
            Biz Kimiz
          </a>
          <a
            href={atlasUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#ECE8DE] hover:underline"
          >
            Canlı Atlas
          </a>
        </div>
      </div>
    </footer>
  );
}
