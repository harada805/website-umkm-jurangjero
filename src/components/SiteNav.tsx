"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Store, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#profil", label: "Profil" },
  { href: "#data", label: "Data" },
  { href: "#umkm", label: "UMKM" },
  { href: "#peta", label: "Peta" },
  { href: "#wisata", label: "Potensi" },
  { href: "#berita", label: "Berita" }
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-[8px] border border-white/55 bg-white/88 px-4 py-3 shadow-line backdrop-blur-xl">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white p-1 shadow-[inset_0_0_0_1px_rgba(68,64,60,0.18)]">
            <Image
              src="/images/logo-jurangjero.png"
              alt="Logo Jurangjero"
              width={42}
              height={52}
              priority
              className="max-h-full w-auto object-contain"
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-heading text-sm font-bold text-stonewarm-950 sm:text-base">
              Jurang Jero Digital
            </span>
            <span className="block truncate text-xs font-medium text-stonewarm-700">
              Ngawen, Gunungkidul
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[8px] px-3 py-2 text-sm font-semibold text-stonewarm-700 transition hover:bg-leaf-100 hover:text-leaf-800"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="#umkm"
            className="inline-flex items-center gap-2 rounded-[8px] bg-leaf-800 px-4 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-leaf-700"
          >
            <Store size={17} />
            Jelajahi UMKM
          </a>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-[8px] border border-stonewarm-200 text-leaf-800 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Buka navigasi"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={cn(
          "mx-auto mt-2 max-w-7xl overflow-hidden rounded-[8px] border border-white/70 bg-white/95 shadow-soft transition-all lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 border-transparent opacity-0"
        )}
      >
        <div className="grid gap-1 p-3">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[8px] px-3 py-3 text-sm font-semibold text-stonewarm-700 hover:bg-leaf-100"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#umkm"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-4 py-3 text-sm font-bold text-white"
            onClick={() => setOpen(false)}
          >
            <Store size={17} />
            Jelajahi UMKM
          </a>
        </div>
      </div>
    </header>
  );
}
