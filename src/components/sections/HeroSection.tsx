"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, MapPinned, Sparkles } from "lucide-react";
import { heroStats, villageIdentity } from "@/lib/data";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function HeroSection() {
  return (
    <section className="hero-readable relative flex min-h-[760px] items-end overflow-hidden px-4 pb-8 pt-24 text-white sm:min-h-[92svh] sm:px-5 sm:pb-10 sm:pt-32">
      <Image
        src="/images/jurang-jero-hero.png"
        alt="Lanskap hijau Desa Jurang Jero"
        fill
        priority
        unoptimized
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/72 via-black/48 to-[#123B16]/92 sm:from-black/42 sm:via-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/45 to-transparent sm:h-40" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 sm:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-white"
          style={{ color: "#FFFFFF" }}
        >
          <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-[8px] border border-white/24 bg-white/12 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur sm:mb-5 sm:text-xs sm:tracking-[0.18em]">
            <Sparkles size={15} className="text-amber-300" />
            Data resmi, budaya lokal, ekonomi warga
          </div>
          <h1
            className="font-heading text-[40px] font-extrabold leading-[1.02] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.38)] min-[390px]:text-[44px] sm:text-6xl lg:text-7xl"
            style={{ color: "#FFFFFF" }}
          >
            {villageIdentity.publicName}
          </h1>
          <p
            className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white sm:mt-5 sm:text-lg sm:leading-8"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            Profil digital Kalurahan Jurangjero yang menampilkan sejarah,
            statistik wilayah, padukuhan, potensi, layanan, dan katalog ekonomi
            lokal dalam satu ruang yang hangat dan mudah dijelajahi.
          </p>
          <p
            className="mt-3 max-w-xl text-xs leading-6 text-white sm:mt-4 sm:text-sm sm:leading-7"
            style={{ color: "rgba(255,255,255,0.76)" }}
          >
            Disusun dari situs resmi Kalurahan Jurangjero dan data produk warga
            yang diperbarui untuk tampilan 2026.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
            <a
              href="#profil"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-amber-500 px-5 py-3 text-sm font-extrabold text-stonewarm-950 transition hover:bg-amber-400"
              style={{ color: "#161915" }}
            >
              Lihat Profil Resmi
              <ArrowDown size={17} />
            </a>
            <a
              href="#peta"
              className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-white/28 bg-white/12 px-5 py-3 text-sm font-extrabold text-white backdrop-blur transition hover:bg-white/20"
              style={{ color: "#FFFFFF" }}
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
          className="grid grid-cols-2 gap-2 text-white sm:grid-cols-4 sm:gap-3 lg:grid-cols-2"
          style={{ color: "#FFFFFF" }}
        >
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[8px] border border-white/20 bg-white/13 p-3 shadow-soft backdrop-blur-md sm:p-4"
            >
              <p className="font-heading text-xl font-extrabold text-white sm:text-3xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p
                className="mt-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-white sm:text-xs sm:tracking-[0.16em]"
                style={{ color: "rgba(255,255,255,0.74)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
