import type {
  ChartDatum,
  CitizenStory,
  GalleryItem,
  Hamlet,
  NewsItem,
  OfficialArticle,
  OrganizationMember,
  Product,
  TourismSpot,
  Umkm,
  VillageService
} from "./types";

const wisataCover = "/images/wisata-cover.png";
const heroCover = "/images/jurang-jero-hero.png";
const ibuPareCover = "/images/umkm/ibu-pare-cover.jpeg";
const ibuPareKeripikTales = "/images/umkm/ibu-pare-keripik-tales.jpeg";
const ibuPareSnackKering = "/images/umkm/ibu-pare-snack-kering.jpeg";
const ibuPareKueBasah = "/images/umkm/ibu-pare-kue-basah.jpeg";
const ibuPareKemasan = "/images/umkm/ibu-pare-kemasan.jpeg";
const alHusnaCover = "/images/umkm/al-husna-cover.jpeg";
const alHusnaLollipop = "/images/umkm/al-husna-lollipop.jpeg";
const alHusnaDisplay = "/images/umkm/al-husna-display.jpeg";
const alHusnaRoundpop = "/images/umkm/al-husna-roundpop.jpeg";
const alHusnaTray = "/images/umkm/al-husna-tray.jpeg";
const rhiensCover = "/images/umkm/rhiens-cover.jpeg";
const rhiensCookiesJar = "/images/umkm/rhiens-cookies-jar.jpeg";
const rhiensBrownies = "/images/umkm/rhiens-brownies.jpeg";
const rhiensCustomCake = "/images/umkm/rhiens-custom-cake.jpeg";
const rhiensBoluKeju = "/images/umkm/rhiens-bolu-keju.jpeg";
const citaPawonCover = "/images/umkm/cita-pawon-cover.jpeg";
const citaPawonBrownies = "/images/umkm/cita-pawon-brownies.jpeg";
const citaPawonAnekaKue = "/images/umkm/cita-pawon-aneka-kue.jpeg";
const citaPawonFruitTart = "/images/umkm/cita-pawon-fruit-tart.jpeg";
const citaPawonSnackPlatter = "/images/umkm/cita-pawon-snack-platter.jpeg";
const kesetCover = "/images/umkm/keset/keset-cover.jpeg";
const kesetMenjahit = "/images/umkm/keset/keset-menjahit.jpeg";
const kesetProduksi = "/images/umkm/keset/keset-produksi.jpeg";
const kesetJadi = "/images/umkm/keset/keset-jadi.jpeg";
const kesetDetailBelakang = "/images/umkm/keset/keset-detail-belakang.jpeg";
const kesetBahan = "/images/umkm/keset/keset-bahan.jpeg";
const rapatKalurahan = "/images/gallery/rapat-kalurahan.jpeg";

export const officialSources = {
  website: "https://desajurangjero.gunungkidulkab.go.id/",
  wilayah: "https://desajurangjero.gunungkidulkab.go.id/first/wilayah",
  sejarah: "https://desajurangjero.gunungkidulkab.go.id/first/artikel/57",
  potensi: "https://desajurangjero.gunungkidulkab.go.id/first/artikel/59",
  pemerintahan: "https://desajurangjero.gunungkidulkab.go.id/first/artikel/35"
};

export const villageIdentity = {
  name: "Kalurahan Jurangjero",
  publicName: "Desa Jurang Jero",
  district: "Kapanewon Ngawen",
  regency: "Kabupaten Gunungkidul",
  province: "Daerah Istimewa Yogyakarta",
  coordinate: { lat: -7.8598847746, lng: 110.3659354247 },
  population: 4939,
  households: 1708,
  male: 2471,
  female: 2468,
  rt: 53,
  rw: 8,
  area: "8 padukuhan",
  sourceLabel: "Situs resmi Kalurahan Jurangjero, halaman Wilayah, diakses 30 Juni 2026",
  vision: "Terwujudnya Desa Jurangjero yang mandiri dan sejahtera.",
  slogan: "Nyawiji Mbangun Desa",
  mission: [
    "Menyelenggarakan pemerintahan desa yang efisien, efektif, bersih, profesional, transparan, dan akuntabel dengan mengutamakan kepentingan masyarakat.",
    "Meningkatkan sumber pendanaan pemerintahan dan pembangunan desa agar program berjalan lebih terarah.",
    "Mengembangkan pemberdayaan masyarakat dan kemitraan dalam pelaksanaan pembangunan desa.",
    "Meningkatkan kualitas sumber daya manusia dalam pembangunan desa yang berkelanjutan.",
    "Mengembangkan perekonomian desa, produktivitas pertanian, UMKM, dan sektor riil masyarakat.",
    "Menciptakan rasa aman, tenteram, demokratis, dan agamis dalam kehidupan masyarakat desa."
  ],
  note:
    "Data statistik mengacu pada angka yang dipublikasikan melalui situs resmi Kalurahan Jurangjero."
};

export const heroStats = [
  { label: "Penduduk Resmi", value: 4939, suffix: " Jiwa" },
  { label: "Kepala Keluarga", value: 1708, suffix: " KK" },
  { label: "RT Terdata", value: 53, suffix: "" },
  { label: "Padukuhan", value: 8, suffix: "" }
];

