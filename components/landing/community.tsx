import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import mapPlaceholder from '@/public/map_placeholder.png'
import Image from 'next/image'
import { Star, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import HeadingRow from './heading-row'
import { MapFields } from '@/core/_entities/types/map.types'
import Link from 'next/link'
import { UserFields } from '@/core/_entities/types/user.types'
import StarToggle from '../dashboard/card-grid/star-toggle'
import VoteBox from '../dashboard/card-grid/vote-box'

export default async function Community() {
  let mapList: MapFields[] = []

  try {
    const response = await fetch(
      `http://localhost:3000/api/map?view=community`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return <p>Error: {errorData.message}</p>
    }

    const maps = await response.json()
    mapList = maps.payload as MapFields[]

    // Score function: likes - dislikes
    const getScore = (m: MapFields) =>
      (m.likes?.length ?? 0) - (m.dislikes?.length ?? 0)

    // Sort by score descending
    mapList.sort((a, b) => getScore(b) - getScore(a))

    // Slice to top 11
    mapList = mapList.slice(0, 11)
  } catch (error) {
    console.log(error)
    return <p>Error loading maps</p>
  }

  return (
    <section id="community" className="space-y-10">
      <HeadingRow
        heading="Popular Community Maps"
        subheading="View the most popular maps users created."
      />
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="gap-x-10">
          {mapList.map((map, index) => (
            <CarouselItem key={index} className="min-w-[310px]">
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
                      id={map._id as string}
                      count={
                        (map.likes?.length ?? 0) - (map.dislikes?.length ?? 0)
                      }
                      upvoted={false}
                      downvoted={false}
                    />
                    <div className="flex w-full flex-col">
                      <h3 className="truncate text-xl font-bold">
                        {map.title}
                      </h3>
                      <p className="text-xs">
                        By: {(map.owner as UserFields).username}
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <StarToggle mapId={map._id as string} isStarred={false} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
          <CarouselItem className="min-w-[310px]">
            <Card className="flex h-[310px] w-[310px] items-center justify-center bg-zinc-100">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <p className="mb-4 text-lg font-semibold">Want more?</p>
                <Button>
                  <Link href={'/login'}>Click Here to View More</Link>
                </Button>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  )
}
