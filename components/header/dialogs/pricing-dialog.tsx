import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { pricingModels } from '@/lib/const'
import { PricingCard } from '@/components/landing/pricing'

interface PricingDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
}

export default function PricingDialog({ isOpen, onClose }: PricingDialogProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  // Define the pricing model, for example, "Pro" plan details
  const pricingModel = [pricingModels.find((model) => model.title === 'Pro')]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] !bg-pf">
        <div className="mb-6 flex justify-center space-x-4">
          <span className={`text-sm ${!isAnnual ? 'font-bold' : ''}`}>
            Monthly
          </span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={`text-sm ${isAnnual ? 'font-bold' : ''}`}>
            Annual <Badge>Save 17%</Badge>
          </span>
        </div>
        <div className="rounded-lg p-6">
          {pricingModel?.map(
            (model, index) =>
              model && (
                <PricingCard
                  key={index}
                  title={model.title}
                  price={isAnnual ? model.yearlyPrice : model.monthlyPrice}
                  description={model.description}
                  features={model.features}
                />
              )
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