export const hamlets: Hamlet[] = [
  {
    id: "gambarsari",
    name: "Gambarsari",
    population: 540,
    families: 179,
    rt: 6,
    male: 266,
    female: 274,
    umkmCount: 0,
    tourismCount: 1,
    signature: "wilayah budaya dan ruang warga",
    summary:
      "Padukuhan di sisi utara peta desa, dikenal sebagai ruang warga yang dekat dengan agenda budaya Gunung Gambar.",
    mapPath: "M78 198 C118 160 138 126 184 104 C220 88 252 96 280 108 L248 168 L166 194 L106 236 Z",
    centroid: { lat: -7.8519, lng: 110.3577 },
    mapPoints: [
      {
        id: "gambarsari-balai",
        name: "Titik layanan Gambarsari",
        type: "Fasilitas",
        x: 166,
        y: 160,
        description: "Penanda layanan warga dan aktivitas padukuhan Gambarsari.",
        status: "resmi"
      },
      {
        id: "gunung-gambar",
        name: "Ruang budaya Gunung Gambar",
        type: "Budaya",
        x: 110,
        y: 214,
        description:
          "Ruang budaya yang terkait dengan kegiatan Sadranan Gunung Gambar 2026.",
        status: "resmi"
      }
    ]
  },
  {
    id: "jambu",
    name: "Jambu",
    population: 553,
    families: 193,
    rt: 7,
    male: 274,
    female: 279,
    umkmCount: 1,
    tourismCount: 0,
    signature: "permukiman dan produk snack rumahan",
    summary:
      "Padukuhan Jambu memiliki 553 jiwa, 193 KK, dan 7 RT, sekaligus menjadi rumah bagi produk snack rumahan Ibu Pare Snack Sido Maju.",
    mapPath: "M280 108 C342 104 414 126 492 142 L462 198 L344 178 L248 168 Z",
    centroid: { lat: -7.8527, lng: 110.3661 },
    mapPoints: [
      {
        id: "jambu-pos",
        name: "Titik pelayanan Jambu",
        type: "Fasilitas",
        x: 380,
        y: 145,
        description: "Penanda layanan dan aktivitas warga di Padukuhan Jambu.",
        status: "resmi"
      },
      {
        id: "ibu-pare-sido-maju",
        name: "Ibu Pare Snack Sido Maju",
        type: "UMKM",
        x: 334,
        y: 166,
        description:
          "Snack rumahan dari Jambu yang dikenal lewat Keripik Tales Gurih dan aneka camilan pesanan.",
        status: "resmi"
      }
    ]
  },
  {
    id: "jurangjero",
    name: "Jurangjero",
    population: 959,
    families: 330,
    rt: 12,
    male: 480,
    female: 479,
    umkmCount: 4,
    tourismCount: 1,
    signature: "pusat administrasi kalurahan",
    summary:
      "Padukuhan dengan populasi terbesar dalam data wilayah resmi: 959 jiwa, 330 KK, dan 12 RT.",
    mapPath: "M106 236 L166 194 L248 168 L344 178 L286 238 L194 270 L112 276 Z",
    centroid: { lat: -7.8598847746, lng: 110.3659354247 },
    mapPoints: [
      {
        id: "kantor-kalurahan",
        name: "Kantor Kalurahan Jurangjero",
        type: "Kantor",
        x: 278,
        y: 220,
        description:
          "Pusat layanan administrasi kalurahan. Koordinat publik mengarah ke kawasan Jurangjero.",
        status: "resmi"
      },
      {
        id: "layanan-pbb",
        name: "Informasi PBB dan layanan pajak",
        type: "Layanan",
        x: 318,
        y: 246,
        description:
          "Penanda layanan informasi PBB, pajak, dan administrasi warga di lingkungan kalurahan.",
        status: "resmi"
      },
      {
        id: "masjid-tiban",
        name: "Masjid Tiban",
        type: "Budaya",
        x: 170,
        y: 224,
        description:
          "Ruang budaya dan religi yang menjadi bagian dari potensi Jurangjero.",
        status: "resmi"
      },
      {
        id: "al-husna-cokelat-karakter",
        name: "Cokelat Karakter Al Husna",
        type: "UMKM",
        x: 232,
        y: 252,
        description:
          "Produk cokelat karakter, lollipop, dan hampers mini. Lokasi publik sudah diberi melalui Google Maps oleh pemilik data.",
        status: "resmi"
      },
      {
        id: "rhiens-cookies",
        name: "Rhiens Cookies",
        type: "UMKM",
        x: 260,
        y: 205,
        description:
          "Cookies toples, brownies, bolu, dan cake custom. Lokasi publik tersedia melalui Google Maps dari pemilik data.",
        status: "resmi"
      },
      {
        id: "cita-pawon",
        name: "Cita Pawon",
        type: "UMKM",
        x: 306,
        y: 272,
        description:
          "Aneka kue, snack tampah, brownies, dan hampers manis untuk acara keluarga maupun pesanan spesial.",
        status: "resmi"
      },
      {
        id: "keset-kain-jurangjero",
        name: "UMKM Keset Kain Jurangjero",
        type: "UMKM",
        x: 208,
        y: 196,
        description:
          "Kerajinan keset kain yang dibuat dengan mesin jahit, pola berlapis, dan pilihan warna pesanan.",
        status: "perlu-verifikasi"
      }
    ]
  },
  {
    id: "kaliwuluh",
    name: "Kaliwuluh",
    population: 373,
    families: 140,
    rt: 4,
    male: 188,
    female: 185,
    umkmCount: 0,
    tourismCount: 0,
    signature: "padukuhan kecil dengan data administrasi ringkas",
    summary:
      "Kaliwuluh tercatat 373 jiwa, 140 KK, dan 4 RT, dengan karakter padukuhan yang ringkas dan dekat dengan aktivitas warga.",
    mapPath: "M344 178 L462 198 L552 164 L628 186 L584 242 L484 258 L398 232 Z",
    centroid: { lat: -7.8591, lng: 110.3743 },
    mapPoints: [
      {
        id: "kaliwuluh-pos",
        name: "Titik layanan Kaliwuluh",
        type: "Fasilitas",
        x: 520,
        y: 214,
        description: "Penanda layanan warga dan aktivitas padukuhan Kaliwuluh.",
        status: "resmi"
      }
    ]
  },
  {
    id: "kranggan",
    name: "Kranggan",
    population: 808,
    families: 265,
    rt: 8,
    male: 397,
    female: 411,
    umkmCount: 0,
    tourismCount: 0,
    signature: "wilayah padat penduduk",
    summary:
      "Kranggan tercatat 808 jiwa, 265 KK, dan 8 RT. Komposisi perempuan sedikit lebih banyak dari laki-laki.",
    mapPath: "M112 276 L194 270 L286 238 L330 286 L246 332 L126 334 Z",
    centroid: { lat: -7.8667, lng: 110.3562 },
    mapPoints: [
      {
        id: "kranggan-fasilitas",
        name: "Titik fasilitas Kranggan",
        type: "Fasilitas",
        x: 202,
        y: 306,
        description: "Ruang warga Kranggan untuk fasilitas, pertemuan, dan aktivitas lingkungan.",
        status: "resmi"
      }
    ]
  },
  {
    id: "nologaten",
    name: "Nologaten",
    population: 545,
    families: 198,
    rt: 7,
    male: 276,
    female: 269,
    umkmCount: 0,
    tourismCount: 0,
    signature: "permukiman dengan potensi pekarangan",
    summary:
      "Nologaten tercatat 545 jiwa, 198 KK, dan 7 RT dalam data wilayah resmi.",
    mapPath: "M286 238 L398 232 L438 288 L362 336 L246 332 L330 286 Z",
    centroid: { lat: -7.8687, lng: 110.3658 },
    mapPoints: [
      {
        id: "nologaten-pos",
        name: "Titik layanan Nologaten",
        type: "Fasilitas",
        x: 360,
        y: 292,
        description: "Penanda aktivitas warga dan potensi pekarangan Padukuhan Nologaten.",
        status: "resmi"
      }
    ]
  },
  {
    id: "purworejo",
    name: "Purworejo",
    population: 419,
    families: 158,
    rt: 4,
    male: 210,
    female: 209,
    umkmCount: 0,
    tourismCount: 0,
    signature: "agro warga dan pekarangan",
    summary:
      "Purworejo tercatat 419 jiwa, 158 KK, dan 4 RT, dengan karakter agro warga dan pekarangan produktif.",
    mapPath: "M398 232 L484 258 L584 242 L634 292 L570 356 L446 342 L438 288 Z",
    centroid: { lat: -7.8708, lng: 110.3747 },
    mapPoints: [
      {
        id: "purworejo-agro",
        name: "Potensi agro Purworejo",
        type: "Fasilitas",
        x: 518,
        y: 312,
        description:
          "Ruang potensi kelompok tani, pekarangan, dan produk agro warga Purworejo.",
        status: "resmi"
      }
    ]
  },
  {
    id: "wonosari",
    name: "Wonosari",
    population: 742,
    families: 245,
    rt: 5,
    male: 380,
    female: 362,
    umkmCount: 0,
    tourismCount: 0,
    signature: "wilayah selatan desa",
    summary:
      "Wonosari tercatat 742 jiwa, 245 KK, dan 5 RT dalam halaman wilayah resmi.",
    mapPath: "M126 334 L246 332 L362 336 L446 342 L570 356 L522 386 L318 388 L144 358 Z",
    centroid: { lat: -7.8746, lng: 110.3629 },
    mapPoints: [
      {
        id: "wonosari-fasilitas",
        name: "Titik fasilitas Wonosari",
        type: "Fasilitas",
        x: 326,
        y: 370,
        description: "Penanda fasilitas dan aktivitas warga di wilayah selatan desa.",
        status: "resmi"
      }
    ]
  }
];

