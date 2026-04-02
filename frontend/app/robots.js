import { SERVER_URL } from '@/constants'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${SERVER_URL}/sitemap.xml`,
  }
}
