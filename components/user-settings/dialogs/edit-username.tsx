'use client'
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
import { toast } from '@/components/ui/use-toast'

interface EditUsernameProps {
  session: Session | null
  onUsernameUpdate: (newUsername: string) => void // Add this line
}

interface Session {
  user: {
    username: string
  }
  userId: string
}

export function EditUsername({ session, onUsernameUpdate }: EditUsernameProps) {
  const [username, setUsername] = useState(session?.user?.username)
  const [isUsernameValid, setIsUsernameValid] = useState<{
    message: null
    availability: boolean
  }>({
    message: null,
    availability: true,
  })
  const [checking, setChecking] = useState(false)

  const userId = session?.userId

  const checkUsername = async () => {
    setChecking(true)
    try {
      const response = await fetch(`/api/user?username=${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      setIsUsernameValid({
        message: result.message,
        availability: result.payload,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setChecking(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isUsernameValid.availability) {
      toast({
        variant: 'destructive',
        description:
          'Username is not available. Please choose a different one.',
      })
      return
    }

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, username }),
      })

      const result = await response.json()

      if (response.ok) {
        toast({
          description: 'Username updated successfully!',
        })
        onUsernameUpdate(username as string)
      } else {
        toast({
          variant: 'destructive',
          description: `Error: ${result.message}`,
        })
      }
    } catch (error) {
      console.error('Failed to update username:', error)
      toast({
        variant: 'destructive',
        description: 'Failed to update username. Please try again later.',
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your username. Please ensure the username is unique by
            checking its availability before saving.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 py-4">
          <div className="flex flex-row items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={checkUsername} disabled={checking}>
              <span className="p-4">{checking ? 'Checking...' : 'Check'}</span>
            </Button>
          </div>
          {isUsernameValid.message !== null && (
            <div
              className={`text-sm ${isUsernameValid.availability ? 'text-green-500' : 'text-red-500'}`}
            >
              {isUsernameValid.message}
            </div>
          )}
          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="submit" disabled={!isUsernameValid.availability}>
                Save changes
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
