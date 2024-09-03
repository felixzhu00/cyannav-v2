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

interface EditUsernameProps {
  session: Session | null
}

interface Session {
  user: {
    username: string
  }
}

export function EditUsername({ session }: EditUsernameProps) {
  const [username, setUsername] = useState(session?.user?.username)

  const [isUsernameValid, setIsUsernameValid] = useState<{
    message: null
    availability: boolean
  }>({
    message: null,
    availability: true,
  })
  const [checking, setChecking] = useState(false)

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
        <div className="flex flex-col gap-4 py-4">
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
        </div>
        <DialogFooter>
          <Button type="submit" disabled={!isUsernameValid.availability}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
