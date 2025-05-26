import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'

export function PfpUpload() {
  const { data: session } = useSession()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const fileType = file.type
      const maxSize = 2 * 1024 * 1024 // 2 MB limit

      if (
        (fileType === 'image/jpeg' ||
          fileType === 'image/png' ||
          fileType === 'image/webp') &&
        file.size <= maxSize
      ) {
        setSelectedFile(file)
        setErrorMessage(null)
      } else if (file.size > maxSize) {
        setErrorMessage('File size exceeds the 2MB limit.')
        setSelectedFile(null)
      } else {
        setErrorMessage('Only JPG, PNG, and WEBP formats are supported.')
        setSelectedFile(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const userId = session?.userId

    if (!userId) {
      return
    }

    if (!selectedFile) {
      setErrorMessage('Please select a valid image file.')
      return
    }

    // Convert file to ArrayBuffer (binary data)
    const fileBuffer = await convertFileToBuffer(selectedFile)

    // Create payload with the binary data
    const payload = {
      userId: userId,
      profilePicture: Array.from(new Uint8Array(fileBuffer)),
    }

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        toast({
          variant: 'default',
          description: 'Profile picture updated successfully',
        })
        window.location.reload()
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to upload profile picture. Please try again.',
        })
      }
    } catch (error) {
      console.error(error)
      setErrorMessage('An error occurred while uploading the picture.')
    }
  }

  const convertFileToBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as ArrayBuffer)
        } else {
          reject(new Error('Failed to read file as buffer'))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  return (
    <Dialog>
      <DialogTrigger id="dialog-trigger" asChild>
        <Button>Change Profile Picture</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Profile Picture</DialogTitle>
          <DialogDescription>
            Choose a new profile picture from your device or drag and drop an
            image here. Click "Save" to update your profile picture.
            <br />
            Only support JPG, PNG, and WEBP formats.
            <br />
            Maximum file size is 2 MB.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-w-sm items-center">
            <Label htmlFor="picture">Picture</Label>
            <Input
              id="picture"
              type="file"
              accept=".jpeg,.png,.webp"
              onChange={handleFileChange}
            />
            {errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="submit">Save</Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
