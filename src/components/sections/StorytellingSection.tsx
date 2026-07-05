import { timeline } from "@/lib/data";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function StorytellingSection() {
  return (
    <section className="texture-paper px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Cerita Perjalanan"
          title="Desa yang bergerak tanpa meninggalkan akar"
        >
          Jurang Jero Digital disusun sebagai ruang cerita, bukan sekadar daftar
          informasi. Setiap data diberi konteks agar warga, pengunjung, dan
          perangkat desa punya bahasa yang sama.
        </SectionHeading>

        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {timeline.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
              <article className="h-full rounded-[8px] border border-stonewarm-200 bg-white/78 p-6 shadow-line">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-leaf-700">
                  {item.year}
                </p>
                <h3 className="mt-4 font-heading text-xl font-bold text-stonewarm-950">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-stonewarm-700">
                  {item.text}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
