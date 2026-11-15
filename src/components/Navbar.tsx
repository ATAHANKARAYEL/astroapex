import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  atlasUrl: string;
}

const NAV_ITEMS = [
  { href: '#genel-bakis', label: 'Genel Bakış' },
  { href: '#moduller', label: 'Modüller' },
  { href: '#indir', label: 'İndir' },
  { href: '#biz-kimiz', label: 'Biz Kimiz' },
  { href: '#emegi-gecenler', label: 'Emeği Geçenler' },
];

export function Navbar({ atlasUrl }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[#272C36] bg-[#0A0C0F]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-8 px-4 py-3.5 sm:px-6 lg:px-8">
        <a
          href="#genel-bakis"
          className="font-display text-lg font-semibold tracking-tight text-[#ECE8DE] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AA9FF]"
        >
          AstroApex
        </a>

        <nav
          aria-label="Ana gezinme"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#949AA8]"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#ECE8DE] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5AA9FF]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={atlasUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#ECE8DE] px-4 py-2 text-xs font-semibold text-[#0A0C0F] whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5AA9FF]"
          >
            Atlası Aç
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-[#363D4A] bg-[#12151A] p-2 text-[#ECE8DE] transition-colors hover:border-[#ECE8DE]"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobil gezinme"
          className="md:hidden border-t border-[#272C36] bg-[#12151A] px-4 py-3"
        >
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#ECE8DE] transition-colors hover:bg-[#191D24]"
              >
                {item.label}
              </a>
            ))}
            <a
              href={atlasUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="mt-1 inline-flex items-center justify-center rounded-lg bg-[#ECE8DE] px-4 py-2.5 text-sm font-semibold text-[#0A0C0F]"
            >
              Atlası Aç
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
