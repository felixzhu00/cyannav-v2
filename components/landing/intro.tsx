import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import logo from '@/public/cyannav cyan.svg'
import { ChevronRight } from 'lucide-react'

export default function Intro() {
  return (
    <section
      id="intro"
      className="flex w-full flex-col items-center justify-center space-y-20 pt-40 text-center"
    >
      <h1 className="text-6xl font-bold">A New Map Editing Experience.</h1>
      <h2 className="max-w-[854px] justify-center text-center text-2xl">
        Empowering <span className="font-semibold">map enthuasiasts</span> to{' '}
        <span className="font-semibold">create, share,</span> and{' '}
        <span className="font-semibold">collaborate</span> on stunning maps,
        fostering a vibrant community of innovators and explorers.
      </h2>
      <Button variant="default" className="py-6">
        <Image
          className="mr-2 h-[28px] w-[28px]"
          src={logo}
          alt="logo on button"
        ></Image>
        <p className="mr-2">Get Started</p>
        <ChevronRight height={14} width={14} />
      </Button>
    </section>
  )
}
