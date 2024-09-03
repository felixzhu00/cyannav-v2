import * as React from 'react'
import { auth } from '@/lib/auth'
import Navbar from './navbar'
import LogoTheme from './logoTheme'

export default async function Header() {
  const session = await auth()
  return (
    <header className="flex items-center justify-between px-16 py-7 shadow-md">
      <LogoTheme />
      <Navbar session={session} />
    </header>
  )
}
