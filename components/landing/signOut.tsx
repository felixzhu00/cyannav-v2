'use client'
import React from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Power } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function SignOut() {
  return (
    <DropdownMenuItem
      onClick={() => signOut()}
      className="flex flex-row items-center gap-2"
    >
      <Power className="h-4 w-4" />
      <p>Sign Out</p>
    </DropdownMenuItem>
  )
}
