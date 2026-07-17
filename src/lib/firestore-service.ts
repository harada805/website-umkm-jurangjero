import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
  type DocumentData,
  type Unsubscribe
} from "firebase/firestore";
import { db, hasFirebaseConfig } from "./firebase";
import {
  citizenStories,
  galleryItems,
  hamlets,
  newsItems,
  occupationDistribution,
  populationByHamlet,
  tourismSpots,
  umkms,
  villageIdentity
} from "./data";
import type {
  AdminUmkmRecord,
  AdminUser,
  CitizenStoryRecord,
  GalleryItem,
  Hamlet,
  HamletId,
  NewsItem,
  Product,
  ProductCategory,
  TourismSpot,
  Umkm
} from "./types";

export const firestoreCollections = {
  adminUsers: "admin_users",
  umkms: "umkms",
  news: "news",
  events: "events",
  citizenStories: "citizen_stories",
  tourismSpots: "tourism_spots",
  galleryItems: "gallery_items",
  hamlets: "hamlets",
  villageStats: "village_stats",
  auditLogs: "audit_logs"
} as const;

export function isFirestoreReady() {
  return hasFirebaseConfig;
}

function requireFirestore() {
  if (!hasFirebaseConfig) {
    throw new Error("Firebase belum dikonfigurasi. Isi .env.local terlebih dahulu.");
  }
}

function cleanUndefined<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as T;
}

function numberOrFallback(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const productCategories: ProductCategory[] = [
  "Kuliner",
  "Kerajinan",
  "Fashion",
  "Agro",
  "Minuman",
  "Herbal"
];

const defaultProductByCategory: Record<ProductCategory, string> = {
  Kuliner: "Produk rumahan",
  Kerajinan: "Produk kerajinan",
  Fashion: "Produk fashion",
  Agro: "Produk hasil tani",
  Minuman: "Produk minuman",
  Herbal: "Produk herbal"
};

function normalizeCategory(value: unknown): ProductCategory {
  return productCategories.includes(value as ProductCategory)
    ? (value as ProductCategory)
    : "Kuliner";
}

function normalizeHamletId(value: unknown): HamletId {
  return hamlets.some((hamlet) => hamlet.id === value)
    ? (value as HamletId)
    : "jurangjero";
}

function stringArrayOrFallback(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;

  const strings = value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );

  return strings.length ? strings : fallback;
}

function normalizeProducts(
  value: unknown,
  umkmId: string,
  umkmName: string,
  category: ProductCategory,
  cover: string
): Product[] {
  if (Array.isArray(value) && value.length) {
    return value.map((item, index) => {
      const product = item as Partial<Product>;

      return {
        id: product.id ?? `${umkmId}-produk-${index + 1}`,
        umkmId: product.umkmId ?? umkmId,
        name: product.name ?? `${defaultProductByCategory[category]} ${umkmName}`,
        category: normalizeCategory(product.category ?? category),
        price: numberOrFallback(product.price, 0),
        popularity: numberOrFallback(product.popularity, 64),
        image: product.image ?? cover,
        shortNote:
          product.shortNote ??
          "Hubungi penjual untuk pilihan produk, stok, dan harga terbaru."
      };
    });
  }

  return [
    {
      id: `${umkmId}-produk-utama`,
      umkmId,
      name: defaultProductByCategory[category],
      category,
      price: 0,
      popularity: 64,
      image: cover,
      shortNote: "Hubungi penjual untuk pilihan produk, stok, dan harga terbaru."
    }
  ];
}

export type StoredUmkm = Partial<Umkm & AdminUmkmRecord> & {
  id: string;
};

