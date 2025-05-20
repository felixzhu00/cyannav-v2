import { NextRequest, NextResponse } from 'next/server'
import { addUserToMapUseCase } from '@/core/use-cases/map/share-map.use-case'
import { getAUserIdByFieldsUseCase } from '@/core/use-cases/user/get-user.use-case'
import { UserFields } from '@/core/_entities/types/user.types'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Destructure the id from param /map/${id}
    const { id } = params

    // Destructure and user data from request
    const { user, option } = await request.json()

    // Assume user var is email

    // Obtain userId from user(can be uniqueName? or email)
    const getUserRes = await getAUserIdByFieldsUseCase({
      email: user,
    } as UserFields)

    // Check request errored
    if ('error' in getUserRes) {
      console.error(getUserRes.error)
      return NextResponse.json(
        { message: getUserRes.message },
        { status: getUserRes.status }
      )
    }

    // get user Id
    const userId = getUserRes.payload

    // Add User to Map
    const res = await addUserToMapUseCase(id, userId as string, option)

    // Check request errored
    if ('error' in res) {
      console.error(res.error)
      return NextResponse.json({ message: res.message }, { status: res.status })
    }

    // Return success
    return NextResponse.json(
      { message: res.message, payload: res.payload },
      { status: res.status }
    )
  } catch (error) {
    // Log error on console for dev debug
    console.error(error)

    // Send generic response for user API calls
    return NextResponse.json(
      {
        errors: { server: ['Internal server error'] },
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
