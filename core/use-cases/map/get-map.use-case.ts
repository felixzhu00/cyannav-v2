import { IUserDocument } from '@/core/_entities/types/user.types'
import { IMessageDocument } from '@/core/_entities/types/messages.types'
import { NextResponse } from 'next/server'
import { getMapById } from '@/core/data-access/map/get-map.persistence'
import { revalidatePath } from 'next/cache'
import { Types } from 'mongoose'

export async function getMapUseCase(id: string) {
  try {
    // Check if valid id is passed
    if (!id) {
      return NextResponse.json(
        {
          errors: { id: ['Invalid ID'] },
          message: 'Invalid ID',
        },
        { status: 400 }
      )
    }

    // Get Map object from DB
    const map = await getMapById(id)

    // Check if a Map is found in DB
    if (!map) {
      return NextResponse.json(
        {
          errors: { id: ['Map not found'] },
          message: 'Map not found',
        },
        { status: 404 }
      )
    }

    // Shape DB Map into desired JSON Map
    const transformedMap = {
      ...map,
      owner: {
        username: (map.owner as IUserDocument)?.username?.toString() || '', // Safely access and convert username to string, fallback to an empty string if undefined
        email: (map.owner as IUserDocument)?.email?.toString() || '', // Safely access and convert email to string, fallback to an empty string if undefined
      },
      geojson: map.geojson ? Buffer.from(map.geojson.buffer) : undefined,
      thumbnail: map.thumbnail ? Buffer.from(map.thumbnail) : undefined,
      messages: map.messages?.map((m) => {
        // Explicitly assert the type of m.author
        const author = (m as IMessageDocument).author as IUserDocument
        return {
          ...(m as IMessageDocument),
          author: author.username,
        }
      }),
      sharedUsers:
        map.sharedUsers?.map((sharedUser) => ({
          username: (sharedUser as IUserDocument)?.username?.toString() || '',
          email: (sharedUser as IUserDocument)?.email?.toString() || '',
        })) || [],
      forkedFrom: map.forkedFrom?.toString(),
      likes: map.likes?.map((likeId) => (likeId as Types.ObjectId).toString()),
    }

    // Revalidate Map ID path
    revalidatePath(`/map/${id}`)

    // Return processed Map
    return NextResponse.json(transformedMap)
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
