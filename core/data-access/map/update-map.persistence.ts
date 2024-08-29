import { MapFields } from '@/core/_entities/types/map.types'
import { IUserDocument } from '@/core/_entities/types/user.types'
import dbConnect from '@/db/dbConnect'
import Map from '@/db/map.model'
import { Types } from 'mongoose'

export async function updateMapFieldsById(id: string, updateFields: MapFields) {
  await dbConnect() // Ensure database connection

  // Update the map in the database
  const updatedMap = await Map.findByIdAndUpdate(
    id,
    updateFields, // Update fields based on the payload
    { new: true } // Return the updated document
  )

  return updatedMap
}

export async function updateMapSharedUsers(
  mapId: string,
  userId: string,
  action: 'add' | 'remove'
) {
  // Convert userId to an ObjectId for MongoDB
  const objectId = new Types.ObjectId(userId)

  // Retrieve the current state of sharedUsers
  const map = await Map.findById(mapId).select('sharedUsers owner')
  if (!map) {
    throw new Error('Map not found')
  }

  // Safely handle and type-cast sharedUsers
  const sharedUsers =
    (map.sharedUsers as (Types.ObjectId | IUserDocument['_id'])[]) || []

  // Check if each item is an ObjectId
  const sharedUsersWithoutOwner = sharedUsers.filter(
    (user) => user instanceof Types.ObjectId
  )

  // Append owner to shared user list
  const sharedUsersWithOwner = [
    ...sharedUsersWithoutOwner,
    map.owner as Types.ObjectId,
  ]

  // Init var for query
  let updateOperation
  let message: string | undefined

  if (action === 'add') {
    // Determine if user already in shared user list
    const sharedUsersListWhenAdding = sharedUsersWithOwner.some(
      (user) => user.toString() === userId
    )
    if (sharedUsersListWhenAdding) {
      // If userId is already in sharedUsers, no action needed
      message = 'User already have access to map'
    } else {
      updateOperation = { $addToSet: { sharedUsers: objectId } } // Add user without duplication
    }
  } else if (action === 'remove') {
    // Determine if user already not in shared user list
    const sharedUsersListWhenRemoving = sharedUsersWithoutOwner.some(
      (user) => user.toString() === userId
    )
    if (!sharedUsersListWhenRemoving) {
      // If userId is not in sharedUsers, no action needed
      message = 'User already does not have access to map'
    } else {
      updateOperation = { $pull: { sharedUsers: objectId } } // Remove user if present
    }
  } else {
    throw new Error('Invalid action specified. Use "add" or "remove".')
  }

  // Perform the update in MongoDB if necessary
  const updatedMap = updateOperation
    ? await Map.findByIdAndUpdate(
        mapId,
        updateOperation,
        { new: true } // Return the updated document
      ).populate('sharedUsers', 'username email')
    : map

  return { updatedMap, message }
}
