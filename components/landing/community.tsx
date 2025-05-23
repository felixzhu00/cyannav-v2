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
          {mapList.map((_, index) => (
            <CarouselItem key={index} className="min-w-[310px]">
              <div>
                <Card className="h-[310px] w-[310px] bg-zinc-100">
                  <CardContent className="flex flex-col items-center justify-center">
                    <Image
                      src={mapPlaceholder}
                      className="h-[220px] w-[310px] rounded-t-lg"
                      width={310}
                      height={220}
                      style={{ objectFit: 'cover' }}
                      alt="map image"
                    />
                    <div className="flex w-full flex-row items-center justify-between px-4 pt-6">
                      <div className="flex w-full flex-col">
                        <h3 className="truncate text-xl font-bold">Map Name</h3>
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
              </div>
            </CarouselItem>
          ))}
          <CarouselItem className="min-w-[310px]">
            <Card className="flex h-[310px] w-[310px] items-center justify-center bg-zinc-100">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <p className="mb-4 text-lg font-semibold">Want more?</p>
                <Button>Click Here to View More</Button>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div>
        <Button>Click Here to View More</Button>
      </div>
    </section>
  )
}
