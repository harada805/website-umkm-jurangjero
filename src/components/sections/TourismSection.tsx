"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, Route, X } from "lucide-react";
import { hamlets, tourismSpots as initialTourismSpots } from "@/lib/data";
import { isFirestoreReady, subscribeTourismSpots } from "@/lib/firestore-service";
import {
  readLocalTourismSpots,
  subscribeLocalContent
} from "@/lib/local-content-store";
import type { TourismSpot } from "@/lib/types";
import { shouldUseUnoptimizedImage } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function TourismSection() {
  const [selected, setSelected] = useState<TourismSpot | null>(null);
  const [tourismSpots, setTourismSpots] =
    useState<TourismSpot[]>(initialTourismSpots);

  useEffect(() => {
    function loadLocalTourism() {
      setTourismSpots(readLocalTourismSpots(initialTourismSpots));
    }

    loadLocalTourism();
    const unsubscribeLocal = subscribeLocalContent(
      ["tourismSpots"],
      loadLocalTourism
    );
    const unsubscribeFirestore = isFirestoreReady()
      ? subscribeTourismSpots(
          (items) => {
            if (items.length) setTourismSpots(items);
          },
          () => undefined
        )
      : undefined;

    return () => {
      unsubscribeLocal();
      unsubscribeFirestore?.();
    };
  }, []);

  return (
    <section id="wisata" className="bg-stonewarm-100 px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Potensi Wisata"
            title="Lanskap kecil yang layak diberi narasi"
          >
            Wisata desa tidak harus selalu besar. Titik air, bukit kapur, jalur
            sepeda, dan cerita warga bisa menjadi pengalaman yang hangat dan
            terkurasi.
          </SectionHeading>
          <a
            href="#peta"
            className="inline-flex w-fit items-center gap-2 rounded-[8px] bg-leaf-800 px-5 py-3 text-sm font-bold text-white hover:bg-leaf-700"
          >
            <Route size={17} />
            Jelajahi lewat Peta
          </a>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tourismSpots.map((spot, index) => {
            const hamlet = hamlets.find((item) => item.id === spot.hamletId);

            return (
              <motion.article
                key={spot.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-[8px] border border-stonewarm-200 bg-white shadow-line"
              >
                <button
                  type="button"
                  className="relative block aspect-[1.08] w-full overflow-hidden text-left"
                  onClick={() => setSelected(spot)}
                >
                  <Image
                    src={spot.image}
                    alt={spot.name}
                    fill
                    unoptimized={shouldUseUnoptimizedImage(spot.image)}
                    className="object-cover transition duration-700 hover:scale-105"
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/74 via-black/12 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="rounded-[8px] bg-amber-500 px-2.5 py-1 text-xs font-extrabold text-stonewarm-950">
                      {spot.highlight}
                    </span>
                    <h3 className="mt-3 font-heading text-2xl font-bold text-white">
                      {spot.name}
                    </h3>
                  </div>
                </button>
                <div className="p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-leaf-800">
                    <MapPin size={16} />
                    {hamlet?.name}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stonewarm-700">
                    {spot.summary}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <TourismModal spot={selected} onClose={() => setSelected(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function TourismModal({
  spot,
  onClose
}: {
  spot: TourismSpot;
  onClose: () => void;
}) {
  const hamlet = hamlets.find((item) => item.id === spot.hamletId);

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
        className="max-h-[92svh] w-full max-w-3xl overflow-y-auto rounded-[8px] bg-[#FAFAFA] shadow-soft"
      >
        <div className="relative aspect-[1.6] overflow-hidden rounded-t-[8px]">
          <Image
            src={spot.image}
            alt={spot.name}
            fill
            unoptimized={shouldUseUnoptimizedImage(spot.image)}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-transparent to-black/12" />
          <button
            type="button"
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-[8px] bg-white/90 text-stonewarm-950"
            onClick={onClose}
            aria-label="Tutup detail wisata"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-5 left-5 right-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              {hamlet?.name}
            </p>
            <h3 className="mt-2 font-heading text-3xl font-bold">{spot.name}</h3>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[8px] border border-stonewarm-200 bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-leaf-800">
                <Clock size={17} />
                Waktu terbaik
              </p>
              <p className="mt-2 font-heading text-xl font-bold text-stonewarm-950">
                {spot.bestTime}
              </p>
            </div>
            <div className="rounded-[8px] border border-stonewarm-200 bg-white p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-leaf-800">
                <MapPin size={17} />
                Padukuhan
              </p>
              <p className="mt-2 font-heading text-xl font-bold text-stonewarm-950">
                {hamlet?.name}
              </p>
            </div>
          </div>
          <p className="mt-6 leading-8 text-stonewarm-700">{spot.detail}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
