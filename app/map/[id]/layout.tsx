import ThemeProvider from '@/components/theme-provider'
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
      <Provider>{children}</Provider>
    </ThemeProvider>
  )
}
