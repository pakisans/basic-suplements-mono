import { SERVER_URL } from '@/constants'

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    sitemap: `${SERVER_URL}/sitemap.xml`,
  }
}
