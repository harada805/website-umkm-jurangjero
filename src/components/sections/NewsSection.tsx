"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Megaphone, Newspaper } from "lucide-react";
import { newsItems } from "@/lib/data";
import { isFirestoreReady, subscribeNewsItems } from "@/lib/firestore-service";
import {
  readLocalNewsItems,
  subscribeLocalContent
} from "@/lib/local-content-store";
import type { NewsItem } from "@/lib/types";
import { SectionHeading } from "@/components/ui/SectionHeading";

const iconByType = {
  Berita: Newspaper,
  Pengumuman: Megaphone,
  Acara: CalendarDays
};

function sortByNewest(items: NewsItem[]) {
  return [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function NewsSection() {
  const [items, setItems] = useState<NewsItem[]>(sortByNewest(newsItems));

  useEffect(() => {
    function loadLocalNews() {
      setItems(sortByNewest(readLocalNewsItems(newsItems)));
    }

    loadLocalNews();
    const unsubscribeLocal = subscribeLocalContent(["news"], loadLocalNews);
    const unsubscribeFirestore = isFirestoreReady()
      ? subscribeNewsItems(
          (storedItems) => {
            if (storedItems.length) setItems(sortByNewest(storedItems));
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
    <section id="berita" className="bg-stonewarm-100 px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Berita, Pengumuman & Acara"
          title="Informasi desa yang singkat, jelas, dan mudah ditindaklanjuti"
          align="center"
        >
          Format ini disiapkan agar admin desa bisa menambah kabar harian tanpa
          harus menata layout dari awal.
        </SectionHeading>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {items.map((item) => {
            const Icon = iconByType[item.type] ?? Newspaper;

            return (
              <article
                key={item.id}
                className="rounded-[8px] border border-stonewarm-200 bg-white p-6 shadow-line"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-[8px] bg-leaf-100 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-leaf-800">
                    <Icon size={15} />
                    {item.type}
                  </span>
                  <time className="text-sm font-semibold text-stonewarm-700">
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }).format(new Date(item.date))}
                  </time>
                </div>
                <h3 className="mt-5 font-heading text-xl font-bold text-stonewarm-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stonewarm-700">
                  {item.excerpt}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
