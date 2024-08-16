import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditTab from './edit-tab'
import CommentTab from './comment-tab'

export default function RightSideBar() {
  return (
    <Tabs defaultValue="edit" className="w-full h-full bg-zinc-900 max-h-[calc(100vh-74px)]">
      <TabsList className="w-full">
        <TabsTrigger className="flex-1" value="edit">
          Edit
        </TabsTrigger>
        <TabsTrigger className="flex-1" value="comment">
          Comment
        </TabsTrigger>
      </TabsList>
      <TabsContent value="edit" className="max-h-[calc(100vh-122px)] overflow-y-auto h-full">
        <EditTab />
      </TabsContent>
      <TabsContent value="comment" className="max-h-[calc(100vh-122px)] overflow-y-auto h-full">
        <CommentTab/>
      </TabsContent>
    </Tabs>
  )
}
