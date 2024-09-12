import React, { Dispatch, SetStateAction, useState } from 'react'
import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar'
import { ChevronDown } from 'lucide-react'

interface MenuItem {
  label: string
  icon: React.ReactNode
}

interface SelectMenuBarProps {
  items: MenuItem[]
  setCurrSelectedMode: Dispatch<
    SetStateAction<{
      menuColIndex: number
      menuItemIndex: number
    }>
  >
  menuColIndex: number
  isActive: boolean
  isFile?: boolean
}

export default function SelectMenuBar({
  items,
  setCurrSelectedMode,
  menuColIndex,
  isActive,
  isFile = false,
}: SelectMenuBarProps) {
  // TODO use onFocus and onBlur to optimize react rendering(prevent render)
  const [currSelectedIndex, setCurrSelectedIndex] = useState(0)

  // The current menu item displayed as the trigger
  const currMenuItem = items[currSelectedIndex]

  const triggerStyle = () =>
    `flex flex-row items-center aspect-square h-full justify-center ${
      isActive
        ? 'bg-blue-800 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-800'
        : 'bg-transparent dark:bg-transparent hover:bg-zinc-700 dark:hover:bg-zinc-700'
    }`

  const handleChangeMode = (currentIndex: number) => {
    setCurrSelectedMode(() => ({
      menuColIndex,
      menuItemIndex: currentIndex,
    }))
  }

  return (
    <div className={triggerStyle()}>
      <MenubarMenu>
        {/* Render the currently selected menu item as the trigger */}
        <MenubarTrigger
          onClick={() => {
            if (!isActive) handleChangeMode(currSelectedIndex)
          }}
        >
          {currMenuItem.icon}
          <ChevronDown className="h-3 w-3" />
        </MenubarTrigger>

        {/* TODO spline is different from everything else */}
        <MenubarContent className="mt-3.5">
          {/* Map over the items to render the list of menu items */}
          {items.map((item, index) =>
            index === currSelectedIndex ? null : (
              <React.Fragment key={item.label + index.toString()}>
                <MenubarItem
                  onClick={() => {
                    // Set the selected menu item on click and run the provided onClick
                    handleChangeMode(index) // Preventing default if you are chooseing Content
                    if (!isFile) setCurrSelectedIndex(index)
                  }}
                  className="flex-row gap-2"
                >
                  {item.icon} {item.label}
                </MenubarItem>
                {/* Add a separator if it's not the last item */}
                {index < items.length - 1 && <MenubarSeparator />}
              </React.Fragment>
            )
          )}
        </MenubarContent>
      </MenubarMenu>
    </div>
  )
}
