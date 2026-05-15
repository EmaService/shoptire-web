import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/pedido/'],
    },
    sitemap: 'https://shoptire-web.vercel.app/sitemap.xml',
  };
}