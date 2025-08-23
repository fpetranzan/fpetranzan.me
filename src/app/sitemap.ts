import { MetadataRoute } from 'next'
import { host, locales, pathnames } from '@/lib/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = host
  const sitemap: MetadataRoute.Sitemap = []
  
  // Add pages for each locale
  Object.entries(pathnames).forEach(([defaultPath, localizedPaths]) => {
    locales.forEach(locale => {
      const localizedPath = typeof localizedPaths === 'string' 
        ? localizedPaths 
        : localizedPaths[locale as keyof typeof localizedPaths]
      
      const url = `${baseUrl}/${locale}${localizedPath === '/' ? '' : localizedPath}`
      
      // Create alternates for this page
      const alternates: Record<string, string> = {}
      locales.forEach(altLocale => {
        const altPath = typeof localizedPaths === 'string'
          ? localizedPaths
          : localizedPaths[altLocale as keyof typeof localizedPaths]
        alternates[altLocale] = `${baseUrl}/${altLocale}${altPath === '/' ? '' : altPath}`
      })
      
      sitemap.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: defaultPath === '/' ? 1 : 0.8,
        alternates: {
          languages: alternates
        }
      })
    })
  })
  
  return sitemap
}