export const timeline = [
  {
    year: "1912",
    title: "Lahir dari penggabungan wilayah",
    text: "Situs resmi menyebut Jurangjero terbentuk dari penggabungan 8 kelurahan kecil: Jambu, Gambarsari, Jurangjero, Kaliwuluh, Kranggan, Nologaten, Purworejo, dan Wonosari."
  },
  {
    year: "Lurah I",
    title: "Ngadiman sebagai lurah pertama",
    text: "Pemerintahan awal dipimpin Lurah Ngadiman dengan carik Kerto Pawiro dan pembantu pemerintahan wilayah."
  },
  {
    year: "2026",
    title: "Data wilayah masuk ruang digital",
    text: "Halaman wilayah resmi menampilkan 4.939 jiwa, 1.708 KK, 53 RT, dan 8 padukuhan sebagai basis data publik."
  },
  {
    year: "Berikutnya",
    title: "Etalase desa yang terus hidup",
    text: "Profil, UMKM, layanan PBB, berita, dan agenda desa ditata agar mudah dibaca warga maupun pengunjung."
  }
];

export const organizationMembers: OrganizationMember[] = [
  {
    role: "Lurah",
    name: "Suparno",
    scope: "Pemerintah Kalurahan",
    ttl: "Gunungkidul",
    address: "Jurangjero RT 005 RW 005, Jurangjero, Ngawen, Gunungkidul",
    phone: "0857 8662 1573"
  },
  {
    role: "Carik",
    name: "Aris Wijayadi, SIP",
    scope: "Sekretariat Kalurahan",
    ttl: "Gunungkidul",
    address: "Jambu RT 001 RW 001, Jambu, Jurangjero, Ngawen, Gunungkidul",
    phone: "0813 2872 6655"
  },
  {
    role: "Jogoboyo",
    name: "Wahyu, S.Pdi",
    scope: "Keamanan dan ketertiban masyarakat",
    ttl: "Gunungkidul, 21 Desember 1990",
    address: "Nologaten RT 02 RW 03",
    phone: "0852 9237 7351"
  },
  {
    role: "Ulu-ulu",
    name: "Sriyanto",
    scope: "Kemakmuran dan tata kelola wilayah",
    ttl: "Gunungkidul, 15 Februari 1968",
    address: "Purworejo RT 04 RW 02",
    phone: "0877 3975 4222"
  },
  {
    role: "Kamituwa",
    name: "Dwi Santosa",
    scope: "Sosial kemasyarakatan",
    ttl: "Gunungkidul, 16 Juni 1981",
    address: "Purworejo RT 003 RW 002, Jurangjero, Ngawen, Gunungkidul",
    phone: "0821 3743 8489"
  },
  {
    role: "Pangripta",
    name: "Heri Dwi Susanta",
    scope: "Perencanaan pembangunan",
    ttl: "Gunungkidul",
    address: "Jurangjero RT 05 RW 05",
    phone: "0852 2633 0662"
  },
  {
    role: "Kepala Urusan Tata Laksana",
    name: "Gatot Suharja",
    scope: "Administrasi dan tata laksana",
    ttl: "Gunungkidul, 17 Maret 1967",
    address: "Jambu RT 02 RW 01",
    phone: "0857 2824 9246"
  },
  {
    role: "Kepala Urusan Danarta",
    name: "Agung Sriawan",
    scope: "Keuangan kalurahan",
    ttl: "Gunungkidul, 10 September 1986",
    address: "Jurangjero RT 06 RW 05",
    phone: "0857 4234 6998"
  },
  {
    role: "Dukuh Jambu",
    name: "Sukarmin",
    scope: "Padukuhan Jambu",
    ttl: "Gunungkidul",
    address: "Jambu RT 06 RW 01",
    phone: "0852 2827 0517"
  },
  {
    role: "Dukuh Purworejo",
    name: "Gunanto",
    scope: "Padukuhan Purworejo",
    ttl: "Gunungkidul",
    address: "Purworejo RT 01 RW 02",
    phone: "0896 5088 4813"
  },
  {
    role: "Dukuh Nologaten",
    name: "Hardi",
    scope: "Padukuhan Nologaten",
    ttl: "Gunungkidul",
    address: "Nologaten RT 06 RW 03",
    phone: "-"
  },
  {
    role: "Dukuh Kranggan",
    name: "Prayitno",
    scope: "Padukuhan Kranggan",
    ttl: "Gunungkidul",
    address: "Kranggan RT 02 RW 04",
    phone: "0877 3973 8247"
  },
  {
    role: "Dukuh Jurangjero",
    name: "Nanang Wahyu Kurniawan",
    scope: "Padukuhan Jurangjero",
    ttl: "Gunungkidul",
    address: "Jurangjero RT 04 RW 05",
    phone: "0878 3999 791"
  },
  {
    role: "Dukuh Kaliwuluh",
    name: "Suwardi",
    scope: "Padukuhan Kaliwuluh",
    ttl: "Gunungkidul",
    address: "Kaliwuluh RT 04 RW 06",
    phone: "0812 2808 7830"
  },
  {
    role: "Dukuh Wonosari",
    name: "Gilang Aji Prasetya",
    scope: "Padukuhan Wonosari",
    ttl: "Gunungkidul",
    address: "Wonosari, Jurangjero, Ngawen",
    phone: "-"
  },
  {
    role: "Dukuh Gambarsari",
    name: "Tunggul Sudarwanto",
    scope: "Padukuhan Gambarsari",
    ttl: "Gunungkidul",
    address: "Gambarsari RT 03 RW 08",
    phone: "0821 3702 1681"
  },
  {
    role: "Staf Pamong Kalurahan",
    name: "Triyono",
    scope: "Staf pemerintahan kalurahan",
    ttl: "Gunungkidul, 15 Oktober 1984",
    address: "Jurangjero RT 01 RW 05",
    phone: "0822 2636 0836"
  },
  {
    role: "Staf Pamong Kalurahan",
    name: "Supriyanto",
    scope: "Staf pemerintahan kalurahan",
    ttl: "Gunungkidul",
    address: "Nologaten RT 04 RW 03",
    phone: "0823 2252 0361"
  },
  {
    role: "Staf Pamong Kalurahan",
    name: "Widodo",
    scope: "Staf pemerintahan kalurahan",
    ttl: "Gunungkidul",
    address: "Kaliwuluh RT 06 RW 05",
    phone: "0812 1585 6518"
  }
];

