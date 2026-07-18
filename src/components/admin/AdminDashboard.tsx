"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  CalendarPlus,
  Check,
  Copy,
  Edit3,
  KeyRound,
  Megaphone,
  Plus,
  Quote,
  Save,
  ShieldCheck,
  Store,
  Trash2,
  UploadCloud,
  UserPlus,
  UsersRound
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ageDistribution,
  citizenStories,
  galleryItems,
  hamlets,
  newsItems,
  occupationDistribution,
  populationByHamlet,
  tourismSpots,
  umkms,
  villageIdentity
} from "@/lib/data";
import { createAdminLoginAccount } from "@/lib/admin-auth";
import { auth } from "@/lib/firebase";
import {
  deleteAdminUmkm,
  deleteAdminUserProfile,
  deleteCitizenStory,
  isFirestoreReady,
  listAdminUmkms,
  listAdminUsers,
  listCitizenStories,
  listGalleryItems,
  listNewsItems,
  listPublicUmkms,
  listTourismSpots,
  normalizePublicUmkm,
  saveAdminUser,
  saveCitizenStory,
  saveGalleryItem,
  saveNewsItem,
  savePublicUmkm,
  saveTourismSpot,
  seedInitialFirestoreData,
  updateAdminUserStatus
} from "@/lib/firestore-service";
import {
  readLocalCitizenStories,
  readLocalGalleryItems,
  readLocalNewsItems,
  readLocalTourismSpots,
  readLocalUmkms,
  saveLocalCitizenStories,
  saveLocalGalleryItems,
  saveLocalNewsItems,
  saveLocalTourismSpots,
  saveLocalUmkms
} from "@/lib/local-content-store";
import { isStorageReady, uploadImageFile } from "@/lib/storage-service";
import type {
  AdminRole,
  AdminUmkmRecord,
  AdminUser,
  CitizenStoryRecord,
  GalleryItem,
  HamletId,
  NewsItem,
  Product,
  ProductCategory,
  TourismSpot,
  Umkm
} from "@/lib/types";
import { cn, formatNumber, shouldUseUnoptimizedImage } from "@/lib/utils";

const chartColors = ["#1B5E20", "#2E7D32", "#FFB300", "#8B6F3D", "#5C6B58"];

const emptyUmkmForm = {
  name: "",
  category: "Kuliner" as ProductCategory,
  whatsapp: "",
  productCount: 1,
  hamletId: "jurangjero" as HamletId
};

const initialAdminUmkms: AdminUmkmRecord[] = umkms.map((umkm) => ({
  id: umkm.id,
  name: umkm.name,
  category: umkm.category,
  whatsapp: umkm.whatsapp,
  productCount: umkm.productCount,
  hamletId: umkm.hamletId,
  status: umkm.verified ? "Aktif" : "Draft",
  createdAt: "2026-07-01"
}));

const categories: ProductCategory[] = [
  "Kuliner",
  "Kerajinan",
  "Fashion",
  "Agro",
  "Minuman",
  "Herbal"
];

const roleOptions: AdminRole[] = [
  "Super Admin",
  "Admin Konten",
  "Admin UMKM",
  "Viewer"
];

const initialAdminUsers: AdminUser[] = [
  {
    id: "admin-desa",
    name: "Admin Desa",
    email: "admin@jurangjero.local",
    role: "Super Admin",
    status: "Aktif",
    passwordReady: true,
    createdAt: "2026-07-01"
  },
  {
    id: "operator-konten",
    name: "Operator Konten",
    email: "konten@jurangjero.local",
    role: "Admin Konten",
    status: "Aktif",
    passwordReady: true,
    createdAt: "2026-07-01"
  },
  {
    id: "operator-umkm",
    name: "Operator UMKM",
    email: "umkm@jurangjero.local",
    role: "Admin UMKM",
    status: "Nonaktif",
    passwordReady: false,
    createdAt: "2026-07-01"
  }
];

const emptyUserForm = {
  name: "",
  email: "",
  role: "Admin Konten" as AdminRole,
  password: "",
  status: "Aktif" as AdminUser["status"]
};

const initialCitizenStories: CitizenStoryRecord[] = citizenStories.map((story) => ({
  id: story.id ?? slugify(`${story.name}-${story.role}`),
  name: story.name,
  role: story.role,
  quote: story.quote,
  status: story.status ?? "Tayang",
  createdAt: story.createdAt ?? "2026-07-05"
}));

const emptyCitizenStoryForm = {
  name: "",
  role: "",
  quote: "",
  status: "Tayang" as CitizenStoryRecord["status"]
};

const emptyProductPhotoForm = {
  umkmId: umkms[0]?.id ?? "",
  name: "",
  category: "Kuliner" as ProductCategory,
  price: 0,
  image: "",
  shortNote: ""
};

const emptyTourismForm = {
  name: "",
  hamletId: "jurangjero" as HamletId,
  image: "",
  summary: "",
  detail: "",
  bestTime: "Pagi / sore",
  highlight: "potensi wisata"
};

const emptyGalleryForm = {
  title: "",
  type: "Dokumentasi",
  src: ""
};

