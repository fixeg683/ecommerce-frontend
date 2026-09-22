const API_URL = "https://backend-ecommerce-3-2hqt.onrender.com/api/products/";

export default async function handler(req, res) {
  try {
    const response = await fetch(API_URL, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Products API returned ${response.status}`);
    }

    const data = await response.json();
    const products = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);

    const urls = [
      `  <url>\n    <loc>https://nexusmall.sbs/</loc>\n  </url>`,
      ...products
        .filter((product) => product && product.id != null)
        .map((product) => `  <url>\n    <loc>https://nexusmall.sbs/product/${encodeURIComponent(product.id)}</loc>\n  </url>`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.status(500).send(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://nexusmall.sbs/</loc></url>\n</urlset>\n`
    );
  }
}
