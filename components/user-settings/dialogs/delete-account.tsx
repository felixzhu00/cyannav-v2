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
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export function DeleteAccount() {
  const [email, setEmail] = useState('')
  const { data: session } = useSession()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const userId = session?.userId

    if (!userId) {
      return
    }

    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      })

      const result = await response.json()

      if (response.ok) {
        await signOut({ callbackUrl: '/login' })
      } else {
        console.error(result)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="justify-end" variant="destructive">
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action is
              irreversible. Type in your email and click "Delete" to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-row items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
