'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/user-settings/sidebar'
import TransactionHistory from '@/components/user-settings/transaction-history'
import ProfileSettings from '@/components/user-settings/profile-settings'

export default function UserSettingsContainer() {
  const [activeTab, setActiveTab] = useState('ProfileSettings')

  return (
    <div className="grid w-full grid-cols-[auto,1fr]">
      <Sidebar setActiveTab={setActiveTab} />
      {activeTab === 'ProfileSettings' && <ProfileSettings />}
      {activeTab === 'TransactionHistory' && <TransactionHistory />}
    </div>
  )
}
