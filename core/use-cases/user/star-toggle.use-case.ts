import { Types } from 'mongoose'
import { getUsersByFields } from '@/core/data-access/user/get-user.persistence'
import { IUserDocument } from '@/core/_entities/types/user.types'
import { updateUserFieldsById } from '@/core/data-access/user/update-user.persistence'
import { getMapById } from '@/core/data-access/map/get-map.persistence'
import { IMapDocument } from '@/core/_entities/types/map.types'

interface ToggleUserFavoriteParams {
  mapId: string
  userId: string
}

export async function toggleUserFavoriteUseCase({
  mapId,
  userId,
}: ToggleUserFavoriteParams) {
  if (
    !userId ||
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(mapId)
  ) {
    return { status: 400, message: 'Invalid IDs' }
  }

  const mapObjectId = new Types.ObjectId(mapId)
  const userDoc = await getUsersByFields({ _id: userId })
  const mapDoc = await getMapById(mapId)

  if (!userDoc || !userDoc.payload) {
    return { status: 404, message: 'User not found' }
  }

  if (!mapDoc || !mapDoc.payload) {
    return { status: 404, message: 'Map not found' }
  }

  const userRes = (userDoc.payload as IUserDocument[])[0]
  const mapRes = mapDoc.payload as IMapDocument

  // if user is not in sharedUser and map is not public
  const userInSharedUser =
    mapRes.sharedUsers?.some((id: any) => id.toString() === userId) ||
    (mapRes.owner as any)._id.toString() === userId

  if (!userInSharedUser && mapRes.isPublished !== 'public')
    return { status: 400, message: 'Can not star on restricted map' }

  // Star logic
  const alreadySelected = userRes.favorite?.some(
    (id: any) => id.toString() === mapId
  )

  const update: any = {}

  if (alreadySelected) {
    update.$pull = {
      ['favorite']: mapObjectId,
    }
  } else {
    update.$addToSet = { ['favorite']: mapObjectId }
  }

  const updatedUser = await updateUserFieldsById(userId, update)
  if (!updatedUser || !updatedUser.payload) {
    return { status: 404, message: 'User update failed' }
  }

  const updatedUserRes = updatedUser.payload as IUserDocument

  return {
    status: 200,
    message: 'Toggled Star',
    payload: updatedUserRes,
  }
}
