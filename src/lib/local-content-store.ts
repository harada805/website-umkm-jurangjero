import type {
  CitizenStoryRecord,
  GalleryItem,
  NewsItem,
  TourismSpot,
  Umkm
} from "./types";

const localContentEvent = "jurang-jero-local-content-updated";

const localContentKeys = {
  umkms: "jurang-jero:content:umkms",
  news: "jurang-jero:content:news",
  citizenStories: "jurang-jero:content:citizen-stories",
  tourismSpots: "jurang-jero:content:tourism-spots",
  galleryItems: "jurang-jero:content:gallery-items"
} as const;

type LocalContentKey = keyof typeof localContentKeys;

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readCollection<T>(key: LocalContentKey, fallback: T[]) {
  if (!canUseBrowserStorage()) return fallback;

  try {
    const stored = window.localStorage.getItem(localContentKeys[key]);
    if (!stored) return fallback;

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeCollection<T>(key: LocalContentKey, items: T[]) {
  if (!canUseBrowserStorage()) return;

  try {
    window.localStorage.setItem(localContentKeys[key], JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent(localContentEvent, {
        detail: { key }
      })
    );
  } catch (error) {
    console.warn("Local content cache could not be written.", error);
  }
}

export function subscribeLocalContent(
  keys: LocalContentKey[],
  callback: () => void
) {
  if (!canUseBrowserStorage()) return () => undefined;

  const keySet = new Set(keys);

  function onLocalUpdate(event: Event) {
    const detail = (event as CustomEvent<{ key?: LocalContentKey }>).detail;
    if (!detail?.key || keySet.has(detail.key)) callback();
  }

  function onStorage(event: StorageEvent) {
    if (
      event.key &&
      Object.entries(localContentKeys).some(
        ([name, storageKey]) => storageKey === event.key && keySet.has(name as LocalContentKey)
      )
    ) {
      callback();
    }
  }

  window.addEventListener(localContentEvent, onLocalUpdate);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(localContentEvent, onLocalUpdate);
    window.removeEventListener("storage", onStorage);
  };
}

export function readLocalUmkms(fallback: Umkm[]) {
  return readCollection<Umkm>("umkms", fallback);
}

export function saveLocalUmkms(items: Umkm[]) {
  writeCollection("umkms", items);
}

export function readLocalNewsItems(fallback: NewsItem[]) {
  return readCollection<NewsItem>("news", fallback);
}

export function saveLocalNewsItems(items: NewsItem[]) {
  writeCollection("news", items);
}

export function readLocalCitizenStories(fallback: CitizenStoryRecord[]) {
  return readCollection<CitizenStoryRecord>("citizenStories", fallback);
}

export function saveLocalCitizenStories(items: CitizenStoryRecord[]) {
  writeCollection("citizenStories", items);
}

export function readLocalTourismSpots(fallback: TourismSpot[]) {
  return readCollection<TourismSpot>("tourismSpots", fallback);
}

export function saveLocalTourismSpots(items: TourismSpot[]) {
  writeCollection("tourismSpots", items);
}

export function readLocalGalleryItems(fallback: GalleryItem[]) {
  return readCollection<GalleryItem>("galleryItems", fallback);
}

export function saveLocalGalleryItems(items: GalleryItem[]) {
  writeCollection("galleryItems", items);
}