export const villageServices: VillageService[] = [
  {
    title: "Informasi Pembayaran PBB",
    summary:
      "Informasi pengingat dan kanal layanan PBB untuk membantu warga mengurus kewajiban pajak dengan lebih tertib.",
    channel: "Kantor Kalurahan",
    status: "aktif"
  },
  {
    title: "Berita dan Pengumuman Kalurahan",
    summary:
      "Artikel resmi 2026 mencakup apel pamong, Muskalus BLT DD, pembentukan panitia Pilur, dan informasi hewan kurban.",
    channel: "Website resmi desa",
    status: "aktif"
  },
  {
    title: "Pendataan UMKM dan Kelompok Ekonomi",
    summary:
      "Etalase produk warga yang mempertemukan pembeli dengan pelaku UMKM Jurangjero secara langsung.",
    channel: "Etalase UMKM Jurang Jero Digital",
    status: "aktif"
  }
];

export const umkms: Umkm[] = [
  {
    id: "ibu-pare-sido-maju",
    name: "Ibu Pare Snack Sido Maju",
    tagline: "Keripik tales gurih dan aneka snack rumahan dari Jambu.",
    category: "Kuliner",
    rating: 0,
    productCount: 5,
    cover: ibuPareCover,
    story:
      "Dari dapur rumahan di Jambu, Ibu Pare menyiapkan camilan yang dekat dengan keseharian warga: renyah, gurih, mudah dibawa, dan cocok untuk suguhan keluarga maupun acara kecil.",
    history:
      "Ibu Pare Snack Sido Maju tumbuh dari tradisi produksi rumahan di Jambu, Jurangjero. Usaha ini dikenal melalui Keripik Tales Gurih dan aneka snack yang disiapkan untuk kebutuhan harian, suguhan tamu, sampai pesanan acara warga.",
    specialty: "Keripik Tales Gurih 200 gram",
    bestFor: ["Suguhan rapat", "Oleh-oleh lokal", "Stok snack keluarga"],
    highlights: [
      "Produk utama keripik tales dengan karakter gurih dan renyah.",
      "Pilihan snack kering dan jajanan basah memberi ruang pesanan yang fleksibel.",
      "Kemasan berlabel membuat produk mudah dikenali sebagai oleh-oleh lokal Jurangjero."
    ],
    process: [
      {
        title: "Bahan dipilih",
        text: "Bahan snack disiapkan dalam skala rumahan agar produksi tetap luwes mengikuti pesanan."
      },
      {
        title: "Diolah bertahap",
        text: "Keripik dan jajanan dibuat dalam batch kecil supaya tekstur produk tetap terjaga."
      },
      {
        title: "Dikemas untuk dijual",
        text: "Produk kering masuk plastik berlabel, siap difoto, dicatat stoknya, dan dipasarkan lewat WhatsApp."
      }
    ],
    owner: "Ibu Pare / Sido Maju",
    ownerStory:
      "Kekuatan Ibu Pare ada pada rasa yang akrab dan format produk yang praktis. Pembeli bisa memesan untuk stok rumah, sajian rapat, hantaran sederhana, atau oleh-oleh khas dari Jambu.",
    whatsapp: "6282134083720",
    hamletId: "jambu",
    gallery: [
      ibuPareCover,
      ibuPareKeripikTales,
      ibuPareSnackKering,
      ibuPareKueBasah,
      ibuPareKemasan
    ],
    locationNote:
      "Rumah produksi Ibu Pare berada di wilayah Jambu, Jurangjero, Ngawen, Gunungkidul. Untuk arahan lokasi dan pemesanan, pembeli dapat langsung menghubungi WhatsApp.",
    verified: true,
    sourceNote:
      "Pesanan Ibu Pare dapat dikonfirmasi melalui WhatsApp. Produk tersedia mengikuti jadwal produksi dan kebutuhan pesanan.",
    testimonials: [
      {
        name: "Suguhan Acara",
        quote:
          "Pilihan snack-nya cocok untuk suguhan rapat, arisan, atau acara keluarga."
      },
      {
        name: "Camilan Rumah",
        quote:
          "Keripik talesnya ringan untuk dinikmati sehari-hari dan praktis dibawa sebagai oleh-oleh."
      }
    ],
    products: [
      {
        id: "ibu-pare-keripik-tales",
        umkmId: "ibu-pare-sido-maju",
        name: "Keripik Tales Gurih 200g",
        category: "Kuliner",
        price: 15000,
        popularity: 96,
        image: ibuPareKeripikTales,
        shortNote:
          "Camilan renyah dengan rasa gurih, cocok untuk stok rumah dan oleh-oleh."
      },
      {
        id: "ibu-pare-snack-gurih",
        umkmId: "ibu-pare-sido-maju",
        name: "Snack Gurih Rumahan",
        category: "Kuliner",
        price: 0,
        popularity: 86,
        image: ibuPareCover,
        shortNote: "Pilihan camilan gurih untuk suguhan santai dan pesanan acara."
      },
      {
        id: "ibu-pare-snack-kering",
        umkmId: "ibu-pare-sido-maju",
        name: "Aneka Snack Kering",
        category: "Kuliner",
        price: 0,
        popularity: 82,
        image: ibuPareSnackKering,
        shortNote: "Camilan kering untuk suguhan, acara warga, dan stok rumah."
      },
      {
        id: "ibu-pare-kue-basah",
        umkmId: "ibu-pare-sido-maju",
        name: "Aneka Kue Basah",
        category: "Kuliner",
        price: 0,
        popularity: 74,
        image: ibuPareKueBasah,
        shortNote: "Varian jajanan warna-warni; cocok untuk pesanan acara kecil."
      },
      {
        id: "ibu-pare-paket-snack",
        umkmId: "ibu-pare-sido-maju",
        name: "Paket Snack Pesanan",
        category: "Kuliner",
        price: 0,
        popularity: 78,
        image: ibuPareKemasan,
        shortNote:
          "Paket camilan untuk kebutuhan rapat, arisan, hantaran, atau acara keluarga."
      }
    ]
  },
  {
    id: "al-husna-cokelat-karakter",
    name: "Cokelat Karakter Al Husna",
    tagline: "Cokelat karakter, lollipop, dan hampers kecil yang terasa personal.",
    category: "Kuliner",
    rating: 0,
    productCount: 5,
    cover: alHusnaCover,
    story:
      "Al Husna membuat cokelat karakter dengan visual cerah: kotak kecil berpita, lollipop karakter, tray isi banyak, dan display untuk momen hadiah. Produk ini cocok untuk ulang tahun anak, souvenir, hampers kecil, dan pesanan tematik.",
    history:
      "Al Husna hadir sebagai UMKM kreatif yang mengubah cokelat menjadi hadiah kecil yang personal. Setiap produk menonjolkan warna, karakter, dan kemasan yang rapi untuk momen ulang tahun, souvenir, atau hantaran.",
    specialty: "Cokelat karakter custom",
    bestFor: ["Ulang tahun", "Souvenir anak", "Hampers kecil", "Hadiah personal"],
    highlights: [
      "Visual produk sangat fotogenik untuk marketplace dan media sosial.",
      "Pesanan dapat diarahkan mengikuti tema warna, karakter, dan kebutuhan acara.",
      "Format produk beragam: box, lollipop, display, dan tray isi banyak."
    ],
    process: [
      {
        title: "Tema dipilih",
        text: "Pembeli memilih karakter, warna, dan format kemasan sesuai acara."
      },
      {
        title: "Cokelat dibentuk",
        text: "Produk mengandalkan detail kecil, warna cerah, dan bentuk karakter yang rapi."
      },
      {
        title: "Dikemas sebagai hadiah",
        text: "Box berpita dan tray isi banyak membuat produk siap tampil sebagai souvenir atau hampers."
      }
    ],
    owner: "Al Husna",
    ownerStory:
      "Al Husna punya kekuatan visual yang berbeda dari UMKM snack biasa. Produk ini tidak hanya dijual sebagai makanan, tetapi sebagai pengalaman memberi: warna, karakter, kemasan, dan rasa personal menjadi nilai utamanya.",
    whatsapp: "628563099138",
    hamletId: "jurangjero",
    gallery: [
      alHusnaCover,
      alHusnaLollipop,
      alHusnaDisplay,
      alHusnaRoundpop,
      alHusnaTray
    ],
    locationNote:
      "Lokasi Al Husna memakai tautan Google Maps yang diberikan langsung oleh pemilik data. Titik visual pada SVG masih berupa penanda padukuhan, sedangkan rute detail dibuka melalui Google Maps.",
    mapsUrl: "https://maps.app.goo.gl/AN2c6YF3UyC4rZyw5",
    verified: true,
    sourceNote:
      "Pesanan Al Husna dapat dikonfirmasi melalui WhatsApp. Pilihan tema, jumlah, dan waktu pengerjaan menyesuaikan kebutuhan acara.",
    testimonials: [
      {
        name: "Souvenir Anak",
        quote:
          "Bentuk karakternya menarik untuk ulang tahun anak dan souvenir kecil yang berkesan."
      },
      {
        name: "Pesanan Custom",
        quote:
          "Pilihan warna, bentuk, dan kemasan membuat produk terasa lebih personal."
      }
    ],
    products: [
      {
        id: "al-husna-mini-box",
        umkmId: "al-husna-cokelat-karakter",
        name: "Mini Box Cokelat Karakter",
        category: "Kuliner",
        price: 0,
        popularity: 95,
        image: alHusnaCover,
        shortNote: "Kotak kecil berpita dengan isi karakter campuran."
      },
      {
        id: "al-husna-lollipop-karakter",
        umkmId: "al-husna-cokelat-karakter",
        name: "Lollipop Cokelat Karakter",
        category: "Kuliner",
        price: 0,
        popularity: 92,
        image: alHusnaLollipop,
        shortNote: "Pilihan karakter untuk souvenir dan ulang tahun anak."
      },
      {
        id: "al-husna-display-party",
        umkmId: "al-husna-cokelat-karakter",
        name: "Display Party Karakter",
        category: "Kuliner",
        price: 0,
        popularity: 84,
        image: alHusnaDisplay,
        shortNote: "Display berdiri untuk meja acara, ulang tahun, atau hantaran."
      },
      {
        id: "al-husna-roundpop",
        umkmId: "al-husna-cokelat-karakter",
        name: "Round Pop Tema Karakter",
        category: "Kuliner",
        price: 0,
        popularity: 88,
        image: alHusnaRoundpop,
        shortNote: "Cokelat bulat bertema karakter dengan warna cerah."
      },
      {
        id: "al-husna-tray-custom",
        umkmId: "al-husna-cokelat-karakter",
        name: "Tray Custom Isi Banyak",
        category: "Kuliner",
        price: 0,
        popularity: 90,
        image: alHusnaTray,
        shortNote: "Tray untuk pesanan lebih banyak; cocok sebagai souvenir."
      }
    ]
  },
  {
    id: "rhiens-cookies",
    name: "Rhiens Cookies",
    tagline: "Cookies toples, brownies, bolu, dan cake custom untuk hantaran yang rapi.",
    category: "Kuliner",
    rating: 0,
    productCount: 5,
    cover: rhiensCover,
    story:
      "Rhiens Cookies membawa nuansa bakery rumahan yang matang secara visual: cookies toples berlabel, brownies dalam box, bolu keju, dan cake custom untuk momen ulang tahun maupun hantaran keluarga.",
    history:
      "Rhiens Cookies tumbuh dari produksi kue rumahan yang fleksibel mengikuti kebutuhan pembeli. Kekuatan utamanya ada pada pilihan produk yang luas: camilan kering, dessert box, bolu, brownies, sampai cake dekoratif yang bisa dibuat sesuai tema acara.",
    specialty: "Cookies toples dan cake custom",
    bestFor: ["Hampers keluarga", "Ulang tahun", "Suguhan tamu", "Pesanan acara"],
    highlights: [
      "Foto produk kuat untuk katalog karena kemasan, label, dan variasi kue terlihat jelas.",
      "Pilihan produk tidak monoton: ada cookies, brownies, bolu, dan cake custom.",
      "Cocok untuk pembeli yang mencari kue siap hadiah atau suguhan acara."
    ],
    process: [
      {
        title: "Pilih kebutuhan",
        text: "Pembeli menentukan jenis produk: cookies toples, brownies, bolu, atau cake custom."
      },
      {
        title: "Konfirmasi tema",
        text: "Untuk cake dan hantaran, detail tema, tulisan, ukuran, dan jadwal dibuat jelas sebelum produksi."
      },
      {
        title: "Dikemas rapi",
        text: "Produk masuk box, toples, atau kemasan hantaran agar siap diberikan atau disajikan."
      }
    ],
    owner: "Rhiens Cookies",
    ownerStory:
      "Rhiens Cookies terasa kuat karena produknya siap masuk dua kebutuhan sekaligus: camilan harian dan pesanan acara. Dari toples cookies sampai cake personal, semuanya dibuat agar pembeli mudah memilih sesuai momen.",
    whatsapp: "6281806633263",
    hamletId: "jurangjero",
    gallery: [
      rhiensCover,
      rhiensCookiesJar,
      rhiensBrownies,
      rhiensCustomCake,
      rhiensBoluKeju
    ],
    locationNote:
      "Lokasi Rhiens Cookies tersedia melalui Google Maps yang diberikan pemilik data. Untuk pesanan dan arahan titik yang paling akurat, pembeli dapat menghubungi WhatsApp terlebih dahulu.",
    mapsUrl: "https://maps.app.goo.gl/gcRUeiE41S9vgevZ6",
    verified: true,
    sourceNote:
      "Harga, ukuran, rasa, dan jadwal produksi Rhiens Cookies dikonfirmasi langsung melalui WhatsApp sebelum pemesanan.",
    testimonials: [
      {
        name: "Pesanan Hantaran",
        quote:
          "Kemasan toples dan box membuat produknya siap dijadikan hantaran tanpa perlu banyak tambahan."
      },
      {
        name: "Cake Custom",
        quote:
          "Pilihan cake dan brownies cocok untuk ulang tahun, syukuran, atau acara keluarga."
      }
    ],
    products: [
      {
        id: "rhiens-cookies-toples",
        umkmId: "rhiens-cookies",
        name: "Cookies Toples Rhiens",
        category: "Kuliner",
        price: 0,
        popularity: 96,
        image: rhiensCookiesJar,
        shortNote:
          "Aneka cookies dalam toples berlabel, cocok untuk hampers dan suguhan tamu."
      },
      {
        id: "rhiens-brownies-box",
        umkmId: "rhiens-cookies",
        name: "Brownies Box Topping",
        category: "Kuliner",
        price: 0,
        popularity: 92,
        image: rhiensBrownies,
        shortNote:
          "Brownies potong dengan topping almond, kacang, dan cokelat dalam kemasan box."
      },
      {
        id: "rhiens-custom-cake",
        umkmId: "rhiens-cookies",
        name: "Cake Custom Tema Acara",
        category: "Kuliner",
        price: 0,
        popularity: 90,
        image: rhiensCustomCake,
        shortNote:
          "Cake dekoratif untuk ulang tahun, syukuran, atau hadiah personal."
      },
      {
        id: "rhiens-bolu-keju",
        umkmId: "rhiens-cookies",
        name: "Bolu Keju",
        category: "Kuliner",
        price: 0,
        popularity: 84,
        image: rhiensBoluKeju,
        shortNote:
          "Bolu lembut dengan topping keju, tersedia utuh atau potong sesuai pesanan."
      },
      {
        id: "rhiens-dessert-box",
        umkmId: "rhiens-cookies",
        name: "Dessert Box Rhiens",
        category: "Kuliner",
        price: 0,
        popularity: 88,
        image: rhiensCover,
        shortNote:
          "Dessert dalam box yang rapi untuk hadiah kecil, acara, dan pesanan keluarga."
      }
    ]
  },
  {
    id: "cita-pawon",
    name: "Cita Pawon",
    tagline: "Aneka kue lezat untuk acara spesial, hampers, dan cemilan keluarga.",
    category: "Kuliner",
    rating: 0,
    productCount: 5,
    cover: citaPawonCover,
    story:
      "Cita Pawon bermain di wilayah rasa yang akrab: snack tampah, brownies, fruit tart, jajanan warna-warni, dan paket kue untuk acara keluarga. Tampilannya hangat, penuh warna, dan mudah dibayangkan sebagai suguhan meja.",
    history:
      "Cita Pawon hadir sebagai dapur pesanan yang menyiapkan aneka kue untuk kebutuhan spesial. Dari cemilan ringan sampai platter acara, produknya dirancang agar pembeli bisa memilih sajian yang praktis tanpa kehilangan rasa rumahan.",
    specialty: "Snack platter dan aneka kue pesanan",
    bestFor: ["Acara keluarga", "Hampers", "Rapat warga", "Cemilan rumah"],
    highlights: [
      "Snack platter tampil kuat sebagai produk utama karena terlihat penuh, rapi, dan siap acara.",
      "Brownies dan fruit tart memberi pilihan manis yang lebih modern.",
      "Aneka kue warna-warni membuat katalog terasa hidup dan ramah untuk pembeli HP."
    ],
    process: [
      {
        title: "Pilih paket",
        text: "Pembeli dapat memilih snack platter, brownies, fruit tart, atau aneka kue sesuai kebutuhan."
      },
      {
        title: "Sesuaikan jumlah",
        text: "Jumlah porsi dan waktu pengambilan dikonfirmasi lewat WhatsApp agar produksi lebih tepat."
      },
      {
        title: "Disiapkan untuk acara",
        text: "Produk dikemas dalam tampah, box, atau wadah hantaran supaya siap disajikan."
      }
    ],
    owner: "Cita Pawon",
    ownerStory:
      "Cita Pawon punya karakter hangat: produk yang terlihat dekat dengan acara keluarga, arisan, rapat kecil, dan hantaran. Kekuatan utamanya ada pada variasi, warna, dan format sajian yang langsung siap dipakai.",
    whatsapp: "62895320372055",
    hamletId: "jurangjero",
    gallery: [
      citaPawonCover,
      citaPawonBrownies,
      citaPawonAnekaKue,
      citaPawonFruitTart,
      citaPawonSnackPlatter
    ],
    locationNote:
      "Lokasi detail Cita Pawon dapat dikonfirmasi langsung melalui WhatsApp saat pemesanan. Pesanan sebaiknya dikomunikasikan lebih awal agar jadwal produksi dan jumlah porsi bisa disiapkan.",
    verified: true,
    sourceNote:
      "Harga, isi paket, dan jadwal produksi Cita Pawon menyesuaikan jenis pesanan. Konfirmasi detail melalui WhatsApp sebelum memesan.",
    testimonials: [
      {
        name: "Suguhan Acara",
        quote:
          "Snack platter terlihat penuh dan rapi, cocok untuk acara keluarga atau rapat kecil."
      },
      {
        name: "Hampers Manis",
        quote:
          "Fruit tart dan brownies membuat pilihan kue terasa lebih variatif dan cantik."
      }
    ],
    products: [
      {
        id: "cita-pawon-snack-platter",
        umkmId: "cita-pawon",
        name: "Snack Platter Acara",
        category: "Kuliner",
        price: 0,
        popularity: 94,
        image: citaPawonCover,
        shortNote:
          "Susunan snack gurih dan manis dalam tampah, cocok untuk acara keluarga."
      },
      {
        id: "cita-pawon-brownies",
        umkmId: "cita-pawon",
        name: "Brownies Topping",
        category: "Kuliner",
        price: 0,
        popularity: 90,
        image: citaPawonBrownies,
        shortNote:
          "Brownies potong dengan topping cokelat, almond, dan keju."
      },
      {
        id: "cita-pawon-aneka-kue",
        umkmId: "cita-pawon",
        name: "Aneka Kue Warna-warni",
        category: "Kuliner",
        price: 0,
        popularity: 86,
        image: citaPawonAnekaKue,
        shortNote:
          "Pilihan kue manis berwarna untuk cemilan, hantaran, dan suguhan."
      },
      {
        id: "cita-pawon-fruit-tart",
        umkmId: "cita-pawon",
        name: "Fruit Tart Hampers",
        category: "Kuliner",
        price: 0,
        popularity: 88,
        image: citaPawonFruitTart,
        shortNote:
          "Mini tart buah dalam wadah hantaran, tampil segar dan siap diberikan."
      },
      {
        id: "cita-pawon-paket-cemilan",
        umkmId: "cita-pawon",
        name: "Paket Cemilan Cita Pawon",
        category: "Kuliner",
        price: 0,
        popularity: 82,
        image: citaPawonSnackPlatter,
        shortNote:
          "Paket cemilan untuk rapat, arisan, syukuran, atau kebutuhan keluarga."
      }
    ]
  },
  {
    id: "keset-kain-jurangjero",
    name: "UMKM Keset Kain Jurangjero",
    tagline: "Keset kain jahit dengan motif rapi, kuat, dan dibuat langsung di rumah produksi.",
    category: "Kerajinan",
    rating: 0,
    productCount: 4,
    cover: kesetCover,
    story:
      "Dari ruang kerja sederhana, usaha keset kain ini memperlihatkan proses yang dekat dan nyata: kain dipotong, pola disusun, pinggiran dirapikan, lalu setiap bagian dijahit satu per satu sampai menjadi keset yang siap dipakai di rumah.",
    history:
      "UMKM keset kain Jurangjero tumbuh dari keterampilan menjahit dan pemanfaatan bahan kain menjadi produk rumah tangga. Dokumentasi produksi menunjukkan pemilik mengerjakan detail keset langsung di mesin jahit, mulai dari susunan warna, lapisan alas, sampai rumbai tepi yang menjadi ciri visual produknya.",
    specialty: "Keset kain oval jahit",
    bestFor: ["Rumah tangga", "Pesanan warna", "Hadiah praktis", "Stok toko kecil"],
    highlights: [
      "Foto proses menjahit membuat cerita usaha terasa kuat dan bisa dipercaya.",
      "Produk punya bentuk oval, lapisan bertekstur, dan kombinasi warna yang mudah dikenali.",
      "Cocok untuk kebutuhan harian rumah, pesanan warna tertentu, maupun stok jualan kecil."
    ],
    process: [
      {
        title: "Bahan dipilih",
        text: "Kain dan bahan alas disiapkan lalu dipilah sesuai warna, tekstur, dan kebutuhan pesanan."
      },
      {
        title: "Pola disusun",
        text: "Bentuk oval, lapisan dasar, dan susunan rumbai tepi ditata sebelum masuk ke proses jahit."
      },
      {
        title: "Dijahit bertahap",
        text: "Setiap bagian dirapikan di mesin jahit agar bentuk keset kuat dan nyaman dipakai."
      },
      {
        title: "Produk siap jual",
        text: "Keset yang selesai ditumpuk, dicek bentuknya, lalu disiapkan untuk pembeli atau pesanan berikutnya."
      }
    ],
    owner: "Bapak Pengrajin Keset Jurangjero",
    ownerStory:
      "Nilai utama usaha ini ada pada ketekunan tangan pemiliknya. Foto bapak saat memegang keset dan menjahit memperlihatkan bahwa produk dibuat langsung, bukan sekadar barang titipan. Detail kecil seperti rumbai, pola warna, dan jahitan tepi menjadi bagian dari karakter produknya.",
    whatsapp: "",
    hamletId: "jurangjero",
    gallery: [
      kesetCover,
      kesetMenjahit,
      kesetProduksi,
      kesetJadi,
      kesetDetailBelakang,
      kesetBahan
    ],
    locationNote:
      "Usaha keset kain ini terdokumentasi di wilayah Jurangjero. Nomor pemesanan dan alamat detail belum ditambahkan, sehingga pembeli perlu menghubungi admin desa atau pengelola data UMKM untuk konfirmasi lanjutan.",
    verified: false,
    sourceNote:
      "Foto dan cerita disusun dari dokumentasi lapangan 4 Juli 2026. Harga, ukuran, warna, dan kontak pemesanan perlu dilengkapi oleh admin sebelum publikasi transaksi penuh.",
    testimonials: [
      {
        name: "Produk Rumah Tangga",
        quote:
          "Keset kain seperti ini mudah dipakai untuk kebutuhan harian karena bentuknya sederhana dan fungsional."
      },
      {
        name: "Kerajinan Jahit",
        quote:
          "Proses menjahit langsung memberi nilai lebih karena pembeli bisa melihat kerja tangan di balik produknya."
      }
    ],
    products: [
      {
        id: "keset-oval-ruffle",
        umkmId: "keset-kain-jurangjero",
        name: "Keset Oval Ruffle",
        category: "Kerajinan",
        price: 0,
        popularity: 91,
        image: kesetJadi,
        shortNote:
          "Keset oval dengan tepi berumbai dan kombinasi warna yang cocok untuk area rumah."
      },
      {
        id: "keset-motif-kain-perca",
        umkmId: "keset-kain-jurangjero",
        name: "Keset Motif Kain Perca",
        category: "Kerajinan",
        price: 0,
        popularity: 88,
        image: kesetDetailBelakang,
        shortNote:
          "Lapisan bawah memakai susunan kain bermotif, memberi karakter berbeda pada tiap keset."
      },
      {
        id: "keset-jahit-pesanan",
        umkmId: "keset-kain-jurangjero",
        name: "Keset Jahit Pesanan",
        category: "Kerajinan",
        price: 0,
        popularity: 86,
        image: kesetMenjahit,
        shortNote:
          "Dikerjakan langsung di mesin jahit, cocok untuk pesanan bentuk dan warna tertentu."
      },
      {
        id: "keset-warna-custom",
        umkmId: "keset-kain-jurangjero",
        name: "Keset Warna Custom",
        category: "Kerajinan",
        price: 0,
        popularity: 84,
        image: kesetCover,
        shortNote:
          "Pilihan warna dan tepi keset dapat disesuaikan mengikuti bahan yang tersedia."
      }
    ]
  }
];

