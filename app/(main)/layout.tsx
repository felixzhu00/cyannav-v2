import Header from '@/components/header/header'
import Footer from '@/components/footer/footer'
// import ThemeToggle from '@/components/theme-toggle';
// import ThemeProvider from '@/components/theme-provider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
