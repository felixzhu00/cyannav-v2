'use client'
import { useState } from "react"

export function LeftToast({ message }: { message: string }) {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="bg-black fixed bottom-4 left-4 z-50 w-80 rounded-md border border-ring bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-900 dark:text-gray-100">{message}</p>
        <button
          onClick={() => setVisible(false)}
          className="ml-2 rounded p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 m-auto"
        >
          <span>Dismiss</span>
        </button>
      </div>
    </div>
  )
}
