import React from 'react'
import { menu } from '@/lib/maplibre-actions/map-var-const'
import { currSelectedModeAtom } from '@/lib/jotai'
import { useAtomValue } from 'jotai'

export default function DescriptionBox() {
  const selectedMode = useAtomValue(currSelectedModeAtom)

  return (
    <div className="absolute bottom-0 left-0 bg-black p-5 m-1 rounded-md">
      {menu[selectedMode.menuColIndex][selectedMode.menuItemIndex].desc}
    </div>
  )
}
