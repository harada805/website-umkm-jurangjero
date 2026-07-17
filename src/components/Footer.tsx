import Image from "next/image";
import { MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stonewarm-950 px-5 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-white p-1">
              <Image
                src="/images/logo-jurangjero.png"
                alt="Logo Jurangjero"
                width={42}
                height={52}
                className="max-h-full w-auto object-contain"
              />
            </span>
            <div>
              <p className="font-heading text-lg font-bold">Jurang Jero Digital</p>
              <p className="text-sm text-white/65">Tradition Meets Digital Future</p>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/72">
            Platform desa untuk mengenalkan profil Jurangjero, memperkuat UMKM,
            membuka cerita padukuhan, dan memudahkan pengunjung menemukan potensi lokal.
          </p>
        </div>

        <div>
          <p className="font-bold">Ruang Publik</p>
          <div className="mt-4 grid gap-3 text-sm text-white/72">
            <a href="#umkm" className="hover:text-white">
              UMKM Marketplace
            </a>
            <a href="#peta" className="hover:text-white">
              Padukuhan Explorer
            </a>
            <a href="#berita" className="hover:text-white">
              Berita dan Acara
            </a>
          </div>
        </div>

        <div>
          <p className="font-bold">Akses Desa</p>
          <div className="mt-4 grid gap-3 text-sm text-white/72">
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 shrink-0" size={16} />
              Desa Jurang Jero, Ngawen, Gunungkidul, DIY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
