import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditTab from './edit-tab'
import CommentTab from './comment-tab'
import { FeatureCollection } from 'geojson'
import IMessagesDocument from '@/models/message'

export default function RightSideBar({
  geojson,
  messages,
}: {
  geojson: FeatureCollection | undefined
  messages: (typeof IMessagesDocument | undefined)[]
}) {
  console.log(messages)
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
          Comment
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="edit"
        className="h-full max-h-[calc(100vh-122px)] overflow-y-auto"
      >
        <EditTab geojson={geojson} />
      </TabsContent>
      <TabsContent
        value="comment"
        className="h-full max-h-[calc(100vh-122px)] overflow-y-auto"
      >
        <CommentTab messages={messages} />
      </TabsContent>
    </Tabs>
  )
}
