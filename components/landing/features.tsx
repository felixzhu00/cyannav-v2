import React from 'react'
import { LucideIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { features } from '@/lib/const'

interface FeatureProps {
  Icon: LucideIcon
  title: string
  description: string
  comingSoon: string
}

const FeatureCard: React.FC<FeatureProps> = ({
  Icon,
  title,
  description,
  comingSoon,
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="z-50 mb-[-30px] flex h-[60px] w-[60px] items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-900">
        <Icon height={30} width={30} />
      </div>
      <Card className="z-40 h-[340px] w-[350px] rounded-lg bg-zinc-100 px-[30px] py-[50px] shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-center text-2xl font-semibold">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base">{description}</p>
        </CardContent>
        <CardFooter>
          <p className="opacity-50">{comingSoon}</p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function Features() {
  return (
    <section id="features" className="flex flex-col space-y-10">
      <div className="space-between flex h-full w-full flex-row items-end">
        <h1 className="flex-grow text-4xl font-bold">What's in CyanNav?</h1>
        <p className="text-2xl opacity-50">
          Everything you need to create stunning maps.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            Icon={feature.icon}
            title={feature.featureTitle}
            description={feature.featureDescription}
            comingSoon={feature.comingSoon}
          />
        ))}
      </div>
      <div>
        <p className="italic">More exciting features coming soon! 🎉</p>
      </div>
    </section>
  )
}
