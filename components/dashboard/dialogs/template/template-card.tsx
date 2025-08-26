import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import logo from '@/public/logo.svg'

export default function TemplateCard({
  creatorName,
  title,
  geojson,
  onLearnMore, // Pass down this function from TemplateDialog
}: {
  creatorName: string
  title: string
  geojson: Buffer | undefined
  onLearnMore: () => void
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div
        className="relative mb-2 aspect-video rounded-lg bg-zinc-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white/90 p-6 opacity-100 transition-opacity duration-300">
            <div>
              <div className="flex w-full justify-start space-x-2">
                <Button className="transform bg-cyan-300 text-sm text-black transition-transform duration-200 hover:scale-105 hover:bg-cyan-400 md:text-sm lg:text-xs">
                  Use Template
                </Button>
                <Button
                  variant="secondary"
                  className="transform text-sm transition-transform duration-200 hover:scale-105 md:text-sm lg:text-xs"
                  onClick={() => onLearnMore()}
                >
                  View Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex flex-row items-center">
          <Image
            src={logo}
            alt="Template logo"
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="ml-2 text-xs font-light md:text-sm">
            {creatorName}
          </span>
        </div>

        <span className="text-sm font-medium md:text-base">{title}</span>
      </div>
    </div>
  )
}
