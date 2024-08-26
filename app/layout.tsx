import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/landing/header'
import Footer from '@/components/landing/footer'
import { Toaster } from '@/components/ui/toaster'
import ThemeProvider from '@/components/theme-provider'
import SessionWrapper from '@/components/SessionWrapper'

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
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Toaster />
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </SessionWrapper>
  )
}
