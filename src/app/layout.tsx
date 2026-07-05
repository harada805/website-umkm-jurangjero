import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jurang Jero Digital",
  description:
    "Digital Village Platform untuk Desa Jurang Jero, Ngawen, Gunungkidul, Yogyakarta.",
  metadataBase: new URL("https://jurangjero.digital"),
  openGraph: {
    title: "Jurang Jero Digital",
    description:
      "Tradition Meets Digital Future: profil desa, UMKM, wisata, peta padukuhan, dan dashboard desa.",
    images: ["/images/jurang-jero-hero.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-[#FAFAFA] font-body antialiased">{children}</body>
    </html>
  );
}
