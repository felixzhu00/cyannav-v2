import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/landing/header'
import Footer from '@/components/landing/footer'
import { Toaster } from '@/components/ui/toaster'
import { headers } from 'next/headers';


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

  // get pathname
  const headersList = headers();
  const fullUrl = headersList.get('referer') || "";
  // url Object
  const url = new URL(fullUrl);
  // Get the pathname from the URL
  const {pathname} = url;
  // Extract the /map/ part
  const mapSegment = pathname.split('/')[1];
  // Create boolean for map path
  const isMap = mapSegment !== 'map'
  
  

  return (
    <html lang="en">
      <body className={inter.className}>
        {isMap && <Toaster/>}
        {isMap && <Header/>}
        {children}
        {isMap && <Footer/>}
      </body>
    </html>
  )
}
