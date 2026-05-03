import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://founder-os.replit.app/sitemap.xml',
    host: 'https://founder-os.replit.app',
  };
}
