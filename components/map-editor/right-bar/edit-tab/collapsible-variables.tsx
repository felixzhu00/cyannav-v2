import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Minus } from 'lucide-react'

import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../../ui/collapsible'

type CollapsibleVariablesProps = {
  header: string
  children: React.ReactNode
}

export default function CollapsibleVariables({
  header,
  children,
}: CollapsibleVariablesProps) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <Collapsible className="w-full" open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild className="w-full">
        <Button variant="ghost">
          <div className="w-full flex-1 py-4">
            <span className="text-l font-semibold">{header}</span>
          </div>
          {isOpen ? (
            <Minus className="h-5 w-5" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-1">{children}</CollapsibleContent>
    </Collapsible>
  )
}
