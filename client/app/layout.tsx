import type { Metadata } from 'next'
import './globals.css'
import Header from './components/header'
import LoadingIndicator from './components/LoadingIndicator'

export const metadata: Metadata = {
  title: 'Veggie Quiz',
  description: 'Test your knowledge about Plant-based, nutrition, sustainability, ethics, history, science, and culture.',
  keywords: ['health', 'food', 'nutrition', 'trivia', 'quiz'],
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/site.webmanifest',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ]
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-green-50">
        <LoadingIndicator />
        <div className="container mx-auto px-4 py-4">
          <Header />
          <main className="mt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}