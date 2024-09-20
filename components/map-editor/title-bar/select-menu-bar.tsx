import React, { useRef } from 'react'
import {
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar'
import { ChevronDown } from 'lucide-react'
import { currSelectedModeAtom } from '@/lib/jotai'
import { useAtom } from 'jotai'

interface MenuItem {
  label: string
  icon: React.ReactNode
}

interface SelectMenuBarProps {
  items: MenuItem[]
  menuColIndex: number
  isActive: boolean
  isFile?: boolean
}

export default function SelectMenuBar({
  items,
  menuColIndex,
  isActive,
  isFile = false,
}: SelectMenuBarProps) {
  // TODO use onFocus and onBlur to optimize react rendering(prevent render)
  const [currSelectedMode, setCurrSelectedMode] = useAtom(currSelectedModeAtom)

  // Using state instead of ref for better reactivity
  const currSelectedIndex = useRef(0)

  // Logic used to keep either the past menuItem or currently active one
  if (currSelectedMode.menuColIndex === menuColIndex) {
    currSelectedIndex.current = currSelectedMode.menuItemIndex
  }

  // The current menu item displayed as the trigger
  const currMenuItem = items[currSelectedIndex.current]

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
            if (!isActive) handleChangeMode(currSelectedIndex.current)
          }}
        >
          {currMenuItem.icon}
          {items.length > 1 && <ChevronDown className="h-3 w-3" />}
        </MenubarTrigger>

        {/* TODO spline is different from everything else */}
        {items.length > 1 && (
          <MenubarContent className="mt-3.5">
            {/* Map over the items to render the list of menu items */}
            {items.map((item, index) =>
              index === currSelectedIndex.current ? null : (
                <React.Fragment key={item.label + index.toString()}>
                  <MenubarItem
                    onClick={() => {
                      if (item.onClick) item.onClick()
                      // Set the selected menu item on click and run the provided onClick
                      if (!isFile) handleChangeMode(index) // Preventing default if you are chooseing Content
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
        )}
      </MenubarMenu>
    </div>
  )
}
