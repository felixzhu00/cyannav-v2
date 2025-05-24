import { NextRequest, NextResponse } from 'next/server'
import { getStarredMapByUserId } from '@/core/data-access/map/get-map.persistence'
import { getMapsByMapFieldsUseCase } from '@/core/use-cases/map/get-map.use-case'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const view = url.searchParams.get('view')

  // Get server session (may be null for guests)
  const session = await auth()
  const userId = session?.user?.id

  if (!view) {
    return NextResponse.json({ message: 'Invalid request', status: 400 })
  }

  try {
    let maps

    switch (view) {
      case 'my-maps':
        if (!userId) {
          return NextResponse.json({ message: 'Unauthorized', status: 401 })
        }
        maps = await getMapsByMapFieldsUseCase({ owner: userId })
        break

      case 'community':
        maps = await getMapsByMapFieldsUseCase({ isPublished: 'public' })
        break

      case 'shared-with-me':
        if (!userId) {
          return NextResponse.json({ message: 'Unauthorized', status: 401 })
        }
        maps = await getMapsByMapFieldsUseCase({ sharedUsers: userId })
        break

      case 'starred-maps':
        if (!userId) {
          return NextResponse.json({ message: 'Unauthorized', status: 401 })
        }
        maps = await getStarredMapByUserId(userId)
        break

      default:
        return NextResponse.json({
          message: 'Invalid view parameter',
          status: 400,
        })
    }

    // Revalidate dashboard path
    // revalidatePath('/dashboard') // dont need this if no-store in api call

    return NextResponse.json({
      payload: maps.payload,
      message: 'Maps fetched successfully',
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 }
    )
  }
}
