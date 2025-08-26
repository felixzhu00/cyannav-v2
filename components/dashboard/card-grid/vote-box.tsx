'use client'

import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import React, { useState } from 'react'

interface VoteProps {
  id: string
  count: number
  upvoted?: boolean
  downvoted?: boolean
}

export default function VoteBox({
  id,
  count: initialCount,
  upvoted: initialUpvoted = false,
  downvoted: initialDownvoted = false,
}: VoteProps) {
  const [count, setCount] = useState(initialCount)
  const [upvoted, setUpvoted] = useState(initialUpvoted)
  const [downvoted, setDownvoted] = useState(initialDownvoted)

  const handleVote = async (voteType: 'like' | 'dislike') => {
    try {
      const res = await fetch(`/api/map/${id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ voteType }),
        cache: 'no-store',
      })

      if (!res.ok) throw new Error('Vote failed')

      // Toggle vote logic
      if (voteType === 'like') {
        if (upvoted) {
          setCount((c) => c - 1)
          setUpvoted(false)
        } else {
          setCount((c) => (downvoted ? c + 2 : c + 1))
          setUpvoted(true)
          setDownvoted(false)
        }
      } else {
        if (downvoted) {
          setCount((c) => c + 1)
          setDownvoted(false)
        } else {
          setCount((c) => (upvoted ? c - 2 : c - 1))
          setDownvoted(true)
          setUpvoted(false)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      <div className="flex flex-col items-center space-y-0.5">
        <button
          onClick={() => handleVote('like')}
          className={`hover:text-blue-500 ${upvoted ? 'text-blue-600' : ''}`}
        >
          <ArrowBigUp size={20} />
        </button>
        <span className="text-sm font-medium">{count}</span>
        <button
          onClick={() => handleVote('dislike')}
          className={`hover:text-red-500 ${downvoted ? 'text-red-600' : ''}`}
        >
          <ArrowBigDown size={20} />
        </button>
      </div>
    </div>
  )
}
