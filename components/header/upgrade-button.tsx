'use client'
import React, { useState } from 'react'
import PricingDialog from './dialogs/pricing-dialog'
import { Button } from '../ui/button'

export default function UpgradeButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button variant="default" onClick={handleOpenDialog}>
        Upgrade
      </Button>
      <PricingDialog isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </>
  )
}
