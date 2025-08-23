import type { MetadataRoute } from 'next'
import { host } from '@/lib/i18n/config'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/'
      }
    ],
    sitemap: `${host}/sitemap.xml`,
  }
}