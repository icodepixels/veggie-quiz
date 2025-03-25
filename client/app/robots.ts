import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://healthfoodtrivia.com/sitemap.xml', // TODO: Replace with your actual domain
  }
}