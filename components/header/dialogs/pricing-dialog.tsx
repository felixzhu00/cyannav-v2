import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { pricingModels } from '@/lib/const'

interface PricingDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
}

export default function PricingDialog({ isOpen, onClose }: PricingDialogProps) {
  const [isAnnual, setIsAnnual] = useState(false)

  // Define the pricing model, for example, "Pro" plan details
  const pricingModel = pricingModels.find((model) => model.title === 'Pro')

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mb-6 flex justify-center space-x-4">
          <span className={`text-sm ${!isAnnual ? 'font-bold' : ''}`}>
            Monthly
          </span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={`text-sm ${isAnnual ? 'font-bold' : ''}`}>
            Annual <Badge>Save 17%</Badge>
          </span>
        </div>
        <div className="rounded-lg bg-gray-100 p-6">
          <h2 className="mb-2 text-center text-2xl font-bold">Pro</h2>
          <p className="mb-2 text-center text-4xl font-bold">
            {isAnnual ? pricingModel?.yearlyPrice : pricingModel?.monthlyPrice}
          </p>
          <p className="mb-6 text-center text-sm">
            Even more features for our pro users!
          </p>
          <ul className="mb-6 space-y-2">
            {pricingModel?.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="mr-2 h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button className="w-full">Sign up </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
