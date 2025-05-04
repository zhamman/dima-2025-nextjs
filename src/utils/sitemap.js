import { works } from "../data/videos";

const BASE_URL = "https://dmitriyusov.com";

const generateSitemap = () => {
  const pages = [
    { url: "", priority: 1.0, changefreq: "daily" },
    { url: "/about", priority: 0.8, changefreq: "weekly" },
    { url: "/works", priority: 0.9, changefreq: "daily" },
    { url: "/contact", priority: 0.7, changefreq: "monthly" },
  ];

  // Add video pages
  const videoPages = works.map(work => ({
    url: `/video/${work.id}`,
    priority: 0.8,
    changefreq: "weekly",
  }));

  const allPages = [...pages, ...videoPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      page => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return sitemap;
};

export default generateSitemap;
