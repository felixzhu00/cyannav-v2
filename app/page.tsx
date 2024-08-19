import Features from '@/components/landing/features'
import Intro from '@/components/landing/intro'
import Community from '@/components/landing/community'
import Pricing from '@/components/landing/pricing'
import Faq from '@/components/landing/faq'

export default function Home() {
  return (
    <main className="mb-24 flex w-full flex-col space-y-40 px-[175px]">
      <Intro />
      <Features />
      <Community />
      <Pricing />
      <Faq />
    </main>
  )
}
