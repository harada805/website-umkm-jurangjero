"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { auth, hasFirebaseConfig } from "@/lib/firebase";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!hasFirebaseConfig) {
      if (
        process.env.NODE_ENV !== "production" &&
        email.trim().toLowerCase() === "admin@jurangjero.local" &&
        password === "Jurangjero2026!"
      ) {
        window.sessionStorage.setItem("jj_admin_session", "demo");
        router.push("/admin");
        return;
      }

      setError(
        "Firebase belum dikonfigurasi. Untuk demo lokal gunakan admin@jurangjero.local / Jurangjero2026!."
      );
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      setError("Email atau kata sandi tidak cocok, atau akun belum terdaftar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#FAFAFA] px-5 py-12">
      <div className="w-full max-w-md rounded-[8px] border border-stonewarm-200 bg-white p-6 shadow-soft">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-leaf-800 hover:text-leaf-700"
        >
          <ArrowLeft size={17} />
          Kembali ke website
        </Link>
        <div className="mt-8">
          <ShieldCheck className="text-leaf-800" size={34} />
          <h1 className="mt-4 font-heading text-3xl font-bold text-stonewarm-950">
            Masuk Admin
          </h1>
          <p className="mt-3 leading-7 text-stonewarm-700">
            Akses dashboard hanya untuk akun yang sudah dibuat di Firebase
            Authentication.
          </p>
          {!hasFirebaseConfig ? (
            <p className="mt-4 rounded-[8px] bg-amber-100 px-4 py-3 text-sm font-semibold leading-6 text-stonewarm-950">
              Demo lokal: admin@jurangjero.local / Jurangjero2026!
            </p>
          ) : null}
        </div>

        <form className="mt-7 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="h-12 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] px-4 outline-none focus:border-leaf-700"
              placeholder="admin@jurangjero.desa.id"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-stonewarm-950">
            Kata sandi
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="h-12 rounded-[8px] border border-stonewarm-200 bg-[#FAFAFA] px-4 outline-none focus:border-leaf-700"
              placeholder="Masukkan kata sandi"
            />
          </label>

          {error ? (
            <p className="rounded-[8px] bg-amber-100 px-4 py-3 text-sm font-semibold text-stonewarm-950">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-leaf-800 px-5 py-3 text-sm font-bold text-white hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogIn size={17} />
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
      </div>
    </main>
  );
}
