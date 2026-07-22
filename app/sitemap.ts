import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://docwave.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
    ...tools.map((tool) => ({
      url: `${baseUrl}${tool.href}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
