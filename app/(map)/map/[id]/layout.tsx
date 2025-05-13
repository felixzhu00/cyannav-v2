import { LeftToast } from '@/components/map-editor/bottom-left-toaster'
import { Toaster } from '@/components/ui/toaster'
import { Provider } from 'jotai'
import React from 'react'

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (

    <>      <Toaster />
      <LeftToast message="For the best experience, please enable hardware acceleration in your browser settings." />
      <Provider>{children}</Provider></>
  )
}
