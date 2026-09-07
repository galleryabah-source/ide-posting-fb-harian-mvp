import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ide Posting FB Harian",
  description: "Ide konten Facebook harian yang sederhana, praktis, dan siap dikembangkan untuk affiliate.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
