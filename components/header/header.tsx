import * as React from 'react'
import Navbar from './navbar'
import LogoTheme from '../landing/logo-theme'

export default async function Header() {
  return (
    <header className="relative z-50 flex items-center justify-between px-14 py-7 shadow-md">
      {/* <LogoTheme /> */}
      <Navbar />
    </header>
  )
}
