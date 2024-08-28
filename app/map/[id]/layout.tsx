import ThemeProvider from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { Provider } from 'jotai'
import React from 'react'

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <Provider>{children}</Provider>
    </ThemeProvider>
  )
}