export function normalizePublicUmkm(item: StoredUmkm): Umkm {
  const category = normalizeCategory(item.category);
  const hamletId = normalizeHamletId(item.hamletId);
  const name = item.name?.trim() || "UMKM Jurangjero";
  const cover = item.cover || "/images/umkm-cover.png";
  const products = normalizeProducts(item.products, item.id, name, category, cover);
  const productCount = Math.max(
    1,
    numberOrFallback(item.productCount, products.length)
  );
  const specialty = item.specialty || products[0]?.name || defaultProductByCategory[category];

  return {
    id: item.id,
    name,
    tagline: item.tagline || `${name} dari Jurangjero.`,
    category,
    rating: numberOrFallback(item.rating, 4.7),
    productCount,
    cover,
    story:
      item.story ||
      `${name} adalah UMKM warga Jurangjero yang menghadirkan produk lokal untuk kebutuhan harian, suguhan keluarga, dan pesanan acara.`,
    history:
      item.history ||
      `${name} tercatat sebagai bagian dari etalase UMKM Jurangjero. Informasi dasar usaha dapat diperbarui oleh admin desa agar pembeli mendapat data yang lebih akurat.`,
    specialty,
    bestFor: stringArrayOrFallback(item.bestFor, [
      "Pesanan warga",
      "Oleh-oleh lokal",
      "Acara keluarga"
    ]),
    highlights: stringArrayOrFallback(item.highlights, [
      "Dikelola oleh warga Jurangjero.",
      "Bisa dihubungi langsung melalui WhatsApp.",
      "Data usaha dapat diperbarui oleh admin desa."
    ]),
    process:
      Array.isArray(item.process) && item.process.length
        ? item.process
        : [
            {
              title: "Pesan",
              text: "Pembeli menghubungi penjual melalui WhatsApp untuk memastikan stok dan kebutuhan."
            },
            {
              title: "Siapkan",
              text: "Penjual menyiapkan produk sesuai pesanan dan jadwal produksi."
            },
            {
              title: "Ambil / Kirim",
              text: "Pengambilan atau pengiriman disesuaikan dengan kesepakatan pembeli dan penjual."
            }
          ],
    owner: item.owner || "Pelaku UMKM Jurangjero",
    ownerStory:
      item.ownerStory ||
      "Usaha ini tumbuh dari kerja rumahan warga dan dipublikasikan agar lebih mudah ditemukan oleh pembeli dari dalam maupun luar desa.",
    whatsapp: item.whatsapp ?? "",
    hamletId,
    gallery: stringArrayOrFallback(item.gallery, [cover]),
    products,
    testimonials:
      Array.isArray(item.testimonials) && item.testimonials.length
        ? item.testimonials
        : [
            {
              name: "Warga Jurangjero",
              quote: "Kontaknya mudah ditemukan, jadi pemesanan bisa langsung dilakukan."
            }
          ],
    locationNote:
      item.locationNote ||
      `UMKM ini berada di wilayah ${hamlets.find((hamlet) => hamlet.id === hamletId)?.name ?? "Jurangjero"}. Hubungi penjual untuk titik lokasi paling akurat.`,
    mapsUrl: item.mapsUrl,
    verified: item.status ? item.status === "Aktif" : item.verified ?? true,
    sourceNote:
      item.sourceNote ||
      "Harga, stok, dan jadwal produksi dapat berubah. Konfirmasi langsung melalui WhatsApp sebelum memesan."
  };
}

function mergeMissingDefaultUmkms(items: Umkm[]) {
  const itemIds = new Set(items.map((item) => item.id));
  const missingDefaults = umkms.filter((umkm) => !itemIds.has(umkm.id));
  return [...items, ...missingDefaults];
}

async function listDocs<T extends { id: string }>(collectionName: string) {
  requireFirestore();
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
}

function subscribeDocs<T extends { id: string }>(
  collectionName: string,
  onItems: (items: T[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  requireFirestore();

  return onSnapshot(
    collection(db, collectionName),
    (snapshot) => {
      onItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T));
    },
    (error) => {
      onError?.(error);
    }
  );
}

async function upsertDoc<T extends { id: string }>(
  collectionName: string,
  item: T
) {
  requireFirestore();
  const { id, ...data } = item;
  await setDoc(
    doc(db, collectionName, id),
    cleanUndefined({
      ...data,
      updatedAt: serverTimestamp()
    } as DocumentData),
    { merge: true }
  );
}

