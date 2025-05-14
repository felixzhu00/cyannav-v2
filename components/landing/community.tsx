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

export default function Community() {
  return (
    <section id="community" className="space-y-10">
      <div className="space-between flex h-full w-full flex-row items-end">
        <h1 className="flex-grow text-4xl font-bold">Popular Community Maps</h1>
        <p className="text-2xl opacity-50">
          View the most popular maps users created.
        </p>
      </div>
      <Carousel
        opts={{
          align: 'start',
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className='gap-x-10'>
          {Array.from({ length: 11 }).map((_, index) => (
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
            <Card className="h-[310px] w-[310px] bg-zinc-100 flex items-center justify-center">
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
