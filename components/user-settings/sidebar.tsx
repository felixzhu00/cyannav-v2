import React from 'react'
import Link from 'next/link'
import { ChevronLeft, Settings2, File } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar({ view }: { view: string | string[] }) {
  return (
    <div>
      <div className="z-40 inline-block h-full max-w-xs bg-zinc-100">
        <div className="h-full space-y-8 px-6 pt-12">
          <Link
            href="/"
            className="flex flex-row items-center space-x-3.5 text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            <p>Go Back</p>
          </Link>
          <div className="flex flex-col justify-center space-y-8">
            <Link
              href="/user?view=settings"
              className={cn(
                'flex flex-row items-center space-x-2.5',
                view === 'settings' ? 'font-bold' : ''
              )}
            >
              <Settings2 className="h-6 w-6" />
              <p>Profile Settings</p>
            </Link>
            <Link
              href="/user?view=transactions"
              className={cn(
                'flex flex-row items-center space-x-2.5',
                view === 'transactions' ? 'font-bold' : ''
              )}
            >
              <File className="h-6 w-6" />
              <p>Transaction History</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
