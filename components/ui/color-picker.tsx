import { forwardRef, useEffect, useMemo, useState } from 'react'
import { HexColorPicker } from 'react-colorful'
import { cn } from '@/lib/utils'
import type { ButtonProps } from '@/components/ui/button'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  setIsBlurred?: () => void // Add isBlurred state handler
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, 'value' | 'onChange'> & ColorPickerProps
>(
  (
    { disabled, value, onChange, name, className, setIsBlurred, ...props },
    forwardedRef
  ) => {
    const [open, setOpen] = useState(false) // Tracks popover open/close state (isBlur)
    const [internalValue, setInternalValue] = useState(value) // Separate state for local updates

    // Sync with external value if it changes
    useEffect(() => {
      setInternalValue(value)
    }, [value])

    // Memoized value for performance
    const parsedValue = useMemo(
      () => internalValue || '#FFFFFF',
      [internalValue]
    )

    // Handle color change and sync immediately with parent
    const handleColorChange = (newColor: string) => {
      setInternalValue(newColor) // Update internal state
      onChange(newColor) // Call parent's onChange to sync with parent component
      console.log('trigger')
    }

    // Handle popover open/close and blur state
    const handlePopoverChange = (isOpen: boolean) => {
      if (!isOpen && setIsBlurred) {
        setIsBlurred() // Set isBlurred to true when the popover closes
      }
      setOpen(isOpen)
    }

    return (
      <Popover
        onOpenChange={handlePopoverChange} // Track blur using popover open state
        open={open}
      >
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            {...props}
            className={cn('block', className)}
            name={name}
            onClick={() => setOpen(true)} // Open the popover on click
            size="icon"
            style={{
              backgroundColor: parsedValue,
            }}
            variant="outline"
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-full flex-col items-center">
          {/* Color picker that updates parent's state on every change */}
          <HexColorPicker color={parsedValue} onChange={handleColorChange} />
          <Input
            maxLength={7}
            onChange={(e) => {
              const newValue = e.currentTarget.value
              setInternalValue(newValue) // Update local state
              onChange(newValue) // Sync with parent's state
            }}
            ref={forwardedRef}
            value={parsedValue}
          />
        </PopoverContent>
      </Popover>
    )
  }
)

ColorPicker.displayName = 'ColorPicker'

export { ColorPicker }
