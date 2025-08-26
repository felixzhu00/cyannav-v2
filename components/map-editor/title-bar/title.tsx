import { useAtom } from 'jotai'
import { mapAtom, setMapFieldAtom } from '@/lib/jotai'
import { useRef, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Title({ className }: { className: string }) {
  const [map] = useAtom(mapAtom)
  const [, setMapField] = useAtom(setMapFieldAtom)

  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const { _id, title, owner } = map

  //   , isPublished, sharedUsers, forkedFrom

  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleText, setTitleText] = useState(title)

  const handleStartEditTitle = () => {
    setTimeout(() => {
      inputRef.current?.focus() // Focus the input using ref
    }, 0)
    setIsEditingTitle(true)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitleText(event.target.value)
  }

  const handleEndEditingTitle = async () => {
    setIsEditingTitle(false)

    // If title is empty revert to original title and toast
    if (titleText.length === 0) {
      setTitleText(title)
      toast({
        description: 'Empty Title is not Allowed',
      })
    }

    // POST request if title is changed
    if (titleText !== title) {
      try {
        const response = await fetch(`/api/map/${_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: titleText }),
        })

        const result = await response.json()

        toast({
          description: result.message,
        })

        if (response.ok) {
          setMapField({ field: 'title', value: result.payload.title }) // Update the global title state
        }
      } catch (error) {
        toast({
          description: 'An error occurred while updating the title',
        })
      }
    }
  }
  return (
    <div className={cn("ml-4 flex flex-shrink items-center justify-center py-4 text-primary", className)}>
      {isEditingTitle ? (
        <Input
          ref={inputRef}
          type="text"
          value={titleText}
          onChange={handleInputChange}
          onBlur={handleEndEditingTitle}
          className="mr-3 inline-block w-auto max-w-40 p-1 text-xl font-semibold"
        />
      ) : (
        <div onClick={handleStartEditTitle}>
          <span className="text-xl font-semibold">{title}</span>
          <Pencil className="mx-2 inline-block h-5 w-5 p-0.5" />
        </div>
      )}

      <span className="mr-4 text-xl font-semibold text-muted-forground">/</span>
      <span className="text-ring">By {owner.username}</span>
    </div>
  )
}
