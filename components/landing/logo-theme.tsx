'use client'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import logo_white from '@/public/logo-text-white.png'
import logo_black from '@/public/logo-text-black.png'

export default function LogoTheme() {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null


  const isDark = theme === 'dark'
  const logoSrc = isDark
    ? '/logo-text-white.png'
    : '/logo-text-black.png'


  return (
    <Link href="/" passHref suppressHydrationWarning>
      <Image
        src={logoSrc}
        alt="Logo"
        width={157}
        height={65}
        className="object-contain"
        priority
      />
    </Link>
  )
}
