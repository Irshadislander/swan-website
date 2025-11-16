import fs from 'fs'
import path from 'path'

const SITE_URL = process.env.VITE_SITE_URL || 'https://swan.org'

const staticPaths = [
  '/',
  '/urgent',
  '/our-work',
  '/media',
  '/ways-to-give',
  '/regions',
  '/advocacy',
  '/stock-donations',
  '/zakat',
  '/orphan-sponsorship',
  '/donate',
  '/stories',
  '/volunteer',
  '/contact',
  '/causes/education',
  '/causes/health',
  '/causes/empowerment',
]

const now = new Date().toISOString()

const urls = staticPaths
  .map(
    (route) => `
  <url>
    <loc>${SITE_URL.replace(/\/$/, '')}${route}</loc>
    <lastmod>${now}</lastmod>
  </url>`
  )
  .join('')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

const outPath = path.resolve(process.cwd(), 'public', 'sitemap.xml')
fs.writeFileSync(outPath, xml.trim())
console.log(`Sitemap generated at ${outPath}`)
