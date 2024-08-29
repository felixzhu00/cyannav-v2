import { NextRequest } from 'next/server'
import { addUserToMapUseCase } from '@/core/use-cases/map/share-map.use-case'
import { getAUserIdByFields } from '@/core/use-cases/user/get-user.use-case'
import { UserFields } from '@/core/_entities/types/user.types'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Destructure the id from param /map/${id}
  const { id } = params

  // Destructure and user data from request
  const { user, option } = await request.json()

  // Assume user var is email

  // Obtain userId from user(can be uniqueName? or email)
  const getUserRes = (await getAUserIdByFields({
    email: user,
  } as UserFields)) as Response

  // Return any error(status and message) with getting a user
  if (!getUserRes.ok) {
    return getUserRes
  }

  // JSONfy nextResponse
  const userId = await getUserRes.json()

  // Add User to Map
  const res = await addUserToMapUseCase(id, userId as string, option)

  return res
}
