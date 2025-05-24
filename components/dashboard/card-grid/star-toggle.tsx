'use client'

import { Star, StarOff } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface StarToggleProps {
  mapId: string
  isStarred: boolean
}

export default function StarToggle({
  mapId,
  isStarred: initialStarred,
}: StarToggleProps) {
  const [isStarred, setIsStarred] = useState(initialStarred)
  const { update } = useSession()
  const router = useRouter()

  const handleToggleStar = async () => {
    try {
      const res = await fetch(`/api/map/${mapId}/star`, {
        method: 'POST',
        body: JSON.stringify({ toggle: true }),
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Failed to toggle star')

      //update session after api success
      await update()

      //Refresh route so server mapList can update
      router.refresh() // refreshes server componenet
      setIsStarred((prev) => !prev)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <button
      onClick={handleToggleStar}
      className={`text-yellow-500 transition-colors hover:text-yellow-600`}
      aria-label="Toggle Star"
    >
      {isStarred ? (
        <Star fill="currentColor" size={20} />
      ) : (
        <StarOff size={20} />
      )}
    </button>
  )
}
