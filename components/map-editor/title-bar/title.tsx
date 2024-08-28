import { useAtom } from 'jotai'
import { mapAtom, setMapFieldAtom } from '@/lib/jotai'
import { useRef, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { Pencil } from 'lucide-react'

export default function Title() {
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

        if (response.ok) {
          setTitleText(titleText) // Update the title state
          // Optumistic update
          setMapField({ field: 'title', value: titleText })
          toast({
            description: 'Title updated successfully',
          })
        } else {
          toast({
            description: result.error || 'Failed to update title',
          })
        }
      } catch (error) {
        toast({
          description: 'An error occurred while updating the title',
        })
      }
    }
  }
  return (
    <div className="ml-4 flex flex-1 items-center justify-center py-4">
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

      <span className="mr-4 text-xl font-semibold text-zinc-400">/</span>
      <span className="text-zinc-500">By {owner.username}</span>
    </div>
  )
}
