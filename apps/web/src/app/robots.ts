import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin/', '/api/', '/settings/'],
      },
    ],
    sitemap: 'http://localhost:5000/sitemap.xml',
  };
}
