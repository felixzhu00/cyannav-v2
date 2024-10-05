import { useState } from 'react'
import {
  SendHorizontal,
  CirclePlus,
  Image as ImageIcon,
  Smile,
} from 'lucide-react'
import { Input } from '../../../ui/input'

export default function CommentInput() {
  const [isFocused, setIsFocused] = useState(false)



  return (
    <div className='relative bottom-2'>
        <div className="flex items-center justify-between px-2">
      {!isFocused && (
        <div className="left-0 flex items-center gap-2 p-2">
          {/* TODO think of useful icon/features for commenting */}
          <CirclePlus className="h-5 w-5 text-gray-500" />
          <ImageIcon className="h-5 w-5 text-gray-500" />
        </div>
      )}

      <div className="flex-grow items-center">
        <Smile className="absolute right-12 translate-y-1/2 h-5 w-5 text-gray-500" />
        <Input
          className={`pl-${isFocused ? 12 : 4} rounded-full border border-gray-300 py-2 pr-10 focus:border-blue-500`}
          placeholder="Aa"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <SendHorizontal className="ml-2 h-5 w-5 text-gray-500" />
    </div>
    </div>
  )
}
