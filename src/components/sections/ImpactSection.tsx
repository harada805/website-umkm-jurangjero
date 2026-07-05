import { LineChart, MousePointerClick, TrendingUp } from "lucide-react";
import { impactMetrics } from "@/lib/data";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Reveal } from "@/components/ui/Reveal";

export function ImpactSection() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 rounded-[8px] bg-leaf-800 p-6 text-white shadow-soft sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
              Impact Section
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl">
              Dampak digital yang bisa dilihat, bukan hanya dirasakan
            </h2>
            <p className="mt-5 leading-8 text-white/75">
              Statistik sederhana membantu desa membaca apakah promosi UMKM,
              wisata, dan informasi publik mulai menghasilkan interaksi nyata.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-[8px] bg-white/12 px-3 py-2 text-sm font-bold">
                <TrendingUp size={17} className="text-amber-300" />
                Siap analitik Firestore
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] bg-white/12 px-3 py-2 text-sm font-bold">
                <MousePointerClick size={17} className="text-amber-300" />
                Simpan favorit lokal
              </span>
            </div>
          </Reveal>

          <div className="grid gap-3 sm:grid-cols-2">
            {impactMetrics.map((metric, index) => (
              <Reveal key={metric.label} delay={index * 0.06}>
                <div className="h-full rounded-[8px] border border-white/12 bg-white/9 p-5">
                  <LineChart size={22} className="text-amber-300" />
                  <p className="mt-4 font-heading text-3xl font-bold">
                    <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/68">
                    {metric.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
