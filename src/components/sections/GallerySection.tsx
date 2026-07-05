"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, X } from "lucide-react";
import { galleryItems as initialGalleryItems } from "@/lib/data";
import { isFirestoreReady, subscribeGalleryItems } from "@/lib/firestore-service";
import {
  readLocalGalleryItems,
  subscribeLocalContent
} from "@/lib/local-content-store";
import type { GalleryItem } from "@/lib/types";
import { shouldUseUnoptimizedImage } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GallerySection() {
  const [galleryItems, setGalleryItems] =
    useState<GalleryItem[]>(initialGalleryItems);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    function loadLocalGallery() {
      setGalleryItems(readLocalGalleryItems(initialGalleryItems));
    }

    loadLocalGallery();
    const unsubscribeLocal = subscribeLocalContent(["galleryItems"], loadLocalGallery);
    const unsubscribeFirestore = isFirestoreReady()
      ? subscribeGalleryItems(
          (items) => {
            if (items.length) setGalleryItems(items);
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
    <section id="galeri" className="px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Galeri Multimedia"
          title="Potongan visual desa yang rapi, bukan sekadar tempelan"
          align="center"
        >
          Galeri dibuat dengan masonry layout agar foto lanskap, produk, dan
          kegiatan desa terasa hidup saat dibuka dari desktop maupun HP.
        </SectionHeading>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {galleryItems.map((item, index) => (
            <motion.button
              key={`${item.title}-${index}`}
              type="button"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04 }}
              onClick={() => setSelected(item)}
              className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[8px] border border-stonewarm-200 bg-white text-left shadow-line"
            >
              <div className={index % 3 === 0 ? "relative aspect-[0.92]" : "relative aspect-[1.34]"}>
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  unoptimized={shouldUseUnoptimizedImage(item.src)}
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-heading text-lg font-bold text-stonewarm-950">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-stonewarm-700">{item.type}</p>
                </div>
                <Camera size={19} className="shrink-0 text-leaf-800" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="relative w-full max-w-5xl overflow-hidden rounded-[8px] bg-stonewarm-950"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-[8px] bg-white/92 text-stonewarm-950"
                aria-label="Tutup galeri"
              >
                <X size={20} />
              </button>
              <div className="relative aspect-[1.45] w-full">
                <Image
                  src={selected.src}
                  alt={selected.title}
                  fill
                  unoptimized={shouldUseUnoptimizedImage(selected.src)}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="p-5 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
                  {selected.type}
                </p>
                <h3 className="mt-2 font-heading text-2xl font-bold">{selected.title}</h3>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
