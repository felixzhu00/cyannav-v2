import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ImportMapDialogProps {
  isOpen: boolean
  onClose: () => void
}

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  // Handle form submission
}

export default function ImportMapDialog({
  isOpen,
  onClose,
}: ImportMapDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Map</DialogTitle>
          <DialogDescription>
            Enter and select information to import your .navjson map.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-w-sm items-center">
            <Label htmlFor="map_title">Map Name</Label>
            <Input
              id="map_title"
              type="input"
              placeholder="America Choropleth v2"
              // onChange={handleFileChange}
            />
          </div>
          <div className="max-w-sm items-center">
            <Label htmlFor="map_navjson">Map File (.navjson)</Label>
            <Input
              id="map_navjson"
              type="file"
              accept=".navjson"
              // onChange={handleFileChange}
            />
            {/* {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )} */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Import</Button>
          </DialogFooter>{' '}
        </form>
      </DialogContent>
    </Dialog>
  )
}
