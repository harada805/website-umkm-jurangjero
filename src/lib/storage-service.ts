import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { hasFirebaseStorageConfig, storage } from "./firebase";

const maxImageSize = 5 * 1024 * 1024;

export function isStorageReady() {
  return hasFirebaseStorageConfig;
}

function safeSegment(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/(^-|-$)/g, "") || "upload";
}

export async function uploadImageFile(file: File, folder: string) {
  if (!isStorageReady()) {
    throw new Error("Firebase Storage belum dikonfigurasi.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("File harus berupa gambar.");
  }

  if (file.size > maxImageSize) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }

  const extension = file.name.includes(".")
    ? file.name.split(".").pop()
    : file.type.split("/").pop() ?? "jpg";
  const cleanFolder = safeSegment(folder).replace(/\./g, "-");
  const cleanName = safeSegment(file.name.replace(/\.[^.]+$/, ""));
  const path = `admin-uploads/${cleanFolder}/${Date.now()}-${cleanName}.${extension}`;
  const imageRef = ref(storage, path);

  await uploadBytes(imageRef, file, {
    contentType: file.type,
    customMetadata: {
      originalName: file.name
    }
  });

  return getDownloadURL(imageRef);
}
