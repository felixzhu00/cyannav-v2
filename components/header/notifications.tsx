'use client'
import { useState } from 'react'
import { Bell } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Notification {
  id: number
  title: string
  description: string
  time: string
}

const sampleNotifications: Notification[] = [
  {
    id: 1,
    title: 'New message',
    description: 'You have a new message from John',
    time: '5 min ago',
  },
  {
    id: 2,
    title: 'Meeting reminder',
    description: 'Team meeting in 30 minutes',
    time: '25 min ago',
  },
  {
    id: 3,
    title: 'Update available',
    description: 'A new software update is available',
    time: '1 hour ago',
  },
  {
    id: 4,
    title: 'Task completed',
    description: 'Project X has been marked as complete',
    time: '2 hours ago',
  },
  {
    id: 5,
    title: 'New follower',
    description: 'Jane Doe started following you',
    time: '3 hours ago',
  },
]

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(sampleNotifications)

  const unreadCount = notifications.length

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className="hover:bg-accent relative cursor-pointer rounded-full p-2 transition-colors duration-200"
          role="button"
          tabIndex={0}
          aria-label="Toggle notifications"
        >
          <Bell className="h-7 w-7" />
          {unreadCount > 0 && (
            <span className="absolute right-0 top-0 -mr-1 -mt-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-red-100">
              {unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="border-b p-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <ul className="divide-y">
              {notifications.map((notification) => (
                <li key={notification.id} className="hover:bg-accent p-4">
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {notification.description}
                  </p>
                  <span className="text-muted-foreground text-xs">
                    {notification.time}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground p-4 text-center">
              No new notifications
            </p>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="border-t p-4">
            <button
              className="text-primary-foreground bg-primary hover:bg-primary/90 focus-visible:ring-primary w-full rounded-md px-4 py-2 text-center text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75"
              onClick={() => setNotifications([])}
            >
              Clear all notifications
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
