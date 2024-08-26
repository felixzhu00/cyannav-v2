'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import logo_white from '@/public/logo-text-white.png'
import logo_black from '@/public/logo-text-black.png'

const Navigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="#intro" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              Getting Started
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="#features" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              {' '}
              Features
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="#community" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              {' '}
              Community
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="#pricing" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              {' '}
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              {' '}
              Support
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/login" legacyBehavior passHref>
            <Button variant="default">Log In/ Sign Up</Button>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default function Header() {
  const { theme } = useTheme()
  return (
    <header className="flex items-center justify-between px-16 py-7 shadow-md">
      <Link href="/" passHref>
        <Image
          src={theme === 'dark' ? logo_white : logo_black}
          alt="Logo"
          width={157}
          height={65}
          objectFit="cover"
          priority
        />
      </Link>

      <Navigation />
    </header>
  )
}