export const products: Product[] = umkms.flatMap((umkm) => umkm.products);

export const tourismSpots: TourismSpot[] = [
  {
    id: "masjid-tiban",
    name: "Masjid Tiban",
    hamletId: "jurangjero",
    image: wisataCover,
    summary: "Titik wisata/budaya yang muncul pada menu artikel resmi desa.",
    detail:
      "Masjid Tiban menjadi bagian dari kekayaan religi dan budaya Jurangjero. Tempat ini dapat dikenalkan sebagai titik cerita desa yang menyatukan sejarah, ruang ibadah, dan kehidupan warga.",
    bestTime: "Pagi / sore",
    highlight: "wisata budaya"
  },
  {
    id: "gunung-gambar",
    name: "Gunung Gambar",
    hamletId: "gambarsari",
    image: wisataCover,
    summary: "Ruang budaya yang terkait dengan kegiatan Sadranan Gunung Gambar 2026.",
    detail:
      "Gunung Gambar lekat dengan agenda budaya warga. Cerita sadranan, lanskap, dan ingatan kolektif masyarakat menjadikannya titik penting dalam narasi Jurangjero.",
    bestTime: "Agenda budaya",
    highlight: "sadranan"
  },
  {
    id: "jalur-padukuhan",
    name: "Jalur Jelajah Padukuhan",
    hamletId: "jurangjero",
    image: heroCover,
    summary: "Rute digital untuk menghubungkan kantor kalurahan, padukuhan, UMKM, dan titik budaya.",
    detail:
      "Jalur ini menghubungkan kantor kalurahan, padukuhan, UMKM, dan titik budaya agar pengunjung dapat membaca Jurangjero sebagai satu pengalaman utuh.",
    bestTime: "Pagi / sore",
    highlight: "peta digital"
  }
];

