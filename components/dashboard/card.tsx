import React from 'react'
import { Card } from '../ui/card'
import { CardContent } from '../ui/card'
import Image from 'next/image'
import { Star, ThumbsUp } from 'lucide-react'
import mapPlaceholder from '@/public/map_placeholder.png'

interface CardComponentProps {
  index: number
}

export default function CardComponent({ index }: CardComponentProps) {
  return (
    <Card
      key={index}
      className="h-80 w-full bg-zinc-100 shadow-md transition-transform duration-300 ease-in-out hover:scale-105"
    >
      <CardContent className="flex flex-col items-center justify-center">
        <Image
          src={mapPlaceholder}
          className="h-[220px] w-full rounded-t-lg"
          width={310}
          height={220}
          style={{ objectFit: 'cover' }}
          alt="map image"
        />
        <div className="flex w-full flex-row items-center justify-between px-4 pt-6">
          <div className="flex w-full flex-col">
            <h3 className="truncate text-xl font-bold">Map {index}</h3>
            <p className="text-xs">By: Author</p>
          </div>
          <div className="flex space-x-3">
            <button>
              <Star />
            </button>
            <button>
              <ThumbsUp />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
