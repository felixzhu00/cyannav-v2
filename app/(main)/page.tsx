import Features from '@/components/landing/features'
import Intro from '@/components/landing/intro'
import Community from '@/components/landing/community'
import Pricing from '@/components/landing/pricing'
import Faq from '@/components/landing/faq'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect('/dashboard?view=recent-maps')
  }

  return (
    <main className="mb-24 flex w-full flex-col space-y-40 px-24 md:px-44 lg:px-75">
      <Intro />
      <Features />
      <Community />
      <Pricing />
      <Faq />
    </main>
  )
}