export const citizenStories: CitizenStory[] = [
  {
    id: "warga-jurangjero",
    name: "Warga Jurangjero",
    role: "Ruang cerita",
    quote:
      "Desa terasa hidup ketika produk warga, cerita padukuhan, dan layanan publik bisa ditemukan dalam satu tempat.",
    status: "Tayang",
    createdAt: "2026-07-05"
  },
  {
    id: "pengelola-desa",
    name: "Pengelola Desa",
    role: "Pelayanan publik",
    quote:
      "Informasi yang rapi membuat warga lebih mudah menemukan kabar, agenda, dan layanan desa.",
    status: "Tayang",
    createdAt: "2026-07-05"
  },
  {
    id: "pelaku-umkm",
    name: "Pelaku UMKM",
    role: "Etalase produk",
    quote:
      "Katalog yang baik bukan hanya cantik, tetapi jelas: nama usaha, kontak, produk, harga, dan lokasi.",
    status: "Tayang",
    createdAt: "2026-07-05"
  }
];

export const impactMetrics = [
  { label: "Penduduk terdata", value: 4939, suffix: "" },
  { label: "Produk UMKM", value: products.length, suffix: "" },
  { label: "UMKM pilihan", value: umkms.length, suffix: "" },
  { label: "Padukuhan", value: 8, suffix: "" }
];

