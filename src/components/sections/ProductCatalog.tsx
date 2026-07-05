"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, Filter, ShoppingBag } from "lucide-react";
import { products as initialProducts, umkms as initialUmkms } from "@/lib/data";
import { isFirestoreReady, subscribePublicUmkms } from "@/lib/firestore-service";
import {
  readLocalUmkms,
  subscribeLocalContent
} from "@/lib/local-content-store";
import type { PriceFilter, Product, ProductCategory, Umkm } from "@/lib/types";
import {
  formatCurrency,
  shouldUseUnoptimizedImage,
  whatsappLink
} from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

type CategoryFilter = ProductCategory | "Semua";
type SortFilter = "popular" | "low" | "high";

const categories: CategoryFilter[] = [
  "Semua",
  "Kuliner",
  "Kerajinan",
  "Fashion",
  "Agro",
  "Minuman",
  "Herbal"
];

const priceFilters: { label: string; value: PriceFilter }[] = [
  { label: "Semua harga", value: "all" },
  { label: "< Rp25 ribu", value: "under25" },
  { label: "Rp25-75 ribu", value: "25to75" },
  { label: "> Rp75 ribu", value: "above75" }
];

export function ProductCatalog() {
  const [category, setCategory] = useState<CategoryFilter>("Semua");
  const [price, setPrice] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortFilter>("popular");
  const [catalogUmkms, setCatalogUmkms] = useState<Umkm[]>(initialUmkms);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    function applyUmkms(items: Umkm[]) {
      setCatalogUmkms(items);
      setCatalogProducts(items.flatMap((umkm) => umkm.products));
    }

    applyUmkms(readLocalUmkms(initialUmkms));
    const unsubscribeLocal = subscribeLocalContent(["umkms"], () => {
      applyUmkms(readLocalUmkms(initialUmkms));
    });
    const unsubscribeFirestore = isFirestoreReady()
      ? subscribePublicUmkms(
          (items) => {
            if (items.length) applyUmkms(items);
          },
          () => undefined
        )
      : undefined;

    return () => {
      unsubscribeLocal();
      unsubscribeFirestore?.();
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return catalogProducts
      .filter((product) => category === "Semua" || product.category === category)
      .filter((product) => {
        if (price === "under25") return product.price > 0 && product.price < 25000;
        if (price === "25to75") return product.price >= 25000 && product.price <= 75000;
        if (price === "above75") return product.price > 75000;
        return true;
      })
      .sort((a, b) => {
        const priceA = a.price || Number.MAX_SAFE_INTEGER;
        const priceB = b.price || Number.MAX_SAFE_INTEGER;
        if (sort === "low") return priceA - priceB;
        if (sort === "high") return (b.price || 0) - (a.price || 0);
        return b.popularity - a.popularity;
      });
  }, [catalogProducts, category, price, sort]);

  return (
    <section id="produk" className="px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Katalog Produk"
          title="Produk lokal yang mudah disaring dan dibaca"
          align="center"
        >
          Filter ringan membantu pembeli menemukan kebutuhan tanpa membuka
          banyak halaman. Harga dan kontak tetap dekat dengan produk.
        </SectionHeading>

        <div className="mt-10 grid gap-3 rounded-[8px] border border-stonewarm-200 bg-white p-4 shadow-line md:grid-cols-[1fr_220px_220px]">
          <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
            <span className="inline-flex items-center gap-2">
              <Filter size={17} />
              Kategori
            </span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryFilter)}
              className="h-11 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] px-3 text-sm font-semibold outline-none focus:border-leaf-700"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
            Harga
            <select
              value={price}
              onChange={(event) => setPrice(event.target.value as PriceFilter)}
              className="h-11 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] px-3 text-sm font-semibold outline-none focus:border-leaf-700"
            >
              {priceFilters.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
            <span className="inline-flex items-center gap-2">
              <ArrowUpDown size={17} />
              Urutkan
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortFilter)}
              className="h-11 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] px-3 text-sm font-semibold outline-none focus:border-leaf-700"
            >
              <option value="popular">Paling populer</option>
              <option value="low">Harga termurah</option>
              <option value="high">Harga tertinggi</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const umkm = catalogUmkms.find((item) => item.id === product.umkmId);

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-[8px] border border-stonewarm-200 bg-white shadow-line"
              >
                <div className="relative aspect-[1.2] overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized={shouldUseUnoptimizedImage(product.image)}
                    className="object-cover"
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
                  />
                  <span className="absolute left-3 top-3 rounded-[8px] bg-white/92 px-2.5 py-1 text-xs font-bold text-leaf-800">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stonewarm-700">
                    {umkm?.name}
                  </p>
                  <h3 className="mt-2 font-heading text-lg font-bold text-stonewarm-950">
                    {product.name}
                  </h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-stonewarm-700">
                    {product.shortNote}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-heading text-lg font-bold text-leaf-800">
                      {product.price > 0 ? formatCurrency(product.price) : "Tanya penjual"}
                    </p>
                    {umkm?.whatsapp ? (
                      <a
                        href={whatsappLink(
                          umkm.whatsapp,
                          `Halo, saya tertarik membeli ${product.name} dari ${umkm.name} yang saya lihat di Jurang Jero Digital.`
                        )}
                        target="_blank"
                        rel="noreferrer"
                        className="grid h-10 w-10 place-items-center rounded-[8px] bg-leaf-800 text-white transition hover:bg-leaf-700"
                        aria-label={`Pesan ${product.name}`}
                      >
                        <ShoppingBag size={18} />
                      </a>
                    ) : umkm ? (
                      <span
                        className="grid h-10 w-10 place-items-center rounded-[8px] border border-stonewarm-200 text-stonewarm-600"
                        aria-label={`Hubungi penjual untuk ${product.name}`}
                      >
                        <ShoppingBag size={18} />
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
