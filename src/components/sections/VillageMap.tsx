"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MapPinned, Store, Trees, UsersRound } from "lucide-react";
import { hamlets, tourismSpots as initialTourismSpots, umkms as initialUmkms } from "@/lib/data";
import {
  isFirestoreReady,
  subscribePublicUmkms,
  subscribeTourismSpots
} from "@/lib/firestore-service";
import {
  readLocalTourismSpots,
  readLocalUmkms,
  subscribeLocalContent
} from "@/lib/local-content-store";
import type { HamletId, TourismSpot, Umkm } from "@/lib/types";
import { cn, formatNumber } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";

const labelPosition: Record<HamletId, { x: number; y: number }> = {
  gambarsari: { x: 178, y: 142 },
  jambu: { x: 365, y: 140 },
  jurangjero: { x: 214, y: 222 },
  kaliwuluh: { x: 506, y: 214 },
  kranggan: { x: 202, y: 306 },
  nologaten: { x: 360, y: 292 },
  purworejo: { x: 518, y: 314 },
  wonosari: { x: 326, y: 370 }
};

const villageBoundary =
  "M76 198 C108 180 132 128 184 104 C228 80 282 102 326 106 C405 113 465 133 527 147 C592 162 644 144 666 184 C646 236 632 286 590 332 C552 374 502 372 450 348 C380 382 278 388 190 360 C136 344 102 322 104 276 C75 258 66 222 76 198 Z";

