'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Switch } from '@/components/ui/switch'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <div className="flex items-center space-x-2">
      <Sun
        className={`h-[1.2rem] w-[1.2rem] ${
          theme === 'light' ? 'fill-current text-yellow-500' : 'text-gray-400'
        }`}
      />
      <Switch id="appearance-switch" onClick={toggleTheme} />
      <Moon
        className={`h-[1.2rem] w-[1.2rem] ${
          theme === 'dark' ? 'fill-current text-blue-500' : 'text-gray-400'
        }`}
      />
    </div>
  )
}