export async function listAdminUsers() {
  return listDocs<AdminUser>(firestoreCollections.adminUsers);
}

export async function saveAdminUser(user: AdminUser) {
  await upsertDoc(firestoreCollections.adminUsers, user);
  await addAuditLog("admin_user_saved", user.id, {
    email: user.email,
    role: user.role,
    status: user.status
  });
}

export async function updateAdminUserStatus(
  id: string,
  status: AdminUser["status"]
) {
  requireFirestore();
  await updateDoc(doc(db, firestoreCollections.adminUsers, id), {
    status,
    updatedAt: serverTimestamp()
  });
  await addAuditLog("admin_user_status_changed", id, { status });
}

export async function deleteAdminUserProfile(id: string) {
  requireFirestore();
  await deleteDoc(doc(db, firestoreCollections.adminUsers, id));
  await addAuditLog("admin_user_deleted", id);
}

export async function listAdminUmkms() {
  return listDocs<AdminUmkmRecord>(firestoreCollections.umkms);
}

export async function listPublicUmkms() {
  const items = await listDocs<StoredUmkm>(firestoreCollections.umkms);
  return mergeMissingDefaultUmkms(
    items
      .filter((item) => item.status !== "Draft")
      .map((item) => normalizePublicUmkm(item))
  );
}

export function subscribePublicUmkms(
  onItems: (items: Umkm[]) => void,
  onError?: (error: unknown) => void
) {
  return subscribeDocs<StoredUmkm>(
    firestoreCollections.umkms,
    (items) => {
      onItems(
        mergeMissingDefaultUmkms(
          items
            .filter((item) => item.status !== "Draft")
            .map((item) => normalizePublicUmkm(item))
        )
      );
    },
    onError
  );
}

export async function saveAdminUmkm(umkm: AdminUmkmRecord) {
  await upsertDoc(firestoreCollections.umkms, umkm);
  await addAuditLog("umkm_saved", umkm.id, {
    name: umkm.name,
    status: umkm.status
  });
}

export async function deleteAdminUmkm(id: string) {
  requireFirestore();
  await deleteDoc(doc(db, firestoreCollections.umkms, id));
  await addAuditLog("umkm_deleted", id);
}

export async function listNewsItems() {
  return listDocs<NewsItem>(firestoreCollections.news);
}

export function subscribeNewsItems(
  onItems: (items: NewsItem[]) => void,
  onError?: (error: unknown) => void
) {
  return subscribeDocs<NewsItem>(firestoreCollections.news, onItems, onError);
}

export async function saveNewsItem(item: NewsItem) {
  await upsertDoc(firestoreCollections.news, item);
  await addAuditLog("news_saved", item.id, {
    title: item.title,
    type: item.type
  });
}

export async function deleteNewsItem(id: string) {
  requireFirestore();
  await deleteDoc(doc(db, firestoreCollections.news, id));
  await addAuditLog("news_deleted", id);
}

export async function listCitizenStories() {
  return listDocs<CitizenStoryRecord>(firestoreCollections.citizenStories);
}

export function subscribeCitizenStories(
  onItems: (items: CitizenStoryRecord[]) => void,
  onError?: (error: unknown) => void
) {
  return subscribeDocs<CitizenStoryRecord>(
    firestoreCollections.citizenStories,
    onItems,
    onError
  );
}

export async function saveCitizenStory(story: CitizenStoryRecord) {
  await upsertDoc(firestoreCollections.citizenStories, story);
  await addAuditLog("citizen_story_saved", story.id, {
    name: story.name,
    status: story.status
  });
}

export async function deleteCitizenStory(id: string) {
  requireFirestore();
  await deleteDoc(doc(db, firestoreCollections.citizenStories, id));
  await addAuditLog("citizen_story_deleted", id);
}

export async function listTourismSpots() {
  return listDocs<TourismSpot>(firestoreCollections.tourismSpots);
}

export function subscribeTourismSpots(
  onItems: (items: TourismSpot[]) => void,
  onError?: (error: unknown) => void
) {
  return subscribeDocs<TourismSpot>(
    firestoreCollections.tourismSpots,
    onItems,
    onError
  );
}

