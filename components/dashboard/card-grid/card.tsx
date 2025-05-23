import React from 'react'
import { Card } from '../../ui/card'
import { CardContent } from '../../ui/card'
import Image from 'next/image'
import mapPlaceholder from '@/public/map_placeholder.png'
import { MapFields } from '@/core/_entities/types/map.types'
import { UserFields } from '@/core/_entities/types/user.types'
import VoteBox from './vote-box'
import { auth } from '@/lib/auth'
import { Types } from 'mongoose'
import StarToggle from './star-toggle'
interface CardComponentProps {
  index: number
  mapMeta: MapFields
}

export default async function CardComponent({
  index,
  mapMeta,
}: CardComponentProps) {
  // Get the current session
  const session = await auth()

  // Get the current user viewing the card(can be guest or login user)
  const userId = new Types.ObjectId(session?.userId)
  const {
    _id,
    title,
    owner,
    mapType,
    isPublished,
    geojson,
    likes,
    dislikes,
    sharedUsers,
    dateCreated,
  } = mapMeta

  // Param to pass to Vote Box
  const count = (likes?.length ?? 0) - (dislikes?.length ?? 0)
  const upvoted = (likes as string[])?.includes(userId.toString())
  const downvoted = (dislikes as string[])?.includes(userId.toString())

  // Param to pass to Star
  const idStr = (_id as Types.ObjectId).toString() // cast id to string form
  const isStar = (session?.user?.favorite ?? []).includes(idStr)

  return (
    <Card
      key={index}
      className="h-80 w-full bg-zinc-100 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
    >
      <CardContent className="flex flex-col items-center justify-center">
        {/* thumbnail */}
        <Image
          src={mapPlaceholder}
          className="h-[220px] w-full rounded-t-lg"
          width={310}
          height={220}
          style={{ objectFit: 'cover' }}
          alt="map image"
        />
        <div className="align-center flex w-full flex-row items-center justify-between space-x-4 p-4">
          <VoteBox
            id={_id as string}
            count={count}
            upvoted={upvoted}
            downvoted={downvoted}
          />
          <div className="flex w-full flex-col">
            <h3 className="truncate text-xl font-bold">{title}</h3>
            <p className="text-xs">By: {(owner as UserFields).username}</p>
          </div>
          <div className="flex space-x-3">
            <StarToggle mapId={_id as string} isStarred={isStar} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