export function VillageMap() {
  const [selectedId, setSelectedId] = useState<HamletId>("jurangjero");
  const [hoveredId, setHoveredId] = useState<HamletId | null>(null);
  const [mapUmkms, setMapUmkms] = useState<Umkm[]>(initialUmkms);
  const [mapTourismSpots, setMapTourismSpots] =
    useState<TourismSpot[]>(initialTourismSpots);
  const activeId = hoveredId ?? selectedId;

  const activeHamlet = useMemo(
    () => hamlets.find((hamlet) => hamlet.id === activeId) ?? hamlets[0],
    [activeId]
  );

  useEffect(() => {
    function loadLocalMapData() {
      setMapUmkms(readLocalUmkms(initialUmkms));
      setMapTourismSpots(readLocalTourismSpots(initialTourismSpots));
    }

    loadLocalMapData();
    const unsubscribeLocal = subscribeLocalContent(
      ["umkms", "tourismSpots"],
      loadLocalMapData
    );
    const unsubscribeUmkms = isFirestoreReady()
      ? subscribePublicUmkms(
          (items) => {
            if (items.length) setMapUmkms(items);
          },
          () => undefined
        )
      : undefined;
    const unsubscribeTourism = isFirestoreReady()
      ? subscribeTourismSpots(
          (items) => {
            if (items.length) setMapTourismSpots(items);
          },
          () => undefined
        )
      : undefined;

    return () => {
      unsubscribeLocal();
      unsubscribeUmkms?.();
      unsubscribeTourism?.();
    };
  }, []);

  const activeUmkms = mapUmkms.filter((umkm) => umkm.hamletId === activeHamlet.id);
  const activeTourism = mapTourismSpots.filter((spot) => spot.hamletId === activeHamlet.id);
  const activePoints = activeHamlet.mapPoints;

  return (
    <section id="peta" className="bg-leaf-900 px-5 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <SectionHeading
            eyebrow="Padukuhan Explorer"
            title="Peta desa yang menghubungkan wilayah, UMKM, dan wisata"
            tone="light"
          >
            Arahkan atau klik area padukuhan untuk melihat potensi setempat.
            Bentuk peta dibuat sebagai SVG kustom agar identitas visual desa
            tidak terasa seperti template peta biasa.
          </SectionHeading>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {hamlets.map((hamlet) => (
              <button
                key={hamlet.id}
                type="button"
                onClick={() => setSelectedId(hamlet.id)}
                className={cn(
                  "rounded-[8px] border px-3 py-3 text-left text-sm font-bold transition",
                  activeHamlet.id === hamlet.id
                    ? "border-amber-400 bg-amber-500 text-stonewarm-950"
                    : "border-white/14 bg-white/8 text-white/78 hover:bg-white/14"
                )}
              >
                {hamlet.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
          <div className="overflow-hidden rounded-[8px] border border-white/12 bg-[#0B2F35] p-3 shadow-soft sm:p-5">
            <svg
              viewBox="0 0 720 430"
              role="img"
              aria-label="Peta interaktif Padukuhan Desa Jurang Jero"
              className="h-auto w-full"
            >
              <defs>
                <pattern id="mapTexture" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path
                    d="M0 20 L20 0"
                    stroke="rgba(255,255,255,0.04)"
                    strokeWidth="1"
                  />
                </pattern>
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="18" stdDeviation="12" floodOpacity="0.22" />
                </filter>
              </defs>

              <rect x="0" y="0" width="720" height="430" rx="10" fill="#0B2F35" />
              <path d="M0 54 C118 12 194 50 284 28 C396 0 502 40 720 22 L720 0 L0 0 Z" fill="#123E40" opacity="0.72" />
              <path d="M0 360 C102 330 186 372 284 346 C410 312 514 350 720 318 L720 430 L0 430 Z" fill="#063B3D" opacity="0.78" />
              <path
                d="M28 118 C84 72 142 132 188 90 C220 62 250 64 286 84"
                fill="none"
                stroke="#071C2C"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M42 240 C120 206 158 258 226 212 C286 172 366 224 432 180 C502 134 586 174 674 146"
                fill="none"
                stroke="#071C2C"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M22 348 C110 298 208 362 302 312 C404 258 486 348 612 272"
                fill="none"
                stroke="#071C2C"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M590 66 C584 128 606 180 586 242 C572 286 600 322 642 352"
                fill="none"
                stroke="#55606A"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path d="M95 302 C188 260 246 220 332 208 C420 196 506 218 620 178" fill="none" stroke="#5D6570" strokeWidth="3" opacity="0.55" />
              <path d="M62 84 C112 112 120 154 154 188" fill="none" stroke="#071C2C" strokeWidth="4" opacity="0.7" />
              <path d="M28 286 C74 276 82 314 126 326" fill="none" stroke="#071C2C" strokeWidth="4" opacity="0.7" />

              <text x="72" y="214" className="pointer-events-none fill-[#D7A4E6] text-[19px] font-bold">
                Gunung Gambar
              </text>
              <text x="350" y="110" className="pointer-events-none fill-[#D7A4E6] text-[18px] font-bold">
                Bundelan Hills
              </text>
              <text x="432" y="240" className="pointer-events-none fill-[#F4B169] text-[18px] font-bold">
                Kantor Kalurahan
              </text>

              <g filter="url(#softShadow)">
                {hamlets.map((hamlet) => {
                  const isActive = activeHamlet.id === hamlet.id;
                  const isSelected = selectedId === hamlet.id;
                  const label = labelPosition[hamlet.id];

                  return (
                    <g key={hamlet.id}>
                      <motion.path
                        d={hamlet.mapPath}
                        fill={isActive ? "rgba(46,125,50,0.78)" : "rgba(14,86,84,0.68)"}
                        stroke={isSelected ? "#FFB300" : "rgba(255,255,255,0.16)"}
                        strokeWidth={isSelected ? 4 : 2}
                        className="cursor-pointer"
                        whileHover={{ scale: 1.012 }}
                        transition={{ duration: 0.18 }}
                        onMouseEnter={() => setHoveredId(hamlet.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => setSelectedId(hamlet.id)}
                      />
                      <path
                        d={hamlet.mapPath}
                        fill={isActive ? "rgba(255,179,0,0.16)" : "url(#mapTexture)"}
                        pointerEvents="none"
                      />
                      <text
                        x={label.x}
                        y={label.y}
                        textAnchor="middle"
                        className="pointer-events-none select-none fill-white text-[13px] font-black"
                      >
                        {hamlet.name}
                      </text>
                    </g>
                  );
                })}
              </g>

              <path
                d={villageBoundary}
                fill="none"
                stroke="#E8956F"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 9"
                opacity="0.95"
              />

              {activePoints.map((point) => (
                <g key={point.id} transform={`translate(${point.x} ${point.y})`}>
                  <circle
                    r="13"
                    fill={point.status === "resmi" ? "#FFB300" : "#FFFFFF"}
                    stroke={point.type === "Kantor" ? "#1B5E20" : "#2E7D32"}
                    strokeWidth="4"
                  />
                  <circle r="4" fill="#1B5E20" />
                </g>
              ))}
            </svg>
          </div>

          <aside className="rounded-[8px] border border-white/12 bg-white/9 p-5 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
              Padukuhan Aktif
            </p>
            <h3 className="mt-2 font-heading text-3xl font-bold">{activeHamlet.name}</h3>
            <p className="mt-4 leading-7 text-white/76">{activeHamlet.summary}</p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-[8px] border border-white/12 bg-white/8 p-3">
                <UsersRound size={18} className="text-amber-300" />
                <p className="mt-2 font-heading text-xl font-bold">
                  {formatNumber(activeHamlet.population)}
                </p>
                <p className="text-xs text-white/60">Jiwa</p>
              </div>
              <div className="rounded-[8px] border border-white/12 bg-white/8 p-3">
                <Store size={18} className="text-amber-300" />
                <p className="mt-2 font-heading text-xl font-bold">
                  {activeHamlet.families}
                </p>
                <p className="text-xs text-white/60">KK</p>
              </div>
              <div className="rounded-[8px] border border-white/12 bg-white/8 p-3">
                <Trees size={18} className="text-amber-300" />
                <p className="mt-2 font-heading text-xl font-bold">
                  {activeHamlet.rt}
                </p>
                <p className="text-xs text-white/60">RT</p>
              </div>
            </div>

            <div className="mt-6 rounded-[8px] border border-white/12 bg-white/8 p-4">
              <p className="text-sm font-bold text-white">Peta detail padukuhan</p>
              <p className="mt-2 font-mono text-xs text-white/62">
                {activeHamlet.centroid.lat}, {activeHamlet.centroid.lng}
              </p>
              <div className="mt-4 grid gap-2">
                {activePoints.map((point) => (
                  <div
                    key={point.id}
                    className="rounded-[8px] border border-white/12 bg-white/8 px-3 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-white">{point.name}</p>
                      <span className="rounded-[8px] bg-amber-500 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-stonewarm-950">
                        {point.type}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-white/68">
                      {point.description}
                    </p>
                    <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">
                      {point.status === "resmi" ? "Titik utama" : "Titik padukuhan"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="flex items-center gap-2 text-sm font-bold text-white">
                <Store size={17} className="text-amber-300" />
                UMKM yang ditandai
              </p>
              <div className="mt-3 grid gap-2">
                {activeUmkms.length ? (
                  activeUmkms.map((umkm) => (
                    <a
                      key={umkm.id}
                      href="#umkm"
                      className="rounded-[8px] border border-white/12 bg-white/8 px-3 py-3 text-sm font-semibold text-white/80 hover:bg-white/14"
                    >
                      {umkm.name}
                    </a>
                  ))
                ) : (
                  <p className="rounded-[8px] border border-white/12 bg-white/8 px-3 py-3 text-sm text-white/62">
                    Jelajahi etalase UMKM untuk melihat produk warga dari padukuhan lain.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="flex items-center gap-2 text-sm font-bold text-white">
                <MapPinned size={17} className="text-amber-300" />
                Potensi wisata
              </p>
              <div className="mt-3 grid gap-2">
                {activeTourism.length ? (
                  activeTourism.map((spot) => (
                    <a
                      key={spot.id}
                      href="#wisata"
                      className="rounded-[8px] border border-white/12 bg-white/8 px-3 py-3 text-sm font-semibold text-white/80 hover:bg-white/14"
                    >
                      {spot.name}
                    </a>
                  ))
                ) : (
                  <p className="rounded-[8px] border border-white/12 bg-white/8 px-3 py-3 text-sm text-white/62">
                    Potensi budaya dan alam desa dapat dijelajahi melalui titik padukuhan terdekat.
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
