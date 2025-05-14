'use client'
import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { pricingModels } from '@/lib/const'
import HeadingRow from './heading-row'

interface PricingProps {
  title: string
  price: string
  description: string
  features: string[]
}

const PricingCard: React.FC<PricingProps> = ({
  title,
  price,
  description,
  features,
}) => {
  return (
    <div className="flex flex-1 flex-col justify-between rounded-lg border p-6 text-center shadow-md">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="my-4 text-4xl font-bold">{price}</p>
        <p className="mb-4 text-sm text-gray-600">{description}</p>
        <ul className="mb-6 justify-start space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <span className="mr-2">✔️</span>
              <span className="text-left">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button className="mt-auto w-full rounded-lg bg-black px-4 py-2 text-white">
        Sign up
      </button>
    </div>
  )
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="flex flex-col space-y-10">
      <HeadingRow heading="Pricing" subheading="From basic tools to advanced features." />
      <div className="flex items-center justify-center space-x-2">
        <Label htmlFor="montly">Monthly</Label>
        <Switch
          id="plan-rate-switcher"
          onCheckedChange={(checked) => setIsAnnual(checked)}
        />
        <Label htmlFor="annual">Annual</Label>
      </div>
      <div className="flex h-full justify-center gap-4">
        {pricingModels.map((model, index) => (
          <PricingCard
            key={index}
            title={model.title}
            price={isAnnual ? model.yearlyPrice : model.monthlyPrice}
            description={model.description}
            features={model.features}
          />
        ))}
      </div>
    </section>
  )
}
