'use client'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CircleUserRound } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EditUsername } from '@/components/user-settings/dialogs/edit-username'
import { DeleteAccount } from '@/components/user-settings/dialogs/delete-account'
import { PfpUpload } from '@/components/user-settings/dialogs/pfp-upload'
import { useSession } from 'next-auth/react'

const ProfileSettings: React.FC = () => {
  const { data: session, update } = useSession()

  const handleUsernameUpdate = async (newUsername: string) => {
    // Update the username on session(client end)
    if (session && session.user) {
      update({ ...session, user: { ...session.user, username: newUsername } })
    }
  }

  return (
    <div className="flex flex-col items-center space-y-14">
      <div className="flex flex-col items-center space-y-5">
        {session && session.user ? (
          <Avatar className="h-36 w-36 rounded-full border border-zinc-200 dark:border-zinc-700">
            <AvatarImage
              src={`data:image/jpeg;base64,${session.user.profilePicture}`}
              className="h-36 w-36"
              loading="lazy"
            />
          </Avatar>
        ) : (
          <Avatar className="h-36 w-36 rounded-full border border-zinc-200 dark:border-zinc-700">
            <AvatarFallback className="h-36 w-36">
              <CircleUserRound />
            </AvatarFallback>
          </Avatar>
        )}
        <PfpUpload />
      </div>
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        <div className="grid w-full max-w-xl items-center gap-1.5">
          <Label htmlFor="text">Username</Label>
          <div className="flex flex-row space-x-6">
            <Input
              type="text"
              id="username"
              value={session?.user?.username ?? ''}
              readOnly
              className="cursor-default text-primary focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
            />
            <EditUsername onUsernameUpdate={handleUsernameUpdate} />
          </div>
        </div>
        <div className="grid w-full max-w-xl items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="flex flex-row space-x-6">
            <Input
              type="text"
              id="email"
              placeholder="Email"
              value={session?.user?.email ?? 'email'}
              readOnly
              className="cursor-default text-primary focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-full max-w-xl justify-end">
        <DeleteAccount />
      </div>
    </div>
  )
}

export default ProfileSettings