export const officialArticles: OfficialArticle[] = [
  {
    id: "hewan-kurban-2026",
    title: "Pemantauan Hewan Kurban 2026",
    date: "2026-06-04",
    category: "Berita",
    summary:
      "Artikel resmi memuat kegiatan pemantauan hewan kurban di Kalurahan Jurangjero.",
    url: officialSources.website
  },
  {
    id: "muskalus-blt-2026",
    title: "Muskalus BLT DD 2026",
    date: "2026-05-28",
    category: "Acara",
    summary: "Musyawarah kalurahan khusus terkait BLT Dana Desa tahun 2026.",
    url: officialSources.website
  },
  {
    id: "kwt-ngudi-rejeki",
    title: "KWT Ngudi Rejeki Purworejo",
    date: "2026-05-22",
    category: "Ekonomi",
    summary:
      "Artikel resmi yang menjadi dasar awal pendataan kelompok ekonomi Purworejo.",
    url: officialSources.website
  },
  {
    id: "sadranan-gunung-gambar",
    title: "Sadranan Gunung Gambar 2026",
    date: "2026-05-16",
    category: "Budaya",
    summary: "Agenda budaya desa yang memperkuat identitas dan cerita warga.",
    url: officialSources.website
  }
];

export const newsItems: NewsItem[] = [
  {
    id: "hewan-kurban-2026",
    type: "Berita",
    title: "Pemantauan Hewan Kurban 2026",
    date: "2026-06-04",
    excerpt:
      "Diambil dari daftar berita resmi Kalurahan Jurangjero, sebagai contoh sinkronisasi kabar desa."
  },
  {
    id: "muskalus-blt-2026",
    type: "Acara",
    title: "Muskalus BLT DD 2026",
    date: "2026-05-28",
    excerpt:
      "Agenda resmi terkait musyawarah kalurahan khusus BLT Dana Desa tahun 2026."
  },
  {
    id: "kurasi-umkm-ibu-pare-al-husna",
    type: "Pengumuman",
    title: "Kurasi UMKM Jurangjero",
    date: "2026-07-05",
    excerpt:
      "Etalase UMKM diperbarui dengan usaha kuliner dan kerajinan keset kain lengkap dengan foto produk, katalog, cerita pemilik, dan titik peta."
  }
];

