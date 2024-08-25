import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditTab from './edit-tab'
import CommentTab from './comment-tab'

export default function RightSideBar() {
  return (
    <Tabs
      defaultValue="edit"
      className="h-full max-h-[calc(100vh-74px)] w-full bg-zinc-900"
    >
      <TabsList className="w-full">
        <TabsTrigger className="flex-1" value="edit">
          Edit
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="comment">
          Chat
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="edit"
        className="h-full max-h-[calc(100vh-122px)] overflow-y-auto"
      >
        <EditTab />
      </TabsContent>
      <TabsContent
        value="comment"
        className="h-full max-h-[calc(100vh-122px)] overflow-y-auto"
      >
        <CommentTab />
      </TabsContent>
    </Tabs>
  )
}
