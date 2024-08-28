import { IMapDocument } from '@/core/_entities/types/map.types'
import dbConnect from '@/db/dbConnect'
import Map from '@/db/map.model'

export async function getMapById(id: string) {
  await dbConnect()

  const map: IMapDocument | null = await Map.findById(id)
    .populate('owner', 'username email')
    .populate({
      path: 'messages', // Populates the 'messages' field
      populate: {
        path: 'author', // Populates the 'author' field within each message
        select: 'username', // Only get the 'username' field from the User schema
      },
    })
    .populate('sharedUsers', 'username email')
    .lean()

  return map
}
