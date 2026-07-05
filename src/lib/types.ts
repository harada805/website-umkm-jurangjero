export type HamletId =
  | "gambarsari"
  | "jambu"
  | "jurangjero"
  | "kaliwuluh"
  | "kranggan"
  | "nologaten"
  | "purworejo"
  | "wonosari";

export type ProductCategory =
  | "Kuliner"
  | "Kerajinan"
  | "Fashion"
  | "Agro"
  | "Minuman"
  | "Herbal";

export type PriceFilter = "all" | "under25" | "25to75" | "above75";

export type AdminRole = "Super Admin" | "Admin Konten" | "Admin UMKM" | "Viewer";

export interface AdminUser {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "Aktif" | "Nonaktif";
  passwordReady: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUmkmRecord {
  id: string;
  name: string;
  category: ProductCategory;
  whatsapp: string;
  productCount: number;
  hamletId: HamletId;
  status: "Aktif" | "Draft";
  createdAt?: string;
  updatedAt?: string;
}

export interface Hamlet {
  id: HamletId;
  name: string;
  population: number;
  families: number;
  rt: number;
  male: number;
  female: number;
  umkmCount: number;
  tourismCount: number;
  signature: string;
  summary: string;
  mapPath: string;
  centroid: { lat: number; lng: number };
  mapPoints: MapPoint[];
}

export interface MapPoint {
  id: string;
  name: string;
  type: "Kantor" | "UMKM" | "Wisata" | "Fasilitas" | "Budaya" | "Layanan";
  x: number;
  y: number;
  description: string;
  status?: "resmi" | "perlu-verifikasi";
}

export interface Product {
  id: string;
  umkmId: string;
  name: string;
  category: ProductCategory;
  price: number;
  popularity: number;
  image: string;
  shortNote: string;
}

export interface Testimonial {
  name: string;
  quote: string;
}

export interface Umkm {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  rating: number;
  productCount: number;
  cover: string;
  story: string;
  history: string;
  specialty: string;
  bestFor: string[];
  highlights: string[];
  process: { title: string; text: string }[];
  owner: string;
  ownerStory: string;
  whatsapp: string;
  hamletId: HamletId;
  gallery: string[];
  products: Product[];
  testimonials: Testimonial[];
  locationNote: string;
  mapsUrl?: string;
  verified: boolean;
  sourceNote: string;
}

export interface TourismSpot {
  id: string;
  name: string;
  hamletId: HamletId;
  image: string;
  summary: string;
  detail: string;
  bestTime: string;
  highlight: string;
}

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  type: string;
  createdAt?: string;
}

export interface NewsItem {
  id: string;
  type: "Berita" | "Pengumuman" | "Acara";
  title: string;
  date: string;
  excerpt: string;
}

export type CitizenStoryStatus = "Tayang" | "Draft";

export interface CitizenStory {
  id?: string;
  name: string;
  role: string;
  quote: string;
  status?: CitizenStoryStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CitizenStoryRecord extends CitizenStory {
  id: string;
  status: CitizenStoryStatus;
  createdAt: string;
}

export interface ChartDatum {
  name: string;
  value: number;
}

export interface OrganizationMember {
  role: string;
  name: string;
  scope: string;
  ttl?: string;
  address?: string;
  phone?: string;
}

export interface VillageService {
  title: string;
  summary: string;
  channel: string;
  status: "aktif" | "butuh-verifikasi";
}

export interface OfficialArticle {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  url: string;
}
