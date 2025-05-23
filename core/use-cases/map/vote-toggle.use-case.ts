import { Types } from 'mongoose'
import { getMapById } from '@/core/data-access/map/get-map.persistence'
import { updateMapFieldsById } from '@/core/data-access/map/update-map.persistence'
import { IMapDocument } from '@/core/_entities/types/map.types'

type VoteType = 'like' | 'dislike'

interface ToggleMapVoteParams {
  mapId: string
  userId?: string
  voteType: VoteType
}

export async function toggleMapVoteUseCase({
  mapId,
  userId,
  voteType,
}: ToggleMapVoteParams) {
  if (
    !userId ||
    !Types.ObjectId.isValid(userId) ||
    !Types.ObjectId.isValid(mapId)
  ) {
    return { status: 400, message: 'Invalid IDs' }
  }

  if (!['like', 'dislike'].includes(voteType)) {
    return { status: 400, message: 'Invalid vote type' }
  }

  const userObjectId = new Types.ObjectId(userId)
  const mapDoc = await getMapById(mapId)

  if (!mapDoc || !mapDoc.payload) {
    return { status: 404, message: 'Map not found' }
  }

  const mapRes = mapDoc.payload as IMapDocument

  const hasLiked = mapRes.likes?.some((id: any) => id.toString() === userId)
  const hasDisliked = mapRes.dislikes?.some(
    (id: any) => id.toString() === userId
  )

  const isLike = voteType === 'like'
  const alreadySelected = isLike ? hasLiked : hasDisliked
  const oppositeSelected = isLike ? hasDisliked : hasLiked

  const update: any = {}

  if (alreadySelected) {
    update.$pull = {
      [voteType === 'like' ? 'likes' : 'dislikes']: userObjectId,
    }
  } else {
    update.$addToSet = { [isLike ? 'likes' : 'dislikes']: userObjectId }
    if (oppositeSelected) {
      update.$pull = {
        ...(update.$pull || {}),
        [isLike ? 'dislikes' : 'likes']: userObjectId,
      }
    }
  }

  const updatedMap = await updateMapFieldsById(mapId, update)

  if (!updatedMap || !updatedMap.payload) {
    return { status: 404, message: 'Map update failed' }
  }

  const updatedMapRes = updatedMap.payload as IMapDocument

  return {
    status: 200,
    message: alreadySelected ? `${voteType} removed` : `${voteType} applied`,
    payload: {
      likes: updatedMapRes?.likes,
      dislikes: updatedMapRes?.dislikes,
      popularity:
        (updatedMapRes?.likes?.length ?? 0) -
        (updatedMapRes?.dislikes?.length ?? 0),
    },
  }
}
