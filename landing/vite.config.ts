import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function seoPublicFiles(siteUrl: string) {
  const origin = siteUrl.replace(/\/$/, "");
  return {
    name: "gympulse-seo-public-files",
    writeBundle(outputOptions: { dir?: string }) {
      const outDir = outputOptions.dir ?? path.resolve(rootDir, "dist");
      const robots = `User-agent: *
Allow: /

Allow: /og-image.jpg
Allow: /logo.png
Allow: /image1.png
Allow: /image2.png
Allow: /media/

Disallow: /src/
Disallow: /node_modules/

Sitemap: ${origin}/sitemap.xml
`;
      const lastmod = new Date().toISOString().slice(0, 10);
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${origin}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${origin}/og-image.jpg</image:loc>
      <image:title>GymPulse gym floor</image:title>
      <image:caption>Athletes training at GymPulse</image:caption>
    </image:image>
    <image:image>
      <image:loc>${origin}/logo.png</image:loc>
      <image:title>GymPulse logo</image:title>
    </image:image>
  </url>
</urlset>
`;
      writeFileSync(path.join(outDir, "robots.txt"), robots);
      writeFileSync(path.join(outDir, "sitemap.xml"), sitemap);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "");
  const siteUrl = env.VITE_SITE_URL || "http://localhost:4321";

  return {
    plugins: [vue(), seoPublicFiles(siteUrl)],
    // Ensure HTML %VITE_SITE_URL% replacement always has a value
    envPrefix: ["VITE_"],
    server: {
      port: 4321,
    },
  };
});
