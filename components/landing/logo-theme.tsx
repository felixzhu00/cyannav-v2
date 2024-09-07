'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import logo_white from '@/public/logo-text-white.png'
import logo_black from '@/public/logo-text-black.png'

export default function LogoTheme() {
  const { theme } = useTheme()
  return (
    <Link href="/" passHref>
      <Image
        src={theme === 'dark' ? logo_white : logo_black}
        alt="Logo"
        width={157}
        height={65}
        className="object-contain"
        priority
      />
    </Link>
  )
}
