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
import TemplateDialog from '@/components/dashboard/dialogs/template/templates-dialog'
import ImportMapDialog from '@/components/dashboard/dialogs/import-maps-dialog'

export default function DashboardSidebar({
  view,
}: {
  view: string | string[]
}) {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleTemplateClick = () => {
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

  const handleAddClick = () => {
    setIsImportDialogOpen(true)
  }

  const handleAddDialogClose = () => {
    setIsImportDialogOpen(false)
  }

  const baseLinkClass =
    'flex flex-row items-center space-x-2.5 px-4 py-2 my-2 border-l-4 border-l-transparent w-52'
  const iconClass = 'h-6 w-6'

  const sidebarLinks = [
    // {
    //   label: 'Recent Maps',
    //   href: '/dashboard?view=recent-maps',
    //   icon: Clock,
    //   viewKey: 'recent-maps',
    // },
    {
      label: 'My Maps',
      href: '/dashboard?view=my-maps',
      icon: File,
      viewKey: 'my-maps',
      id: 'sidebar-mymaps',
    },
    {
      label: 'Community',
      href: '/dashboard?view=community',
      icon: Users,
      viewKey: 'community',
      id: 'sidebar-community',
    },
    {
      label: 'Shared with me',
      href: '/dashboard?view=shared-with-me',
      icon: Share2,
      viewKey: 'shared-with-me',
      id: 'sidebar-shared',
    },
    {
      label: 'Starred Maps',
      href: '/dashboard?view=starred-maps',
      icon: Star,
      viewKey: 'starred-maps',
      id: 'sidebar-starred',
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="z-40 mb-20 inline-block h-full max-w-lg bg-sidebar-accent">
        <div className="h-full space-y-4 px-12 pt-12">
          <div className="flex flex-col justify-center">
            {sidebarLinks.map(({ label, href, icon: Icon, viewKey, id }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  baseLinkClass,
                  view === viewKey && 'border-l-primary font-extrabold'
                )}
                id={id}
              >
                <Icon className={iconClass} />
                <p>{label}</p>
              </Link>
            ))}
          </div>
          <Button
            onClick={handleTemplateClick}
            className={cn(baseLinkClass, 'w-full justify-start')}
            id="sidebar-import-button"
          >
            <LayoutTemplate />
            <p>Template</p>
          </Button>
          <Button
            onClick={handleImportClick}
            className={cn(baseLinkClass, 'w-full justify-start')}
            id="sidebar-template-button"
          >
            <Import />
            <p>Import Map</p>
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

      {/* {isAddDialogOpen && (
        <AddMapDialog isOpen={isAddDialogOpen} onClose={handleAddDialogClose} />
      )} */}
    </div>
  )
}