export function AdminDashboard() {
  const [adminUmkms, setAdminUmkms] = useState<AdminUmkmRecord[]>(initialAdminUmkms);
  const [publicUmkms, setPublicUmkms] = useState<Umkm[]>(umkms);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [umkmForm, setUmkmForm] = useState(emptyUmkmForm);
  const [productPhotoForm, setProductPhotoForm] = useState(emptyProductPhotoForm);
  const [adminNews, setAdminNews] = useState<NewsItem[]>(newsItems);
  const [newsForm, setNewsForm] = useState({
    title: "",
    type: "Pengumuman" as NewsItem["type"],
    date: new Date().toISOString().slice(0, 10),
    excerpt: ""
  });
  const [agendaTitle, setAgendaTitle] = useState("");
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [currentAdminUid, setCurrentAdminUid] = useState<string | null>(null);
  const [currentAdminEmail, setCurrentAdminEmail] = useState<string | null>(null);
  const [adminCitizenStories, setAdminCitizenStories] =
    useState<CitizenStoryRecord[]>(initialCitizenStories);
  const [citizenStoryForm, setCitizenStoryForm] = useState(emptyCitizenStoryForm);
  const [adminTourismSpots, setAdminTourismSpots] =
    useState<TourismSpot[]>(tourismSpots);
  const [tourismForm, setTourismForm] = useState(emptyTourismForm);
  const [adminGalleryItems, setAdminGalleryItems] =
    useState<GalleryItem[]>(galleryItems);
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm);
  const [dbMessage, setDbMessage] = useState(
    isFirestoreReady()
      ? "Database siap. Memuat data..."
      : "Mode lokal. Data tersimpan di layar selama sesi ini."
  );
  const [dbBusy, setDbBusy] = useState(false);

  const activeUmkm = adminUmkms.filter((item) => item.status === "Aktif").length;
  const totalProducts = publicUmkms.reduce(
    (sum, item) => sum + item.products.length,
    0
  );

  const agendaItems = useMemo(
    () => adminNews.filter((item) => item.type === "Acara"),
    [adminNews]
  );
  const publishedStories = adminCitizenStories.filter(
    (story) => story.status === "Tayang"
  ).length;
  const currentAdmin = adminUsers.find(
    (user) => user.uid === currentAdminUid || user.id === currentAdminUid
  );
  const needsAdminBootstrap = Boolean(
    isFirestoreReady() && currentAdminUid && !currentAdmin
  );
  const canManageUsers = !isFirestoreReady() || currentAdmin?.role === "Super Admin";
  const canManageStories =
    !isFirestoreReady() ||
    currentAdmin?.role === "Super Admin" ||
    currentAdmin?.role === "Admin Konten";
  const canManageContent = canManageStories;
  const canManageUmkmContent =
    !isFirestoreReady() ||
    currentAdmin?.role === "Super Admin" ||
    currentAdmin?.role === "Admin UMKM";

  useEffect(() => {
    if (!isFirestoreReady()) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentAdminUid(user?.uid ?? null);
      setCurrentAdminEmail(user?.email ?? null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const storedUmkms = readLocalUmkms(umkms);
    const storedNews = readLocalNewsItems(newsItems);
    const storedStories = readLocalCitizenStories(initialCitizenStories);
    const storedTourism = readLocalTourismSpots(tourismSpots);
    const storedGallery = readLocalGalleryItems(galleryItems);

    setPublicUmkms(storedUmkms);
    setAdminUmkms(storedUmkms.map(toAdminUmkmRecord));
    setAdminNews(storedNews);
    setAdminCitizenStories(storedStories);
    setAdminTourismSpots(storedTourism);
    setAdminGalleryItems(storedGallery);
  }, []);

  useEffect(() => {
    if (!isFirestoreReady()) return;

    let mounted = true;

    async function loadFirestoreData() {
      try {
        const [
          storedUmkms,
          storedPublicUmkms,
          storedUsers,
          storedNews,
          storedStories,
          storedTourism,
          storedGallery
        ] = await Promise.all([
          listAdminUmkms(),
          listPublicUmkms(),
          listAdminUsers(),
          listNewsItems(),
          listCitizenStories(),
          listTourismSpots(),
          listGalleryItems()
        ]);

        if (!mounted) return;

        if (storedPublicUmkms.length) {
          setPublicUmkms(storedPublicUmkms);
          setAdminUmkms(storedPublicUmkms.map(toAdminUmkmRecord));
          saveLocalUmkms(storedPublicUmkms);
        } else if (storedUmkms.length) {
          const normalizedUmkms = storedUmkms.map((item) => normalizePublicUmkm(item));
          setPublicUmkms(normalizedUmkms);
          setAdminUmkms(storedUmkms);
          saveLocalUmkms(normalizedUmkms);
        }
        if (storedUsers.length) setAdminUsers(storedUsers);
        if (storedNews.length) {
          setAdminNews(storedNews);
          saveLocalNewsItems(storedNews);
        }
        if (storedStories.length) {
          setAdminCitizenStories(storedStories);
          saveLocalCitizenStories(storedStories);
        }
        if (storedTourism.length) {
          setAdminTourismSpots(storedTourism);
          saveLocalTourismSpots(storedTourism);
        }
        if (storedGallery.length) {
          setAdminGalleryItems(storedGallery);
          saveLocalGalleryItems(storedGallery);
        }
        setDbMessage("Database aktif. Data dashboard tersambung.");
      } catch (error) {
        if (!mounted) return;
        setDbMessage(
          error instanceof Error
            ? `Database gagal dimuat: ${error.message}`
            : "Database gagal dimuat."
        );
      }
    }

    void loadFirestoreData();

    return () => {
      mounted = false;
    };
  }, []);

  async function persist<T>(action: () => Promise<T>, successMessage: string) {
    if (!isFirestoreReady()) {
      setDbMessage("Mode lokal. Perubahan sudah tampil di web utama pada browser ini.");
      return;
    }

    try {
      setDbBusy(true);
      await action();
      setDbMessage(successMessage);
    } catch (error) {
      setDbMessage(
        error instanceof Error
          ? `Database gagal menyimpan: ${error.message}. Perubahan tetap tersimpan lokal.`
          : "Database gagal menyimpan. Perubahan tetap tersimpan lokal."
      );
    } finally {
      setDbBusy(false);
    }
  }

  async function bootstrapCurrentAdmin() {
    if (!currentAdminUid || !currentAdminEmail) {
      setDbMessage("Login Firebase belum terbaca. Muat ulang halaman admin lalu coba lagi.");
      return;
    }

    const nextUser: AdminUser = {
      id: currentAdminUid,
      uid: currentAdminUid,
      name: currentAdminEmail.split("@")[0] || "Super Admin",
      email: currentAdminEmail,
      role: "Super Admin",
      status: "Aktif",
      passwordReady: true,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    try {
      setDbBusy(true);
      await saveAdminUser(nextUser);
      setAdminUsers((current) => [
        nextUser,
        ...current.filter((item) => item.id !== nextUser.id)
      ]);
      setDbMessage("Akun ini sudah diaktifkan sebagai Super Admin.");
    } catch (error) {
      setDbMessage(
        error instanceof Error
          ? `Gagal mengaktifkan Super Admin: ${error.message}`
          : "Gagal mengaktifkan Super Admin."
      );
    } finally {
      setDbBusy(false);
    }
  }

  async function handleUmkmSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId) {
      const nextItem: AdminUmkmRecord = {
        id: editingId,
        ...umkmForm,
        productCount: Number(umkmForm.productCount),
        status: "Aktif"
      };
      const existingPublicUmkm = publicUmkms.find((item) => item.id === editingId);
      const nextPublicUmkm = normalizePublicUmkm({
        ...existingPublicUmkm,
        ...nextItem
      });
      const nextPublicUmkms = publicUmkms.map((item) =>
        item.id === editingId ? nextPublicUmkm : item
      );

      setPublicUmkms(nextPublicUmkms);
      setAdminUmkms(nextPublicUmkms.map(toAdminUmkmRecord));
      saveLocalUmkms(nextPublicUmkms);
      await persist(() => savePublicUmkm(nextPublicUmkm), "UMKM tersimpan ke database.");
      setEditingId(null);
    } else {
      const id = uniqueSlug(slugify(umkmForm.name), publicUmkms.map((item) => item.id));
      const nextItem: AdminUmkmRecord = {
        ...umkmForm,
        id,
        productCount: Number(umkmForm.productCount),
        status: "Aktif",
        createdAt: new Date().toISOString().slice(0, 10)
      };
      const nextPublicUmkm = normalizePublicUmkm(nextItem);
      const nextPublicUmkms = [
        nextPublicUmkm,
        ...publicUmkms
      ];

      setPublicUmkms(nextPublicUmkms);
      setAdminUmkms(nextPublicUmkms.map(toAdminUmkmRecord));
      saveLocalUmkms(nextPublicUmkms);
      await persist(() => savePublicUmkm(nextPublicUmkm), "UMKM baru tersimpan ke database.");
    }

    setUmkmForm(emptyUmkmForm);
  }

  function editUmkm(item: AdminUmkmRecord) {
    setEditingId(item.id);
    setUmkmForm({
      name: item.name,
      category: item.category,
      whatsapp: item.whatsapp,
      productCount: item.productCount,
      hamletId: item.hamletId
    });
  }

  async function deleteUmkm(id: string) {
    const nextPublicUmkms = publicUmkms.filter((item) => item.id !== id);
    setPublicUmkms(nextPublicUmkms);
    setAdminUmkms(nextPublicUmkms.map(toAdminUmkmRecord));
    saveLocalUmkms(nextPublicUmkms);
    if (editingId === id) setEditingId(null);
    await persist(() => deleteAdminUmkm(id), "UMKM dihapus dari database.");
  }

  async function handleNewsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextItem: NewsItem = {
      id: slugify(newsForm.title),
      ...newsForm
    };
    const nextNews = [
      nextItem,
      ...adminNews
    ];
    setAdminNews(nextNews);
    saveLocalNewsItems(nextNews);
    await persist(() => saveNewsItem(nextItem), "Berita/pengumuman tersimpan ke database.");
    setNewsForm({
      title: "",
      type: "Pengumuman",
      date: new Date().toISOString().slice(0, 10),
      excerpt: ""
    });
  }

  async function addAgenda(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!agendaTitle.trim()) return;
    const nextItem: NewsItem = {
      id: slugify(agendaTitle),
      type: "Acara",
      title: agendaTitle,
      date: new Date().toISOString().slice(0, 10),
      excerpt: "Agenda baru. Lengkapi detail sebelum dipublikasikan."
    };
    const nextNews = [
      nextItem,
      ...adminNews
    ];
    setAdminNews(nextNews);
    saveLocalNewsItems(nextNews);
    await persist(() => saveNewsItem(nextItem), "Agenda tersimpan ke database.");
    setAgendaTitle("");
  }

  async function handleUserSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManageUsers) {
      setDbMessage("Hanya Super Admin yang dapat menambah user dan role.");
      return;
    }

    try {
      setDbBusy(true);

      const createdAccount = isFirestoreReady()
        ? await createAdminLoginAccount(userForm.email, userForm.password)
        : {
            uid: slugify(userForm.email || userForm.name),
            email: userForm.email
          };

      const nextUser: AdminUser = {
        id: createdAccount.uid,
        uid: createdAccount.uid,
        name: userForm.name,
        email: createdAccount.email,
        role: userForm.role,
        status: userForm.status,
        passwordReady: true,
        createdAt: new Date().toISOString().slice(0, 10)
      };

      if (isFirestoreReady()) {
        await saveAdminUser(nextUser);
      }

      setAdminUsers((current) => [
        nextUser,
        ...current.filter((item) => item.id !== nextUser.id)
      ]);
      setDbMessage("User login dan role berhasil dibuat dari dashboard.");
      setUserForm(emptyUserForm);
    } catch (error) {
      setDbMessage(
        error instanceof Error
          ? `Gagal membuat user: ${error.message}`
          : "Gagal membuat user."
      );
    } finally {
      setDbBusy(false);
    }
  }

  async function handleCitizenStorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManageStories) {
      setDbMessage("Hanya Super Admin atau Admin Konten yang dapat mengelola cerita warga.");
      return;
    }

    const nextStory: CitizenStoryRecord = {
      id: `${slugify(citizenStoryForm.name)}-${Date.now()}`,
      name: citizenStoryForm.name,
      role: citizenStoryForm.role,
      quote: citizenStoryForm.quote,
      status: citizenStoryForm.status,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const nextStories = [
      nextStory,
      ...adminCitizenStories
    ];
    setAdminCitizenStories(nextStories);
    saveLocalCitizenStories(nextStories);
    await persist(
      () => saveCitizenStory(nextStory),
      "Cerita warga tersimpan ke database."
    );
    setCitizenStoryForm(emptyCitizenStoryForm);
  }

  async function handleProductPhotoSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManageUmkmContent) {
      setDbMessage("Hanya Super Admin atau Admin UMKM yang dapat mengelola produk UMKM.");
      return;
    }

    const targetUmkm = publicUmkms.find((item) => item.id === productPhotoForm.umkmId);
    if (!targetUmkm) {
      setDbMessage("Pilih UMKM terlebih dahulu sebelum menambah produk.");
      return;
    }

    const nextProduct: Product = {
      id: uniqueSlug(
        slugify(`${targetUmkm.id}-${productPhotoForm.name}`),
        targetUmkm.products.map((product) => product.id)
      ),
      umkmId: targetUmkm.id,
      name: productPhotoForm.name,
      category: productPhotoForm.category,
      price: Number(productPhotoForm.price),
      popularity: 86,
      image: productPhotoForm.image,
      shortNote: productPhotoForm.shortNote
    };
    const nextUmkm: Umkm = {
      ...targetUmkm,
      productCount: targetUmkm.products.length + 1,
      gallery: Array.from(new Set([productPhotoForm.image, ...targetUmkm.gallery])),
      products: [
        nextProduct,
        ...targetUmkm.products
      ]
    };
    const nextUmkms = publicUmkms.map((item) =>
      item.id === nextUmkm.id ? nextUmkm : item
    );

    setPublicUmkms(nextUmkms);
    setAdminUmkms(nextUmkms.map(toAdminUmkmRecord));
    saveLocalUmkms(nextUmkms);
    await persist(
      () => savePublicUmkm(nextUmkm),
      "Produk dan foto katalog tersimpan ke database."
    );
    setProductPhotoForm({
      ...emptyProductPhotoForm,
      umkmId: targetUmkm.id,
      category: targetUmkm.category
    });
  }

  async function handleTourismSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManageContent) {
      setDbMessage("Hanya Super Admin atau Admin Konten yang dapat mengelola potensi wisata.");
      return;
    }

    const nextSpot: TourismSpot = {
      id: uniqueSlug(slugify(tourismForm.name), adminTourismSpots.map((spot) => spot.id)),
      name: tourismForm.name,
      hamletId: tourismForm.hamletId,
      image: tourismForm.image,
      summary: tourismForm.summary,
      detail: tourismForm.detail,
      bestTime: tourismForm.bestTime,
      highlight: tourismForm.highlight
    };
    const nextTourism = [
      nextSpot,
      ...adminTourismSpots
    ];

    setAdminTourismSpots(nextTourism);
    saveLocalTourismSpots(nextTourism);
    await persist(() => saveTourismSpot(nextSpot), "Potensi wisata tersimpan ke database.");
    setTourismForm(emptyTourismForm);
  }

  async function handleGallerySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canManageContent) {
      setDbMessage("Hanya Super Admin atau Admin Konten yang dapat mengelola galeri.");
      return;
    }

    const nextItem: GalleryItem = {
      id: uniqueSlug(slugify(galleryForm.title), adminGalleryItems.map((item) => item.id)),
      title: galleryForm.title,
      type: galleryForm.type,
      src: galleryForm.src,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const nextGallery = [
      nextItem,
      ...adminGalleryItems
    ];

    setAdminGalleryItems(nextGallery);
    saveLocalGalleryItems(nextGallery);
    await persist(() => saveGalleryItem(nextItem), "Foto galeri tersimpan ke database.");
    setGalleryForm(emptyGalleryForm);
  }

  async function toggleUserStatus(id: string) {
    const target = adminUsers.find((item) => item.id === id);
    const nextStatus = target?.status === "Aktif" ? "Nonaktif" : "Aktif";

    setAdminUsers((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: nextStatus }
          : item
      )
    );
    await persist(
      () => updateAdminUserStatus(id, nextStatus),
      "Status user tersimpan ke database."
    );
  }

  async function deleteUser(id: string) {
    setAdminUsers((current) => current.filter((item) => item.id !== id));
    await persist(() => deleteAdminUserProfile(id), "Akses user dihapus dari database.");
  }

  async function toggleCitizenStoryStatus(id: string) {
    const target = adminCitizenStories.find((story) => story.id === id);
    if (!target) return;

    const nextStory: CitizenStoryRecord = {
      ...target,
      status: target.status === "Tayang" ? "Draft" : "Tayang"
    };

    const nextStories = adminCitizenStories.map((story) =>
      story.id === id ? nextStory : story
    );
    setAdminCitizenStories(nextStories);
    saveLocalCitizenStories(nextStories);
    await persist(
      () => saveCitizenStory(nextStory),
      "Status cerita warga tersimpan ke database."
    );
  }

  async function deleteStory(id: string) {
    const nextStories = adminCitizenStories.filter((story) => story.id !== id);
    setAdminCitizenStories(nextStories);
    saveLocalCitizenStories(nextStories);
    await persist(() => deleteCitizenStory(id), "Cerita warga dihapus dari database.");
  }

  async function seedDatabase() {
    await persist(
      () => seedInitialFirestoreData(adminUsers),
      "Seed data awal berhasil dikirim ke database."
    );
  }

  return (
    <main className="px-5 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 overflow-x-auto rounded-[8px] border border-stonewarm-200 bg-white p-2 shadow-line">
          <div className="flex min-w-max gap-2">
            {[
              ["#umkm-admin", "UMKM"],
              ["#produk-admin", "Produk"],
              ["#wisata-admin", "Wisata"],
              ["#galeri-admin", "Galeri"],
              ["#user-admin", "User & Role"],
              ["#cerita-admin", "Cerita Warga"],
              ["#konten-admin", "Berita"],
              ["#agenda-admin", "Agenda"],
              ["#statistik-admin", "Statistik"]
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="rounded-[8px] px-4 py-2 text-sm font-bold text-stonewarm-700 hover:bg-leaf-100 hover:text-leaf-800"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 rounded-[8px] border border-stonewarm-200 bg-white p-4 shadow-line lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-700">
              Status Database
            </p>
            <p className="mt-1 text-sm font-semibold text-stonewarm-700">
              {dbMessage}
            </p>
          </div>
          <button
            type="button"
            disabled={!isFirestoreReady() || dbBusy}
            onClick={() => void seedDatabase()}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-4 py-3 text-sm font-bold text-white hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <Save size={17} />
            {dbBusy ? "Menyimpan..." : "Seed Data Awal"}
          </button>
        </div>

        {needsAdminBootstrap ? (
          <div className="mb-6 rounded-[8px] border border-amber-500/30 bg-amber-100 p-5 shadow-line">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stonewarm-950">
                  Aktivasi Admin Pertama
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-stonewarm-950">
                  Akun ini belum punya role dashboard
                </h2>
                <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-stonewarm-700">
                  Klik tombol ini sekali untuk membuat profil Super Admin sesuai
                  UID Firebase yang sedang login. Setelah aktif, fitur kelola
                  konten dan upload akan mengikuti rules database.
                </p>
              </div>
              <button
                type="button"
                disabled={dbBusy}
                onClick={() => void bootstrapCurrentAdmin()}
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-5 py-3 text-sm font-bold text-white hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShieldCheck size={17} />
                Aktifkan Super Admin
              </button>
            </div>
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          <MetricCard label="UMKM Aktif" value={activeUmkm} icon={Store} />
          <MetricCard label="Produk Terdata" value={totalProducts} icon={Save} />
          <MetricCard label="Penduduk" value={villageIdentity.population} icon={UsersRound} />
          <MetricCard label="Agenda" value={agendaItems.length} icon={CalendarPlus} />
          <MetricCard label="Cerita Tayang" value={publishedStories} icon={Quote} />
          <MetricCard label="Admin User" value={adminUsers.length} icon={ShieldCheck} />
        </section>

        <section id="umkm-admin" className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.92fr]">
          <div className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
                  Kelola UMKM
                </p>
                <h1 className="mt-1 font-heading text-2xl font-bold text-stonewarm-950">
                  Tambah, edit, hapus, dan update WhatsApp
                </h1>
              </div>
              {editingId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setUmkmForm(emptyUmkmForm);
                  }}
                  className="rounded-[8px] border border-stonewarm-200 px-4 py-2 text-sm font-bold text-stonewarm-950 hover:bg-stonewarm-100"
                >
                  Batal edit
                </button>
              ) : null}
            </div>

            <form
              className="mt-5 grid gap-3 rounded-[8px] bg-stonewarm-100 p-4 md:grid-cols-2"
              onSubmit={handleUmkmSubmit}
            >
              <Input
                label="Nama UMKM"
                value={umkmForm.name}
                onChange={(value) => setUmkmForm((form) => ({ ...form, name: value }))}
                required
              />
              <Input
                label="WhatsApp"
                value={umkmForm.whatsapp}
                onChange={(value) =>
                  setUmkmForm((form) => ({ ...form, whatsapp: value }))
                }
                required
              />
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Kategori
                <select
                  value={umkmForm.category}
                  onChange={(event) =>
                    setUmkmForm((form) => ({
                      ...form,
                      category: event.target.value as ProductCategory
                    }))
                  }
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Padukuhan
                <select
                  value={umkmForm.hamletId}
                  onChange={(event) =>
                    setUmkmForm((form) => ({
                      ...form,
                      hamletId: event.target.value as HamletId
                    }))
                  }
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                >
                  {hamlets.map((hamlet) => (
                    <option key={hamlet.id} value={hamlet.id}>
                      {hamlet.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Jumlah Produk
                <input
                  type="number"
                  min={1}
                  value={umkmForm.productCount}
                  onChange={(event) =>
                    setUmkmForm((form) => ({
                      ...form,
                      productCount: Number(event.target.value)
                    }))
                  }
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                />
              </label>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-[8px] bg-leaf-800 px-4 text-sm font-bold text-white hover:bg-leaf-700"
              >
                {editingId ? <Save size={17} /> : <Plus size={17} />}
                {editingId ? "Simpan UMKM" : "Tambah UMKM"}
              </button>
            </form>

            <div className="scrollbar-soft mt-5 overflow-x-auto">
              <table className="min-w-[760px] w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.16em] text-stonewarm-700">
                  <tr>
                    <th className="px-3 py-3">Nama</th>
                    <th className="px-3 py-3">Kategori</th>
                    <th className="px-3 py-3">Padukuhan</th>
                    <th className="px-3 py-3">WhatsApp</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stonewarm-200">
                  {adminUmkms.map((item) => {
                    const hamlet = hamlets.find((hamletItem) => hamletItem.id === item.hamletId);
                    return (
                      <tr key={item.id}>
                        <td className="px-3 py-3 font-bold text-stonewarm-950">
                          {item.name}
                        </td>
                        <td className="px-3 py-3 text-stonewarm-700">{item.category}</td>
                        <td className="px-3 py-3 text-stonewarm-700">{hamlet?.name}</td>
                        <td className="px-3 py-3 text-stonewarm-700">{item.whatsapp}</td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "rounded-[8px] px-2.5 py-1 text-xs font-bold",
                              item.status === "Aktif"
                                ? "bg-leaf-100 text-leaf-800"
                                : "bg-amber-100 text-stonewarm-950"
                            )}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="grid h-9 w-9 place-items-center rounded-[8px] border border-stonewarm-200 text-leaf-800 hover:bg-leaf-100"
                              onClick={() => editUmkm(item)}
                              aria-label={`Edit ${item.name}`}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              className="grid h-9 w-9 place-items-center rounded-[8px] border border-stonewarm-200 text-red-700 hover:bg-red-50"
                              onClick={() => deleteUmkm(item.id)}
                              aria-label={`Hapus ${item.name}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6">
            <AdminChartPanel title="Distribusi Usia Penduduk">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={ageDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D5" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1B5E20" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </AdminChartPanel>

            <AdminChartPanel title="Jenis Pekerjaan">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={occupationDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={3}
                    isAnimationActive
                  >
                    {occupationDistribution.map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </AdminChartPanel>
          </div>
        </section>

        <section id="produk-admin" className="mt-6 rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
                Katalog Produk
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-stonewarm-950">
                Tambah produk dan foto ke UMKM
              </h2>
            </div>
            <div className="rounded-[8px] bg-leaf-100 px-4 py-3 text-sm font-semibold leading-6 text-leaf-900">
              {totalProducts} produk tampil di website utama.
            </div>
          </div>

          <form
            className="mt-5 rounded-[8px] bg-stonewarm-100 p-5"
            onSubmit={handleProductPhotoSubmit}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                UMKM
                <select
                  value={productPhotoForm.umkmId}
                  onChange={(event) => {
                    const target = publicUmkms.find((item) => item.id === event.target.value);
                    setProductPhotoForm((form) => ({
                      ...form,
                      umkmId: event.target.value,
                      category: target?.category ?? form.category
                    }));
                  }}
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                >
                  {publicUmkms.map((umkm) => (
                    <option key={umkm.id} value={umkm.id}>
                      {umkm.name}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="Nama Produk"
                value={productPhotoForm.name}
                onChange={(value) =>
                  setProductPhotoForm((form) => ({ ...form, name: value }))
                }
                required
              />
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Kategori
                <select
                  value={productPhotoForm.category}
                  onChange={(event) =>
                    setProductPhotoForm((form) => ({
                      ...form,
                      category: event.target.value as ProductCategory
                    }))
                  }
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <Input
                label="Harga"
                type="number"
                value={productPhotoForm.price}
                onChange={(value) =>
                  setProductPhotoForm((form) => ({ ...form, price: Number(value) }))
                }
              />
              <div className="lg:col-span-2">
                <ImageInput
                  label="Foto Produk"
                  value={productPhotoForm.image}
                  onChange={(value) =>
                    setProductPhotoForm((form) => ({ ...form, image: value }))
                  }
                  folder={`produk-${productPhotoForm.umkmId || "umkm"}`}
                  onStatus={setDbMessage}
                  required
                />
              </div>
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950 lg:col-span-2">
                Catatan Produk
                <textarea
                  value={productPhotoForm.shortNote}
                  onChange={(event) =>
                    setProductPhotoForm((form) => ({
                      ...form,
                      shortNote: event.target.value
                    }))
                  }
                  required
                  rows={3}
                  className="rounded-[8px] border border-stonewarm-200 bg-white px-3 py-3 outline-none focus:border-leaf-700"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={dbBusy || !canManageUmkmContent}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-5 text-sm font-bold text-white hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={17} />
                Tambah Produk
              </button>
            </div>
          </form>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {publicUmkms.flatMap((umkm) => umkm.products.slice(0, 4)).slice(0, 8).map((product) => (
              <div key={product.id} className="rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-leaf-700">
                  {product.category}
                </p>
                <p className="mt-2 font-bold text-stonewarm-950">{product.name}</p>
                <p className="mt-1 text-sm leading-6 text-stonewarm-700">
                  {product.shortNote}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="wisata-admin" className="mt-6 rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
                Potensi Wisata
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-stonewarm-950">
                Tambah titik wisata dan foto
              </h2>
            </div>
            <div className="rounded-[8px] bg-amber-100 px-4 py-3 text-sm font-semibold leading-6 text-stonewarm-950">
              {adminTourismSpots.length} titik wisata tampil.
            </div>
          </div>

          <form
            className="mt-5 rounded-[8px] bg-stonewarm-100 p-5"
            onSubmit={handleTourismSubmit}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label="Nama Wisata"
                value={tourismForm.name}
                onChange={(value) => setTourismForm((form) => ({ ...form, name: value }))}
                required
              />
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Padukuhan
                <select
                  value={tourismForm.hamletId}
                  onChange={(event) =>
                    setTourismForm((form) => ({
                      ...form,
                      hamletId: event.target.value as HamletId
                    }))
                  }
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                >
                  {hamlets.map((hamlet) => (
                    <option key={hamlet.id} value={hamlet.id}>
                      {hamlet.name}
                    </option>
                  ))}
                </select>
              </label>
              <Input
                label="Highlight"
                value={tourismForm.highlight}
                onChange={(value) => setTourismForm((form) => ({ ...form, highlight: value }))}
                required
              />
              <Input
                label="Waktu Terbaik"
                value={tourismForm.bestTime}
                onChange={(value) => setTourismForm((form) => ({ ...form, bestTime: value }))}
                required
              />
              <div className="lg:col-span-2">
                <ImageInput
                  label="Foto Wisata"
                  value={tourismForm.image}
                  onChange={(value) => setTourismForm((form) => ({ ...form, image: value }))}
                  folder="wisata"
                  onStatus={setDbMessage}
                  required
                />
              </div>
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950 lg:col-span-2">
                Ringkasan
                <textarea
                  value={tourismForm.summary}
                  onChange={(event) =>
                    setTourismForm((form) => ({ ...form, summary: event.target.value }))
                  }
                  required
                  rows={3}
                  className="rounded-[8px] border border-stonewarm-200 bg-white px-3 py-3 outline-none focus:border-leaf-700"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950 lg:col-span-2">
                Detail
                <textarea
                  value={tourismForm.detail}
                  onChange={(event) =>
                    setTourismForm((form) => ({ ...form, detail: event.target.value }))
                  }
                  required
                  rows={4}
                  className="rounded-[8px] border border-stonewarm-200 bg-white px-3 py-3 outline-none focus:border-leaf-700"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={dbBusy || !canManageContent}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-5 text-sm font-bold text-white hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={17} />
                Tambah Wisata
              </button>
            </div>
          </form>
        </section>

        <section id="galeri-admin" className="mt-6 rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
                Galeri Multimedia
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-stonewarm-950">
                Tambah foto ke galeri utama
              </h2>
            </div>
            <div className="rounded-[8px] bg-leaf-100 px-4 py-3 text-sm font-semibold leading-6 text-leaf-900">
              {adminGalleryItems.length} foto tampil.
            </div>
          </div>

          <form
            className="mt-5 rounded-[8px] bg-stonewarm-100 p-5"
            onSubmit={handleGallerySubmit}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label="Judul Foto"
                value={galleryForm.title}
                onChange={(value) => setGalleryForm((form) => ({ ...form, title: value }))}
                required
              />
              <Input
                label="Tipe"
                value={galleryForm.type}
                onChange={(value) => setGalleryForm((form) => ({ ...form, type: value }))}
                required
              />
              <div className="lg:col-span-2">
                <ImageInput
                  label="Foto Galeri"
                  value={galleryForm.src}
                  onChange={(value) => setGalleryForm((form) => ({ ...form, src: value }))}
                  folder="galeri"
                  onStatus={setDbMessage}
                  required
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={dbBusy || !canManageContent}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-5 text-sm font-bold text-white hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={17} />
                Tambah Foto
              </button>
            </div>
          </form>
        </section>

        <section id="user-admin" className="mt-6 rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
                Kelola User & Role
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-stonewarm-950">
                Buat akun login langsung dari dashboard
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stonewarm-700">
                Isi nama, email, password awal, role, dan status. User baru bisa
                login memakai email dan password yang dibuat di form ini.
              </p>
            </div>
            <div className="rounded-[8px] bg-amber-100 px-4 py-3 text-sm font-semibold leading-6 text-stonewarm-950">
              {canManageUsers
                ? "Role: Super Admin, Admin Konten, Admin UMKM, Viewer."
                : "Akses tambah user hanya untuk Super Admin."}
            </div>
          </div>

          <form
            className="mt-5 rounded-[8px] bg-stonewarm-100 p-5"
            onSubmit={handleUserSubmit}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label="Nama User"
                value={userForm.name}
                onChange={(value) => setUserForm((form) => ({ ...form, name: value }))}
                required
              />
              <Input
                label="Email Login"
                type="email"
                value={userForm.email}
                onChange={(value) => setUserForm((form) => ({ ...form, email: value }))}
                required
              />
              <Input
                label="Password Awal"
                type="password"
                value={userForm.password}
                onChange={(value) => setUserForm((form) => ({ ...form, password: value }))}
                required
              />
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Role
                <select
                  value={userForm.role}
                  onChange={(event) =>
                    setUserForm((form) => ({
                      ...form,
                      role: event.target.value as AdminRole
                    }))
                  }
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                >
                  {roleOptions.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Status
                <select
                  value={userForm.status}
                  onChange={(event) =>
                    setUserForm((form) => ({
                      ...form,
                      status: event.target.value as AdminUser["status"]
                    }))
                  }
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                >
                  <option>Aktif</option>
                  <option>Nonaktif</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={dbBusy || !canManageUsers}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-5 text-sm font-bold text-white hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus size={17} />
                {dbBusy ? "Membuat..." : "Tambah User"}
              </button>
            </div>
          </form>

          <div className="scrollbar-soft mt-5 max-h-[360px] overflow-auto rounded-[8px] border border-stonewarm-200">
            <table className="min-w-[780px] w-full text-left text-sm">
              <thead className="sticky top-0 z-10 bg-white text-xs uppercase tracking-[0.16em] text-stonewarm-700 shadow-line">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Password</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Dibuat</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stonewarm-200 bg-white">
                {adminUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3 font-bold text-stonewarm-950">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 text-stonewarm-700">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-[8px] bg-leaf-100 px-2.5 py-1 text-xs font-bold text-leaf-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stonewarm-700">
                      <span className="inline-flex items-center gap-2">
                        <KeyRound size={15} className="text-leaf-800" />
                        {user.passwordReady ? "Sudah disetel" : "Belum disetel"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-[8px] px-2.5 py-1 text-xs font-bold",
                          user.status === "Aktif"
                            ? "bg-leaf-100 text-leaf-800"
                            : "bg-stonewarm-100 text-stonewarm-700"
                        )}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stonewarm-700">{user.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="rounded-[8px] border border-stonewarm-200 px-3 py-2 text-xs font-bold text-stonewarm-950 hover:bg-stonewarm-100"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === "Aktif" ? "Nonaktifkan" : "Aktifkan"}
                        </button>
                        <button
                          type="button"
                          className="grid h-9 w-9 place-items-center rounded-[8px] border border-stonewarm-200 text-red-700 hover:bg-red-50"
                          onClick={() => deleteUser(user.id)}
                          aria-label={`Hapus akses ${user.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="cerita-admin" className="mt-6 rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
                Cerita dari Warga
              </p>
              <h2 className="mt-1 font-heading text-2xl font-bold text-stonewarm-950">
                Tambah cerita yang tampil di halaman publik
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stonewarm-700">
                Cerita berstatus Tayang akan muncul di section Cerita dari Warga
                pada website utama.
              </p>
            </div>
            <div className="rounded-[8px] bg-leaf-100 px-4 py-3 text-sm font-semibold leading-6 text-leaf-900">
              {publishedStories} cerita sedang tayang.
            </div>
          </div>

          <form
            className="mt-5 rounded-[8px] bg-stonewarm-100 p-5"
            onSubmit={handleCitizenStorySubmit}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Input
                label="Nama / Sumber Cerita"
                value={citizenStoryForm.name}
                onChange={(value) =>
                  setCitizenStoryForm((form) => ({ ...form, name: value }))
                }
                required
              />
              <Input
                label="Peran"
                value={citizenStoryForm.role}
                onChange={(value) =>
                  setCitizenStoryForm((form) => ({ ...form, role: value }))
                }
                required
              />
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950 lg:col-span-2">
                Cerita / Testimoni
                <textarea
                  value={citizenStoryForm.quote}
                  onChange={(event) =>
                    setCitizenStoryForm((form) => ({
                      ...form,
                      quote: event.target.value
                    }))
                  }
                  required
                  rows={4}
                  className="rounded-[8px] border border-stonewarm-200 bg-white px-3 py-3 outline-none focus:border-leaf-700"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Status
                <select
                  value={citizenStoryForm.status}
                  onChange={(event) =>
                    setCitizenStoryForm((form) => ({
                      ...form,
                      status: event.target.value as CitizenStoryRecord["status"]
                    }))
                  }
                  className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
                >
                  <option>Tayang</option>
                  <option>Draft</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={dbBusy || !canManageStories}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-5 text-sm font-bold text-white hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={17} />
                Tambah Cerita
              </button>
            </div>
          </form>

          <div className="mt-5 grid gap-3">
            {adminCitizenStories.map((story) => (
              <div
                key={story.id}
                className="grid gap-3 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4 lg:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-heading text-lg font-bold text-stonewarm-950">
                      {story.name}
                    </p>
                    <span
                      className={cn(
                        "rounded-[8px] px-2.5 py-1 text-xs font-bold",
                        story.status === "Tayang"
                          ? "bg-leaf-100 text-leaf-800"
                          : "bg-stonewarm-200 text-stonewarm-700"
                      )}
                    >
                      {story.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-leaf-800">
                    {story.role}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stonewarm-700">
                    &quot;{story.quote}&quot;
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <button
                    type="button"
                    className="rounded-[8px] border border-stonewarm-200 px-3 py-2 text-xs font-bold text-stonewarm-950 hover:bg-white disabled:cursor-not-allowed disabled:opacity-55"
                    disabled={!canManageStories}
                    onClick={() => toggleCitizenStoryStatus(story.id)}
                  >
                    {story.status === "Tayang" ? "Jadikan Draft" : "Tayangkan"}
                  </button>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-[8px] border border-stonewarm-200 text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-55"
                    disabled={!canManageStories}
                    onClick={() => deleteStory(story.id)}
                    aria-label={`Hapus cerita ${story.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div id="konten-admin" className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
              Kelola Berita & Pengumuman
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-stonewarm-950">
              Publikasi informasi desa
            </h2>

            <form className="mt-5 grid gap-3" onSubmit={handleNewsSubmit}>
              <Input
                label="Judul"
                value={newsForm.title}
                onChange={(value) => setNewsForm((form) => ({ ...form, title: value }))}
                required
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                  Tipe
                  <select
                    value={newsForm.type}
                    onChange={(event) =>
                      setNewsForm((form) => ({
                        ...form,
                        type: event.target.value as NewsItem["type"]
                      }))
                    }
                    className="h-11 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] px-3 outline-none focus:border-leaf-700"
                  >
                    <option>Berita</option>
                    <option>Pengumuman</option>
                    <option>Acara</option>
                  </select>
                </label>
                <Input
                  label="Tanggal"
                  type="date"
                  value={newsForm.date}
                  onChange={(value) => setNewsForm((form) => ({ ...form, date: value }))}
                  required
                />
              </div>
              <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
                Ringkasan
                <textarea
                  value={newsForm.excerpt}
                  onChange={(event) =>
                    setNewsForm((form) => ({ ...form, excerpt: event.target.value }))
                  }
                  required
                  rows={4}
                  className="rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] px-3 py-3 outline-none focus:border-leaf-700"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-4 py-3 text-sm font-bold text-white hover:bg-leaf-700"
              >
                <Megaphone size={17} />
                Terbitkan
              </button>
            </form>
          </div>

          <div id="agenda-admin" className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-leaf-700">
              Kelola Acara / Agenda
            </p>
            <h2 className="mt-1 font-heading text-2xl font-bold text-stonewarm-950">
              Agenda desa mendatang
            </h2>
            <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={addAgenda}>
              <input
                value={agendaTitle}
                onChange={(event) => setAgendaTitle(event.target.value)}
                placeholder="Contoh: Musyawarah Padukuhan"
                className="h-11 min-w-0 flex-1 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] px-3 outline-none focus:border-leaf-700"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-4 py-3 text-sm font-bold text-white hover:bg-leaf-700"
              >
                <CalendarPlus size={17} />
                Tambah
              </button>
            </form>

            <div className="mt-5 grid gap-3">
              {adminNews.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="grid gap-2 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] p-4 sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-leaf-700">
                      {item.type}
                    </p>
                    <p className="mt-1 font-bold text-stonewarm-950">{item.title}</p>
                    <p className="mt-1 text-sm text-stonewarm-700">{item.excerpt}</p>
                  </div>
                  <time className="text-sm font-bold text-stonewarm-700">
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }).format(new Date(item.date))}
                  </time>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="statistik-admin" className="mt-6">
          <AdminChartPanel title="Jumlah Penduduk per Padukuhan">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={populationByHamlet}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E1D5" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2E7D32" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </AdminChartPanel>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
      <Icon className="text-leaf-800" size={23} />
      <p className="mt-4 font-heading text-3xl font-bold text-stonewarm-950">
        {formatNumber(value)}
      </p>
      <p className="mt-1 text-sm font-semibold text-stonewarm-700">{label}</p>
    </div>
  );
}

function AdminChartPanel({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[8px] border border-stonewarm-200 bg-white p-5 shadow-line">
      <p className="mb-4 font-heading text-xl font-bold text-stonewarm-950">{title}</p>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  required,
  type = "text"
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
      />
    </label>
  );
}

function ImageInput({
  label,
  value,
  onChange,
  folder,
  onStatus,
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  folder: string;
  onStatus: (message: string) => void;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const isDataUrl = value.startsWith("data:");
  const isPublicPath = value.startsWith("/") || value.startsWith("http");
  const urlStatus = isDataUrl
    ? "Mode lokal: bukan URL publik"
    : isPublicPath
      ? "URL/path gambar siap dipakai"
      : "Belum ada URL gambar";

  async function copyCurrentValue() {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onStatus("URL gambar sudah disalin.");
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      onStatus("URL gambar belum bisa disalin otomatis. Salin manual dari kolom URL.");
    }
  }

  async function handleFile(file: File) {
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      return;
    }

    try {
      setUploading(true);

      if (isStorageReady()) {
        const url = await uploadImageFile(file, folder);
        onChange(url);
        onStatus("Upload gambar berhasil. URL Storage sudah masuk ke form.");
        return;
      }

      if (file.size > 700 * 1024) {
        throw new Error(
          "Mode lokal hanya menerima gambar kecil. Untuk upload online, aktifkan Firebase Storage."
        );
      }

      const dataUrl = await readImageFile(file);
      onChange(dataUrl);
      onStatus("Mode lokal: gambar dipakai sebagai pratinjau browser.");
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : "Upload gambar gagal.";
      setError(message);
      onStatus(`Upload gagal: ${message}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
      {label}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder="URL gambar akan terisi otomatis setelah upload"
        className="h-11 rounded-[8px] border border-stonewarm-200 bg-white px-3 outline-none focus:border-leaf-700"
      />
      <div className="grid gap-3 rounded-[8px] border border-dashed border-leaf-800/25 bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center">
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            void handleFile(file);
          }}
          className="min-w-0 text-sm font-semibold file:mr-3 file:rounded-[8px] file:border-0 file:bg-leaf-100 file:px-3 file:py-2 file:font-bold file:text-leaf-800 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <span className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-100 px-3 py-2 text-xs font-bold text-leaf-800">
          <UploadCloud size={15} />
          {uploading
            ? "Mengupload..."
            : isStorageReady()
              ? "Firebase Storage"
              : "Mode lokal"}
        </span>
      </div>
      {value ? (
        <div className="relative h-44 overflow-hidden rounded-[8px] border border-stonewarm-200 bg-white">
          <Image
            src={value}
            alt={`Preview ${label}`}
            fill
            unoptimized={shouldUseUnoptimizedImage(value)}
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      ) : null}
      {value ? (
        <div className="grid gap-2 rounded-[8px] border border-stonewarm-200 bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold text-stonewarm-950">{urlStatus}</p>
            <button
              type="button"
              onClick={copyCurrentValue}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-[8px] bg-stonewarm-950 px-3 text-xs font-bold text-white hover:bg-stonewarm-800"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Tersalin" : "Salin URL"}
            </button>
          </div>
          <p className="truncate rounded-[8px] bg-stonewarm-100 px-3 py-2 text-xs font-semibold text-stonewarm-700">
            {isDataUrl
              ? "Firebase Storage belum aktif di runtime ini, jadi file hanya menjadi data preview lokal."
              : value}
          </p>
        </div>
      ) : null}
      {error ? (
        <p className="rounded-[8px] bg-amber-100 px-3 py-2 text-xs font-semibold leading-5 text-stonewarm-950">
          {error}
        </p>
      ) : (
        <p className="text-xs font-semibold leading-5 text-stonewarm-700">
          {isStorageReady()
            ? "File gambar akan diupload dan disimpan sebagai URL publik."
            : "Firebase Storage belum aktif; gunakan URL gambar atau file kecil untuk preview lokal."}
        </p>
      )}
    </label>
  );
}

function readImageFile(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueSlug(base: string, usedIds: string[]) {
  const fallback = base || `item-${Date.now()}`;
  let candidate = fallback;
  let counter = 2;

  while (usedIds.includes(candidate)) {
    candidate = `${fallback}-${counter}`;
    counter += 1;
  }

  return candidate;
}

function toAdminUmkmRecord(umkm: Umkm): AdminUmkmRecord {
  return {
    id: umkm.id,
    name: umkm.name,
    category: umkm.category,
    whatsapp: umkm.whatsapp,
    productCount: umkm.productCount,
    hamletId: umkm.hamletId,
    status: umkm.verified ? "Aktif" : "Draft"
  };
}
