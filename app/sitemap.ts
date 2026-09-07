import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["/", "/ide-postingan-facebook", "/tentang", "/privasi", "/ketentuan", "/affiliate"];
  return pages.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: path === "/" ? "daily" : "weekly", priority: path === "/" ? 1 : 0.7 }));
}