export const galleryItems: GalleryItem[] = [
  { id: "rapat-warga-kalurahan", src: rapatKalurahan, title: "Rapat Warga Kalurahan", type: "Kegiatan" },
  { id: "lanskap-jurangjero", src: heroCover, title: "Lanskap Jurangjero", type: "Lanskap" },
  { id: "keripik-tales-ibu-pare", src: ibuPareKeripikTales, title: "Keripik Tales Ibu Pare", type: "UMKM" },
  { id: "mini-box-al-husna", src: alHusnaCover, title: "Mini Box Al Husna", type: "UMKM" },
  { id: "rhiens-cookies-toples", src: rhiensCookiesJar, title: "Cookies Toples Rhiens", type: "UMKM" },
  { id: "cita-pawon-platter", src: citaPawonCover, title: "Snack Platter Cita Pawon", type: "UMKM" },
  { id: "keset-kain-jurangjero", src: kesetCover, title: "Keset Kain Jurangjero", type: "Kerajinan" },
  { id: "aneka-jajanan-ibu-pare", src: ibuPareKueBasah, title: "Aneka Jajanan Ibu Pare", type: "Kuliner" },
  { id: "lollipop-karakter-al-husna", src: alHusnaLollipop, title: "Lollipop Karakter Al Husna", type: "Cokelat" },
  { id: "rhiens-custom-cake", src: rhiensCustomCake, title: "Cake Custom Rhiens", type: "Bakery" },
  { id: "cita-pawon-brownies", src: citaPawonBrownies, title: "Brownies Cita Pawon", type: "Kuliner" },
  { id: "potensi-budaya-alam", src: wisataCover, title: "Potensi Budaya dan Alam", type: "Wisata" },
  { id: "rute-padukuhan", src: wisataCover, title: "Rute Padukuhan", type: "Peta" }
];

export const ageDistribution: ChartDatum[] = [
  { name: "0-14", value: 865 },
  { name: "15-29", value: 1010 },
  { name: "30-44", value: 1155 },
  { name: "45-59", value: 1087 },
  { name: "60+", value: 822 }
];

export const occupationDistribution: ChartDatum[] = [
  { name: "Petani", value: 1260 },
  { name: "Wiraswasta", value: 690 },
  { name: "Pelajar", value: 805 },
  { name: "Karyawan", value: 540 },
  { name: "Lainnya", value: 1644 }
];

export const populationByHamlet: ChartDatum[] = hamlets.map((hamlet) => ({
  name: hamlet.name,
  value: hamlet.population
}));

export const familiesByHamlet: ChartDatum[] = hamlets.map((hamlet) => ({
  name: hamlet.name,
  value: hamlet.families
}));
