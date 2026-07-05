"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, MapPinned, Sparkles } from "lucide-react";
import { heroStats, villageIdentity } from "@/lib/data";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden px-5 pb-10 pt-32 text-white">
      <Image
        src="/images/jurang-jero-hero.png"
        alt="Lanskap hijau Desa Jurang Jero"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/42 via-black/30 to-[#123B16]/88" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/50 to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-[8px] border border-white/24 bg-white/12 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] backdrop-blur">
            <Sparkles size={15} className="text-amber-300" />
            Data resmi, budaya lokal, ekonomi warga
          </div>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            {villageIdentity.publicName}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/84 sm:text-lg">
            Profil digital Kalurahan Jurangjero yang menampilkan sejarah,
            statistik wilayah, padukuhan, potensi, layanan, dan katalog ekonomi
            lokal dalam satu ruang yang hangat dan mudah dijelajahi.
          </p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            Disusun dari situs resmi Kalurahan Jurangjero dan data produk warga
            yang diperbarui untuk tampilan 2026.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#profil"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-amber-500 px-5 py-3 text-sm font-extrabold text-stonewarm-950 transition hover:bg-amber-400"
            >
              Lihat Profil Resmi
              <ArrowDown size={17} />
            </a>
            <a
              href="#peta"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/28 bg-white/12 px-5 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20"
            >
              <MapPinned size={17} />
              Buka Peta Padukuhan
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2"
        >
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[8px] border border-white/20 bg-white/13 p-4 shadow-soft backdrop-blur-md"
            >
              <p className="font-heading text-2xl font-extrabold sm:text-3xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/68">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