export async function saveTourismSpot(spot: TourismSpot) {
  await upsertDoc(firestoreCollections.tourismSpots, spot);
  await addAuditLog("tourism_spot_saved", spot.id, {
    name: spot.name,
    hamletId: spot.hamletId
  });
}

export async function listGalleryItems() {
  return listDocs<GalleryItem>(firestoreCollections.galleryItems);
}

export function subscribeGalleryItems(
  onItems: (items: GalleryItem[]) => void,
  onError?: (error: unknown) => void
) {
  return subscribeDocs<GalleryItem>(
    firestoreCollections.galleryItems,
    onItems,
    onError
  );
}

export async function saveGalleryItem(item: GalleryItem) {
  await upsertDoc(firestoreCollections.galleryItems, item);
  await addAuditLog("gallery_item_saved", item.id, {
    title: item.title,
    type: item.type
  });
}

export async function saveHamlet(hamlet: Hamlet) {
  await upsertDoc(firestoreCollections.hamlets, hamlet);
}

export async function savePublicUmkm(umkm: Umkm) {
  await upsertDoc(firestoreCollections.umkms, {
    ...umkm,
    status: umkm.verified ? "Aktif" : "Draft"
  });
}

export async function seedInitialFirestoreData(adminUsers: AdminUser[] = []) {
  requireFirestore();
  const batch = writeBatch(db);

  hamlets.forEach((hamlet) => {
    batch.set(doc(db, firestoreCollections.hamlets, hamlet.id), {
      ...hamlet,
      updatedAt: serverTimestamp()
    });
  });

  umkms.forEach((umkm) => {
    batch.set(doc(db, firestoreCollections.umkms, umkm.id), {
      ...umkm,
      status: umkm.verified ? "Aktif" : "Draft",
      updatedAt: serverTimestamp()
    });
  });

  newsItems.forEach((item) => {
    batch.set(doc(db, firestoreCollections.news, item.id), {
      ...item,
      updatedAt: serverTimestamp()
    });
  });

  citizenStories.forEach((story) => {
    const id = story.id ?? story.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    batch.set(doc(db, firestoreCollections.citizenStories, id), {
      ...story,
      id,
      status: story.status ?? "Tayang",
      createdAt: story.createdAt ?? "2026-07-05",
      updatedAt: serverTimestamp()
    });
  });

  tourismSpots.forEach((spot) => {
    batch.set(doc(db, firestoreCollections.tourismSpots, spot.id), {
      ...spot,
      updatedAt: serverTimestamp()
    });
  });

  galleryItems.forEach((item) => {
    batch.set(doc(db, firestoreCollections.galleryItems, item.id), {
      ...item,
      updatedAt: serverTimestamp()
    });
  });

  adminUsers.forEach((user) => {
    batch.set(doc(db, firestoreCollections.adminUsers, user.id), {
      ...user,
      updatedAt: serverTimestamp()
    });
  });

  batch.set(doc(db, firestoreCollections.villageStats, "identity"), {
    ...villageIdentity,
    updatedAt: serverTimestamp()
  });

  batch.set(doc(db, firestoreCollections.villageStats, "population_by_hamlet"), {
    data: populationByHamlet,
    updatedAt: serverTimestamp()
  });

  batch.set(doc(db, firestoreCollections.villageStats, "occupation_distribution"), {
    data: occupationDistribution,
    updatedAt: serverTimestamp()
  });

  await batch.commit();
  await addAuditLog("database_seeded", "initial_seed");
}

export async function addAuditLog(
  action: string,
  targetId: string,
  metadata: Record<string, unknown> = {}
) {
  if (!hasFirebaseConfig) return;

  const id = `${Date.now()}-${action}-${targetId}`.replace(/[^a-zA-Z0-9-_]/g, "-");
  await setDoc(doc(db, firestoreCollections.auditLogs, id), {
    action,
    targetId,
    metadata,
    createdAt: serverTimestamp()
  });
}
