import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CircleUserRound } from 'lucide-react'
import { Session } from 'next-auth'
// import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EditUsername } from '@/components/user-settings/dialogs/edit-username'
import { DeleteAccount } from '@/components/user-settings/dialogs/delete-account'
import { PfpUpload } from '@/components/user-settings/dialogs/pfp-upload'
interface ProfileSettingsProps {
  session: Session | null
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ session }) => {
  return (
    <div className="flex flex-col items-center space-y-14">
      <div className="flex flex-col items-center space-y-5">
        {session && session.user ? (
          <Avatar className="h-36 w-36 rounded-full border border-zinc-200 dark:border-zinc-700">
            <AvatarImage
              src={session.user.image ?? undefined}
              className="h-36 w-36"
            />
            <AvatarFallback className="h-36 w-36">
              <CircleUserRound />
            </AvatarFallback>
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
              disabled
              type="text"
              id="username"
              placeholder={session?.user?.username ?? 'Username'}
            />
            <EditUsername session={session} />
          </div>
        </div>
        <div className="grid w-full max-w-xl items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="flex flex-row space-x-6">
            <Input
              disabled
              type="email"
              id="email"
              placeholder={session?.user?.email ?? 'email'}
            />
          </div>
        </div>
      </div>
      {/* Moving the Delete Account button outside the space-y-14 div to ensure it's at the end */}
      <div className="mt-4 flex w-full max-w-xl justify-end">
        <DeleteAccount />
      </div>
    </div>
  )
}

export default ProfileSettings
