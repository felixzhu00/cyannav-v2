'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import {
  Clock,
  File,
  LayoutTemplate,
  Users,
  Share2,
  Star,
  Import,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import TemplateDialog from '@/components/dashboard/dialogs/templates-dialog'
import ImportMapDialog from '@/components/dashboard/dialogs/import-maps-dialog'

export default function DashboardSidebar({
  view,
}: {
  view: string | string[]
}) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  const handleTemplateClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setIsTemplateDialogOpen(true) // Open the template dialog
  }

  const handleTemplateDialogClose = () => {
    setIsTemplateDialogOpen(false)
  }

  const handleImportClick = () => {
    setIsImportDialogOpen(true)
  }

  const handleImportDialogClose = () => {
    setIsImportDialogOpen(false)
  }

  return (
    <div className="min-h-screen">
      <div className="z-40 mb-20 inline-block h-full max-w-xs bg-zinc-100">
        <div className="h-full space-y-8 px-6 pt-12">
          <div className="flex flex-col justify-center space-y-8">
            <Link
              href="/dashboard?view=recent-maps"
              className={cn(
                'flex flex-row items-center space-x-2.5',
                view === 'recent-maps' ? 'font-bold' : ''
              )}
            >
              <Clock className="h-6 w-6" />
              <p>Recent Maps</p>
            </Link>
            <Link
              href="/dashboard?view=my-maps"
              className={cn(
                'flex flex-row items-center space-x-2.5',
                view === 'my-maps' ? 'font-bold' : ''
              )}
            >
              <File className="h-6 w-6" />
              <p>My Maps</p>
            </Link>
            <a
              href="#"
              onClick={handleTemplateClick}
              className={cn('flex flex-row items-center space-x-2.5')}
            >
              <LayoutTemplate className="h-6 w-6" />
              <p>Templates</p>
            </a>
            <Link
              href="/dashboard?view=community"
              className={cn(
                'flex flex-row items-center space-x-2.5',
                view === 'community' ? 'font-bold' : ''
              )}
            >
              <Users className="h-6 w-6" />
              <p>Community</p>
            </Link>
            <Link
              href="/dashboard?view=shared-with-me"
              className={cn(
                'flex flex-row items-center space-x-2.5',
                view === 'shared-with-me' ? 'font-bold' : ''
              )}
            >
              <Share2 className="h-6 w-6" />
              <p>Shared with me</p>
            </Link>
            <Link
              href="/dashboard?view=starred-maps"
              className={cn(
                'flex flex-row items-center space-x-2.5',
                view === 'starred-maps' ? 'font-bold' : ''
              )}
            >
              <Star className="h-6 w-6" />
              <p>Starred Maps</p>
            </Link>
          </div>
          <Button onClick={handleImportClick} className="gap-x-2.5">
            <Import />
            Import Map
          </Button>
        </div>
      </div>

      {/* Render the TemplateDialog and control its open/close state */}
      {isTemplateDialogOpen && (
        <TemplateDialog
          isOpen={isTemplateDialogOpen}
          onClose={handleTemplateDialogClose}
        />
      )}

      {/* Render the ImportMapDialog and control its open/close state */}
      {isImportDialogOpen && (
        <ImportMapDialog
          isOpen={isImportDialogOpen}
          onClose={handleImportDialogClose}
        />
      )}
    </div>
  )
}
