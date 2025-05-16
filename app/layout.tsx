import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// import ThemeToggle from '@/components/theme-toggle';
// import ThemeProvider from '@/components/theme-provider';
import SessionWrapper from '@/components/session-wrapper'
import ThemeProvider from '@/components/theme-provider'
import Footer from '@/components/footer/footer'

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
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} flex min-h-screen flex-col`}>
                <SessionWrapper>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <main className="flex-grow">{children}</main>
                        <Footer />

                    </ThemeProvider>
                </SessionWrapper>

            </body>
        </html>
    )
}
