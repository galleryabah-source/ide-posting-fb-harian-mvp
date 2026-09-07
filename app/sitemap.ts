import type { MetadataRoute } from "next";
import { getNiches } from "../lib/content-engine";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const pages = ["/", "/ide-postingan-facebook", "/tentang", "/privasi", "/ketentuan", "/affiliate"];
  const nichePages = getNiches().map((item) => `/ide/${item.id}`);
  return [...pages, ...nichePages].map((path) => ({
    url: `${baseUrl}${path}`,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
