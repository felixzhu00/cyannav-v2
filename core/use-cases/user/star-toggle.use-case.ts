import { Types } from 'mongoose'
import { getUsersByFields } from '@/core/data-access/user/get-user.persistence'
import { IUserDocument } from '@/core/_entities/types/user.types'
import { updateUserFieldsById } from '@/core/data-access/user/update-user.persistence'

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

  if (!userDoc || !userDoc.payload) {
    return { status: 404, message: 'User not found' }
  }

  const userRes = (userDoc.payload as IUserDocument[])[0]

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
