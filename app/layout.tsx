import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header/header'
import Footer from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import { headers } from 'next/headers'
// import ThemeToggle from '@/components/theme-toggle';
// import ThemeProvider from '@/components/theme-provider';
import SessionWrapper from '@/components/session-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CyanNav v2',
  description: 'Defining a new world in map editing.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let isMap = false
  const headersList = headers()

  // Get the referer URL from the headers, or fall back to an empty string
  const refererUrl = headersList.get('referer') || ''

  if (refererUrl) {
    try {
      // Create a URL object from the referer URL
      const url = new URL(refererUrl)

      // Get the pathname from the URL
      const { pathname } = url

      // Determine if the pathname starts with '/map'
      isMap = !pathname.startsWith('/map/')
    } catch (error) {
      console.error('Invalid URL:', error)
    }
  }

  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col`}>
        <SessionWrapper>
          {isMap && <Toaster />}
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SessionWrapper>
      </body>
    </html>
  )
}
