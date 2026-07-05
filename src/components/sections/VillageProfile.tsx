import {
  BarChart3,
  CalendarDays,
  ExternalLink,
  FileText,
  Home,
  Landmark,
  MapPinned,
  Phone,
  ShieldCheck,
  UsersRound
} from "lucide-react";
import {
  hamlets,
  officialSources,
  organizationMembers,
  villageIdentity,
  villageServices
} from "@/lib/data";
import { formatNumber } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const facts = [
  { label: "Penduduk", value: `${formatNumber(villageIdentity.population)} jiwa` },
  { label: "Kepala Keluarga", value: `${formatNumber(villageIdentity.households)} KK` },
  { label: "Laki-laki", value: `${formatNumber(villageIdentity.male)} jiwa` },
  { label: "Perempuan", value: `${formatNumber(villageIdentity.female)} jiwa` },
  { label: "RT", value: `${villageIdentity.rt}` },
  { label: "Padukuhan", value: `${villageIdentity.rw}` }
];

export function VillageProfile() {
  const maxPopulation = Math.max(...hamlets.map((hamlet) => hamlet.population));

  return (
    <section id="profil" className="bg-[#F7F5EF] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Profil Resmi Kalurahan"
              title="Jurangjero, Ngawen, Gunungkidul"
            >
              Data profil ini disusun dari situs resmi Kalurahan Jurangjero
              dengan bahasa yang ringkas, rapi, dan mudah dipahami pengunjung.
            </SectionHeading>

            <div className="mt-7 rounded-[8px] border border-leaf-800/18 bg-white p-5 shadow-line">
              <div className="flex items-start gap-3">
                <Landmark className="mt-1 shrink-0 text-leaf-800" size={23} />
                <div>
                  <h3 className="font-heading text-xl font-bold text-stonewarm-950">
                    Sejarah Singkat
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stonewarm-700">
                    Situs resmi desa mencatat Jurangjero lahir pada 1912 dari
                    penggabungan 8 kelurahan kecil: Jambu, Gambarsari,
                    Jurangjero, Kaliwuluh, Kranggan, Nologaten, Purworejo, dan
                    Wonosari. Pemerintahan awal dipimpin Lurah Ngadiman.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-[8px] border border-leaf-800/18 bg-white p-5 shadow-line">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 shrink-0 text-leaf-800" size={23} />
                <div>
                  <h3 className="font-heading text-xl font-bold text-stonewarm-950">
                    Visi dan Misi Pemerintah Kalurahan
                  </h3>
                  <p className="mt-3 text-base font-bold leading-7 text-leaf-800">
                    {villageIdentity.vision}
                  </p>
                  <p className="mt-2 inline-flex rounded-[8px] bg-amber-100 px-3 py-2 text-sm font-black text-stonewarm-950">
                    Slogan: {villageIdentity.slogan}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[8px] border border-leaf-800/10 bg-leaf-100 p-3">
                      <p className="text-sm font-bold text-leaf-900">Mandiri</p>
                      <p className="mt-1 text-sm leading-6 text-stonewarm-700">
                        Menguatkan kemampuan pemerintah kalurahan dan masyarakat
                        dalam penyelenggaraan pembangunan desa.
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-amber-500/20 bg-amber-100 p-3">
                      <p className="text-sm font-bold text-stonewarm-950">Sejahtera</p>
                      <p className="mt-1 text-sm leading-6 text-stonewarm-700">
                        Mendorong kualitas pembangunan, pelayanan, ekonomi, dan
                        kehidupan masyarakat yang lebih baik.
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-stonewarm-700">
                    Misi
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm leading-6 text-stonewarm-700">
                    {villageIdentity.mission.map((mission) => (
                      <li key={mission} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        <span>{mission}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div id="data" className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf-700">
                    Statistik Wilayah
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-bold text-stonewarm-950">
                    Statistik wilayah 2026
                  </h3>
                </div>
                <a
                  href={officialSources.wilayah}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-[8px] border border-stonewarm-200 px-3 py-2 text-sm font-bold text-leaf-800 hover:bg-leaf-100"
                >
                  Sumber
                  <ExternalLink size={15} />
                </a>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-stonewarm-700">
                      {fact.label}
                    </p>
                    <p className="mt-2 font-heading text-2xl font-bold text-stonewarm-950">
                      {fact.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <p className="flex items-center gap-2 text-sm font-bold text-stonewarm-950">
                  <BarChart3 size={18} className="text-leaf-800" />
                  Jumlah penduduk per padukuhan
                </p>
                <div className="mt-4 grid gap-3">
                  {hamlets.map((hamlet) => (
                    <div key={hamlet.id}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold text-stonewarm-950">
                          {hamlet.name}
                        </span>
                        <span className="text-stonewarm-700">
                          {formatNumber(hamlet.population)} jiwa - {hamlet.families} KK - {hamlet.rt} RT
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-stonewarm-200">
                        <div
                          className="h-full rounded-full bg-leaf-800"
                          style={{
                            width: `${Math.max(8, (hamlet.population / maxPopulation) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.78fr]">
          <Reveal>
            <div className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
              <div className="flex items-center gap-3">
                <MapPinned className="text-leaf-800" size={23} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf-700">
                    Geografis dan Potensi
                  </p>
                  <h3 className="font-heading text-2xl font-bold text-stonewarm-950">
                    Titik koordinat, padukuhan, dan potensi awal
                  </h3>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[8px] bg-leaf-100 p-4">
                  <p className="text-sm font-bold text-leaf-900">Koordinat resmi</p>
                  <p className="mt-2 font-mono text-sm text-stonewarm-950">
                    {villageIdentity.coordinate.lat}, {villageIdentity.coordinate.lng}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stonewarm-700">
                    Koordinat ini membantu pengunjung memahami posisi umum
                    Jurangjero di wilayah Ngawen, Gunungkidul.
                  </p>
                </div>
                <div className="rounded-[8px] bg-amber-100 p-4">
                  <p className="text-sm font-bold text-stonewarm-950">Potensi terbaca</p>
                  <p className="mt-2 text-sm leading-6 text-stonewarm-700">
                    Budaya Gunung Gambar, Masjid Tiban, kelompok ekonomi KWT
                    Ngudi Rejeki Purworejo, dan layanan administrasi kalurahan.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
              <div className="flex items-center gap-3">
                <FileText className="text-leaf-800" size={23} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf-700">
                    Layanan Publik
                  </p>
                  <h3 className="font-heading text-2xl font-bold text-stonewarm-950">
                    Termasuk modul PBB
                  </h3>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {villageServices.map((service) => (
                  <div
                    key={service.title}
                    className="rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-stonewarm-950">{service.title}</p>
                      <span className="rounded-[8px] bg-leaf-100 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-leaf-800">
                        {service.status === "aktif" ? "aktif" : "tersedia"}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-stonewarm-700">
                      {service.summary}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-stonewarm-700">
                      Kanal: {service.channel}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-8">
          <div className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
            <div className="flex items-center gap-3">
              <UsersRound className="text-leaf-800" size={23} />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-leaf-700">
                  Struktur Organisasi
                </p>
                <h3 className="font-heading text-2xl font-bold text-stonewarm-950">
                  Susunan Pemerintah Kalurahan Jurangjero
                </h3>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {organizationMembers.map((member) => (
                <div
                  key={`${member.role}-${member.name}`}
                  className="flex min-h-[220px] flex-col rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-700">
                    {member.role}
                  </p>
                  <p className="mt-2 font-heading text-lg font-bold text-stonewarm-950">
                    {member.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stonewarm-700">
                    {member.scope}
                  </p>

                  <div className="mt-4 grid gap-2 text-sm leading-6 text-stonewarm-700">
                    {member.ttl ? (
                      <p className="flex gap-2">
                        <CalendarDays className="mt-0.5 shrink-0 text-leaf-800" size={16} />
                        <span>{member.ttl}</span>
                      </p>
                    ) : null}
                    {member.address ? (
                      <p className="flex gap-2">
                        <Home className="mt-0.5 shrink-0 text-leaf-800" size={16} />
                        <span>{member.address}</span>
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-auto pt-4">
                    {member.phone && member.phone !== "-" ? (
                      <a
                        href={`tel:${member.phone.replace(/\D/g, "")}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-leaf-800/20 bg-white px-3 py-2 text-sm font-bold text-leaf-800 hover:bg-leaf-100"
                      >
                        <Phone size={16} />
                        {member.phone}
                      </a>
                    ) : (
                      <span className="inline-flex w-full items-center justify-center gap-2 rounded-[8px] border border-stonewarm-200 bg-white px-3 py-2 text-sm font-bold text-stonewarm-600">
                        <Phone size={16} />
                        Belum tersedia
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-6 text-stonewarm-700">
              {villageIdentity.note}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
