import React from 'react'
import { Eye, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAtom } from 'jotai'
import { currLayerAtom } from '@/atoms/jotai'
import { cn } from '@/lib/utils'

type LeftSidebarItemProps = {
  name: string
  id: string
}

export default function LeftSidebarItem({ name, id }: LeftSidebarItemProps) {
  const [currLayer, setCurrLayer] = useAtom(currLayerAtom)

  const handleLayerChange = () => {
    setCurrLayer(id)
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-between rounded-md border border-transparent px-2 py-0.5 hover:border-blue-500',
        currLayer === id && 'border-white-500'
      )}
      onClick={handleLayerChange}
    >
      <span className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-white">
        {name}
      </span>
      <div className="flex">
        <Button variant="ghost" size="icon">
          <Lock className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
