"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  ClipboardList,
  ExternalLink,
  Gift,
  Heart,
  History,
  Layers3,
  MapPin,
  MessageCircle,
  Package,
  Share2,
  Sparkles,
  Star,
  X
} from "lucide-react";
import { hamlets, umkms as initialUmkms } from "@/lib/data";
import { isFirestoreReady, subscribePublicUmkms } from "@/lib/firestore-service";
import {
  readLocalUmkms,
  subscribeLocalContent
} from "@/lib/local-content-store";
import type { Umkm } from "@/lib/types";
import {
  cn,
  formatCurrency,
  shouldUseUnoptimizedImage,
  whatsappLink
} from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

const favoriteKey = "jurang-jero-favorite-umkms";

export function UmkmMarketplace() {
  const [selected, setSelected] = useState<Umkm | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [marketplaceUmkms, setMarketplaceUmkms] = useState<Umkm[]>(initialUmkms);

  useEffect(() => {
    const stored = window.localStorage.getItem(favoriteKey);
    if (stored) setFavorites(new Set(JSON.parse(stored) as string[]));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(favoriteKey, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    function loadLocalUmkms() {
      setMarketplaceUmkms(readLocalUmkms(initialUmkms));
    }

    loadLocalUmkms();
    const unsubscribeLocal = subscribeLocalContent(["umkms"], loadLocalUmkms);
    const unsubscribeFirestore = isFirestoreReady()
      ? subscribePublicUmkms(
          (items) => {
            if (items.length) setMarketplaceUmkms(items);
          },
          () => undefined
        )
      : undefined;

    return () => {
      unsubscribeLocal();
      unsubscribeFirestore?.();
    };
  }, []);

  const favoriteCount = favorites.size;

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function shareUmkm(umkm: Umkm) {
    const shareText = `${umkm.name} dari Jurang Jero Digital: ${umkm.story}`;
    const url = typeof window !== "undefined" ? `${window.location.origin}/#umkm` : "";

    if (navigator.share) {
      await navigator.share({ title: umkm.name, text: shareText, url });
      return;
    }

    await navigator.clipboard.writeText(`${shareText} ${url}`);
  }

  return (
    <section id="umkm" className="bg-white px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="UMKM Marketplace"
            title="Dapur kecil, produk jelas, cerita yang bisa dipercaya"
          >
            Etalase UMKM Jurangjero menonjolkan produk, cerita, lokasi, dan
            kontak pemesanan agar pengunjung bisa langsung mengenal usaha warga.
          </SectionHeading>

          <div className="rounded-[8px] border border-amber-500/30 bg-amber-100 p-4 text-sm text-stonewarm-950">
            <p className="font-heading text-lg font-bold">Dukung UMKM Lokal</p>
            <p className="mt-1 text-stonewarm-700">
              {favoriteCount} UMKM tersimpan sebagai favorit di perangkat ini.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {marketplaceUmkms.map((umkm, index) => {
            const hamlet = hamlets.find((item) => item.id === umkm.hamletId);
            const isFavorite = favorites.has(umkm.id);

            return (
              <motion.article
                key={umkm.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
                className="group overflow-hidden rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] shadow-line"
              >
                <button
                  type="button"
                  className="relative block aspect-[1.35] w-full overflow-hidden text-left"
                  onClick={() => setSelected(umkm)}
                >
                  <Image
                    src={umkm.cover}
                    alt={umkm.name}
                    fill
                    unoptimized={shouldUseUnoptimizedImage(umkm.cover)}
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-[8px] bg-amber-500 px-2.5 py-1 text-xs font-extrabold text-stonewarm-950">
                        {umkm.category}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-[8px] bg-white/90 px-2.5 py-1 text-xs font-bold text-stonewarm-950">
                        <Star size={13} className={umkm.verified ? "fill-amber-500 text-amber-500" : "text-stonewarm-700"} />
                        {umkm.verified ? "Pilihan warga" : "UMKM"}
                      </span>
                    </div>
                    <h3 className="mt-3 font-heading text-2xl font-bold text-white sm:text-3xl">
                      {umkm.name}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm font-semibold leading-6 text-white/82">
                      {umkm.tagline}
                    </p>
                  </div>
                </button>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-stonewarm-700">
                    <span className="inline-flex items-center gap-1.5">
                      <Package size={15} />
                      {umkm.productCount} produk
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} />
                      {hamlet?.name}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stonewarm-700">
                    {umkm.story}
                  </p>

                  <div className="mt-4 rounded-[8px] border border-leaf-800/10 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-700">
                      Produk utama
                    </p>
                    <p className="mt-1 font-heading text-lg font-bold text-stonewarm-950">
                      {umkm.specialty}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {umkm.bestFor.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-[8px] bg-leaf-100 px-2.5 py-1 text-xs font-bold text-leaf-800"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
                    {umkm.whatsapp ? (
                      <a
                        href={whatsappLink(
                          umkm.whatsapp,
                          `Halo, saya tertarik dengan ${umkm.name} yang saya lihat di Jurang Jero Digital. Boleh minta info produk dan harga?`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-3 py-3 text-sm font-bold text-white transition hover:bg-leaf-700"
                      >
                        <MessageCircle size={17} />
                        WhatsApp
                      </a>
                    ) : (
                      <span className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-stonewarm-200 bg-white px-3 py-3 text-sm font-bold text-stonewarm-700">
                        <MessageCircle size={17} />
                        Hubungi penjual
                      </span>
                    )}
                    <button
                      type="button"
                      className={cn(
                        "grid h-11 w-11 place-items-center rounded-[8px] border transition",
                        isFavorite
                          ? "border-amber-500 bg-amber-100 text-amber-700"
                          : "border-stonewarm-200 text-stonewarm-700 hover:bg-stonewarm-100"
                      )}
                      onClick={() => toggleFavorite(umkm.id)}
                      aria-label="Simpan UMKM favorit"
                    >
                      <Heart size={18} className={isFavorite ? "fill-current" : ""} />
                    </button>
                    <button
                      type="button"
                      className="grid h-11 w-11 place-items-center rounded-[8px] border border-stonewarm-200 text-stonewarm-700 transition hover:bg-stonewarm-100"
                      onClick={() => void shareUmkm(umkm)}
                      aria-label="Rekomendasikan UMKM"
                    >
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <UmkmDetailModal
            umkm={selected}
            onClose={() => setSelected(null)}
            isFavorite={favorites.has(selected.id)}
            onToggleFavorite={() => toggleFavorite(selected.id)}
            onShare={() => void shareUmkm(selected)}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

interface UmkmDetailModalProps {
  umkm: Umkm;
  isFavorite: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
  onShare: () => void;
}

function UmkmDetailModal({
  umkm,
  isFavorite,
  onClose,
  onToggleFavorite,
  onShare
}: UmkmDetailModalProps) {
  const hamlet = useMemo(
    () => hamlets.find((item) => item.id === umkm.hamletId),
    [umkm.hamletId]
  );
  const gallery = useMemo(
    () => Array.from(new Set([umkm.cover, ...umkm.gallery, ...umkm.products.map((product) => product.image)])),
    [umkm]
  );
  const [activeImage, setActiveImage] = useState(gallery[0] ?? umkm.cover);

  useEffect(() => {
    setActiveImage(gallery[0] ?? umkm.cover);
  }, [gallery, umkm.cover]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center bg-black/56 px-4 py-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.28 }}
        className="scrollbar-soft max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-[8px] bg-[#FAFAFA] shadow-soft"
      >
        <div className="grid bg-white lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-stonewarm-950">
            <Image
              src={activeImage}
              alt={umkm.name}
              fill
              unoptimized={shouldUseUnoptimizedImage(activeImage)}
              className="object-cover"
              sizes="(min-width: 1024px) 54vw, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/12 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={cn(
                    "relative h-16 w-16 shrink-0 overflow-hidden rounded-[8px] border-2 bg-white",
                    activeImage === image ? "border-amber-400" : "border-white/50"
                  )}
                  aria-label={`Lihat foto ${index + 1}`}
                >
                  <Image
                    src={image}
                    alt={`${umkm.name} foto ${index + 1}`}
                    fill
                    unoptimized={shouldUseUnoptimizedImage(image)}
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="relative p-5 sm:p-7">
            <button
              type="button"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-[8px] border border-stonewarm-200 bg-white text-stonewarm-950"
              onClick={onClose}
              aria-label="Tutup detail UMKM"
            >
              <X size={20} />
            </button>

            <div className="pr-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-leaf-100 px-2.5 py-1 text-xs font-black uppercase tracking-[0.14em] text-leaf-800">
                  <BadgeCheck size={14} />
                  {umkm.category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-amber-100 px-2.5 py-1 text-xs font-black uppercase tracking-[0.14em] text-stonewarm-950">
                  <MapPin size={14} />
                  {hamlet?.name}
                </span>
              </div>

              <h3 className="mt-4 font-heading text-3xl font-bold leading-tight text-stonewarm-950 sm:text-4xl">
                {umkm.name}
              </h3>
              <p className="mt-3 text-base font-semibold leading-7 text-stonewarm-700">
                {umkm.tagline}
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4">
                <Package size={18} className="text-leaf-800" />
                <p className="mt-2 font-heading text-xl font-bold text-stonewarm-950">
                  {umkm.productCount}
                </p>
                <p className="text-xs font-semibold text-stonewarm-700">Pilihan produk</p>
              </div>
              <div className="rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4">
                <Sparkles size={18} className="text-leaf-800" />
                <p className="mt-2 font-heading text-sm font-bold leading-5 text-stonewarm-950">
                  {umkm.specialty}
                </p>
                <p className="text-xs font-semibold text-stonewarm-700">Produk utama</p>
              </div>
              <div className="rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4">
                <Star size={18} className="fill-amber-400 text-amber-500" />
                <p className="mt-2 font-heading text-sm font-bold leading-5 text-stonewarm-950">
                  Foto produk
                </p>
                <p className="text-xs font-semibold text-stonewarm-700">Galeri produk</p>
              </div>
            </div>

            <div className="mt-6 rounded-[8px] bg-leaf-900 p-4 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
                Cocok untuk
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {umkm.bestFor.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-white/10 px-3 py-2 text-sm font-bold"
                  >
                    <Gift size={15} className="text-amber-300" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {umkm.whatsapp ? (
                <a
                  href={whatsappLink(
                    umkm.whatsapp,
                    `Halo, saya melihat detail ${umkm.name} di Jurang Jero Digital. Saya ingin memesan atau bertanya produk.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-4 py-3 text-sm font-bold text-white hover:bg-leaf-700"
                >
                  <MessageCircle size={17} />
                  Hubungi via WhatsApp
                </a>
              ) : (
                <div className="rounded-[8px] border border-amber-500/30 bg-amber-100 px-4 py-3 text-sm font-semibold leading-6 text-stonewarm-950">
                  Hubungi penjual untuk memastikan jadwal produksi dan ketersediaan produk.
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-stonewarm-200 px-4 py-3 text-sm font-bold text-stonewarm-950 hover:bg-stonewarm-100"
                >
                  <Heart size={17} className={isFavorite ? "fill-amber-500 text-amber-500" : ""} />
                  {isFavorite ? "Tersimpan" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex items-center justify-center gap-2 rounded-[8px] border border-stonewarm-200 px-4 py-3 text-sm font-bold text-stonewarm-950 hover:bg-stonewarm-100"
                >
                  <Share2 size={17} />
                  Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-7 p-5 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-7">
            <section className="rounded-[8px] border border-stonewarm-200 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-leaf-700">
                <History size={17} />
                Sejarah Singkat
              </div>
              <p className="mt-4 leading-8 text-stonewarm-700">{umkm.history}</p>
            </section>

            <section className="rounded-[8px] border border-stonewarm-200 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-leaf-700">
                <ClipboardList size={17} />
                Cerita Pemilik
              </div>
              <h4 className="mt-3 font-heading text-2xl font-bold text-stonewarm-950">
                {umkm.owner}
              </h4>
              <p className="mt-4 leading-8 text-stonewarm-700">{umkm.ownerStory}</p>
            </section>

            <section className="rounded-[8px] border border-stonewarm-200 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-leaf-700">
                <Layers3 size={17} />
                Yang Membuatnya Menarik
              </div>
              <div className="mt-4 grid gap-3">
                {umkm.highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[8px] border border-leaf-800/10 bg-leaf-100 px-4 py-3 text-sm font-semibold leading-6 text-stonewarm-950"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] border border-stonewarm-200 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-leaf-700">
                <Package size={17} />
                Produk dan Harga
              </div>
              <div className="mt-4 grid gap-3">
                {umkm.products.map((product) => (
                  <div
                    key={product.id}
                    className="grid gap-4 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-3 sm:grid-cols-[112px_1fr_auto]"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveImage(product.image)}
                      className="relative aspect-[1.12] overflow-hidden rounded-[8px] bg-white"
                      aria-label={`Lihat foto ${product.name}`}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized={shouldUseUnoptimizedImage(product.image)}
                        className="object-cover"
                        sizes="112px"
                      />
                    </button>
                    <div className="min-w-0">
                      <p className="font-bold text-stonewarm-950">{product.name}</p>
                      <p className="mt-1 text-sm leading-6 text-stonewarm-700">
                        {product.shortNote}
                      </p>
                    </div>
                    <p className="font-heading font-bold text-leaf-800 sm:text-right">
                      {product.price > 0 ? formatCurrency(product.price) : "Tanya penjual"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            <section className="rounded-[8px] border border-stonewarm-200 bg-white p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-700">
                Alur Produksi
              </p>
              <div className="mt-4 grid gap-3">
                {umkm.process.map((step, index) => (
                  <div
                    key={step.title}
                    className="grid grid-cols-[32px_1fr] gap-3 rounded-[8px] bg-stonewarm-100 p-3"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-amber-500 font-heading text-sm font-black text-stonewarm-950">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-bold text-stonewarm-950">{step.title}</p>
                      <p className="mt-1 text-sm leading-6 text-stonewarm-700">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] border border-stonewarm-200 bg-white p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-700">
                Lokasi Singkat
              </p>
              <div className="mt-4 overflow-hidden rounded-[8px] border border-leaf-800/15 bg-[#0B2F35]">
                <svg viewBox="0 0 720 430" className="h-48 w-full">
                  <rect x="0" y="0" width="720" height="430" fill="#0B2F35" />
                  {hamlet ? (
                    <>
                      <path d={hamlet.mapPath} fill="rgba(46,125,50,0.72)" stroke="#FFB300" strokeWidth="5" />
                      {hamlet.mapPoints.map((point) => (
                        <g key={point.id} transform={`translate(${point.x} ${point.y})`}>
                          <circle r="13" fill={point.type === "UMKM" ? "#FFB300" : "#FFFFFF"} stroke="#1B5E20" strokeWidth="4" />
                          <circle r="4" fill="#1B5E20" />
                        </g>
                      ))}
                    </>
                  ) : null}
                </svg>
              </div>
              <p className="mt-4 text-sm leading-7 text-stonewarm-700">
                {umkm.locationNote}
              </p>
              {umkm.mapsUrl ? (
                <a
                  href={umkm.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-4 py-3 text-sm font-bold text-white hover:bg-leaf-700"
                >
                  <ExternalLink size={17} />
                  Buka Google Maps
                </a>
              ) : null}
            </section>

            <section className="rounded-[8px] border border-stonewarm-200 bg-white p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-leaf-700">
                Kesan Produk
              </p>
              <div className="mt-4 grid gap-3">
                {umkm.testimonials.map((testimonial) => (
                  <blockquote
                    key={testimonial.name}
                    className="border-l-4 border-amber-500 pl-4 text-sm leading-7 text-stonewarm-700"
                  >
                    &quot;{testimonial.quote}&quot;
                    <footer className="mt-1 font-bold text-stonewarm-950">
                      {testimonial.name}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] border border-amber-500/30 bg-amber-100 p-5">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-stonewarm-950">
                Catatan Pesanan
              </p>
              <p className="mt-3 text-sm font-semibold leading-7 text-stonewarm-950">
                {umkm.sourceNote}
              </p>
            </section>
          </aside>
        </div>
      </motion.div>
    </motion.div>
  );
}
