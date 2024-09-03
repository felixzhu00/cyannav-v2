import React from 'react'
import ProfileInputs from '@/components/user-settings/profile-inputs'
import { auth } from '@/lib/auth'

export default async function ProfileSettings() {
  const session = await auth()
  return (
    <div className="w-full space-y-20 px-12 py-16">
      <div className="flex flex-row items-center justify-between space-x-4">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
      </div>
      <ProfileInputs session={session} />
    </div>
  )
}
