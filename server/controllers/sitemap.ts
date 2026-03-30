import Shoe from '../models/shoe';

const BASE_URL = 'https://www.neurimshoes.co.il';

const staticUrls = [
  { loc: '/',               changefreq: 'weekly',  priority: '1.0' },
  { loc: '/נעלי/נעליים',    changefreq: 'daily',   priority: '0.9' },
  { loc: '/נעלי/נשים',      changefreq: 'daily',   priority: '0.9' },
  { loc: '/נעלי/גברים',     changefreq: 'daily',   priority: '0.9' },
  { loc: '/נעלי/ילדים',     changefreq: 'daily',   priority: '0.9' },
  { loc: '/נעלי/ילדות',     changefreq: 'daily',   priority: '0.9' },
  { loc: '/about',          changefreq: 'monthly', priority: '0.5' },
  { loc: '/findus',         changefreq: 'monthly', priority: '0.5' },
  { loc: '/sendusmsg',      changefreq: 'monthly', priority: '0.4' },
  { loc: '/סרגל_מידות',     changefreq: 'monthly', priority: '0.4' },
];

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function generateSitemap(req, res) {
  try {
    const shoes = await Shoe.find({ active: true }, 'id name company imagesGroup').lean();

    const today = new Date().toISOString().split('T')[0];

    const staticEntries = staticUrls.map(u => `
  <url>
    <loc>${BASE_URL}${encodeURI(u.loc)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('');

    const shoeEntries = shoes.map(shoe => {
      const niceName = (shoe.name || '').replace(/\s+/g, '-').toLowerCase();
      const colors = (shoe.imagesGroup || []).map((ig: any) => ig.color).join('-');
      const firstColor = (shoe.imagesGroup || [])[0]?.color || '';
      const loc = `/נעל/${shoe.company}-${niceName}-${colors}/${shoe.id}/צבע/${firstColor}`;
      return `
  <url>
    <loc>${escapeXml(BASE_URL + encodeURI(loc))}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${shoeEntries}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).send('Error generating sitemap');
  }
}
