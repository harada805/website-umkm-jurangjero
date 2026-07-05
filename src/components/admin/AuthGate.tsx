"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { ShieldCheck, LogOut, Settings } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { auth, hasFirebaseConfig } from "@/lib/firebase";

export function AuthGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [localAuthed, setLocalAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLocalPreview = !hasFirebaseConfig && process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (isLocalPreview) {
      const authed = window.sessionStorage.getItem("jj_admin_session") === "demo";
      setLocalAuthed(authed);
      setLoading(false);
      if (!authed && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
      return;
    }

    if (!hasFirebaseConfig) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser && pathname !== "/admin/login") {
        router.replace("/admin/login");
      }
    });

    return () => unsubscribe();
  }, [isLocalPreview, pathname, router]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#FAFAFA] px-5">
        <div className="rounded-[8px] border border-stonewarm-200 bg-white p-6 text-center shadow-line">
          <ShieldCheck className="mx-auto text-leaf-800" size={28} />
          <p className="mt-3 font-heading text-xl font-bold">Memeriksa akses admin</p>
        </div>
      </div>
    );
  }

  if (!hasFirebaseConfig && !isLocalPreview) {
    return (
      <AdminAccessFrame>
        <div className="rounded-[8px] border border-amber-500/30 bg-amber-100 p-6">
          <Settings className="text-amber-700" size={28} />
          <h1 className="mt-4 font-heading text-2xl font-bold text-stonewarm-950">
            Firebase belum dikonfigurasi
          </h1>
          <p className="mt-3 leading-7 text-stonewarm-700">
            Isi `.env.local` dari `.env.example`, aktifkan Firebase
            Authentication email/password, lalu jalankan ulang aplikasi.
          </p>
        </div>
      </AdminAccessFrame>
    );
  }

  if ((!isLocalPreview && !user) || (isLocalPreview && !localAuthed)) {
    return (
      <AdminAccessFrame>
        <div className="rounded-[8px] border border-stonewarm-200 bg-white p-6 shadow-line">
          <ShieldCheck className="text-leaf-800" size={28} />
          <h1 className="mt-4 font-heading text-2xl font-bold text-stonewarm-950">
            Akses dashboard dibatasi
          </h1>
          <p className="mt-3 leading-7 text-stonewarm-700">
            Masuk dengan akun admin desa. Di lokal tersedia akun demo; di
            production gunakan akun Firebase Authentication.
          </p>
          <Link
            href="/admin/login"
            className="mt-5 inline-flex rounded-[8px] bg-leaf-800 px-5 py-3 text-sm font-bold text-white hover:bg-leaf-700"
          >
            Masuk Admin
          </Link>
        </div>
      </AdminAccessFrame>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <header className="border-b border-stonewarm-200 bg-white px-5 py-4 shadow-line">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-leaf-800 font-heading font-black text-white">
              JJ
            </span>
            <div>
              <p className="font-heading font-bold text-stonewarm-950">
                Admin Jurang Jero
              </p>
              <p className="text-xs text-stonewarm-700">
                {isLocalPreview ? "Admin demo lokal" : user?.email}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => {
              if (isLocalPreview) {
                window.sessionStorage.removeItem("jj_admin_session");
                router.replace("/admin/login");
                return;
              }
              void signOut(auth);
            }}
            className="inline-flex items-center gap-2 rounded-[8px] border border-stonewarm-200 px-4 py-2 text-sm font-bold text-stonewarm-950 hover:bg-stonewarm-100"
          >
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </header>

      {isLocalPreview ? (
        <div className="border-b border-amber-500/30 bg-amber-100 px-5 py-3 text-sm text-stonewarm-950">
          <div className="mx-auto max-w-7xl">
            Mode pratinjau lokal aktif karena Firebase belum diisi. Di production,
            dashboard tetap terkunci oleh Firebase Authentication.
          </div>
        </div>
      ) : null}

      {children}
    </div>
  );
}

function AdminAccessFrame({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#FAFAFA] px-5 py-12">
      <div className="w-full max-w-xl">{children}</div>
    </main>
  );
}
