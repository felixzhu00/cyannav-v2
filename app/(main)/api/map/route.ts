import { NextRequest, NextResponse } from 'next/server'
import { getStarredMapByUserId } from '@/core/data-access/map/get-map.persistence'
import { getMapsByMapFieldsUseCase } from '@/core/use-cases/map/get-map.use-case'

import { auth } from '@/lib/auth'
import { createMapUseCase } from '@/core/use-cases/map/create-map.use-case'
import { IMapDocument } from '@/core/_entities/types/map.types'

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
        maps = await getMapsByMapFieldsUseCase(
          {
            owner: userId,
            isTemplate: false,
          },
          'intersection'
        )
        break

      case 'community':
        maps = await getMapsByMapFieldsUseCase(
          {
            isPublished: 'public',
            isTemplate: false,
          },
          'intersection'
        )
        break

      case 'shared-with-me':
        if (!userId) {
          return NextResponse.json({ message: 'Unauthorized', status: 401 })
        }
        maps = await getMapsByMapFieldsUseCase(
          {
            sharedUsers: userId,
            isTemplate: false,
          },
          'intersection'
        )
        break

      case 'starred-maps':
        if (!userId) {
          return NextResponse.json({ message: 'Unauthorized', status: 401 })
        }
        maps = await getStarredMapByUserId(userId)
        break
      case 'templates':
        if (!userId) {
          return NextResponse.json({ message: 'Unauthorized', status: 401 })
        }
        maps = await getMapsByMapFieldsUseCase({
          isTemplate: true,
        })
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

export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const session = await auth()
    const userId = session?.user?.id

    const contentType = request.headers.get('content-type') || ''

    let updateFields: Record<string, any> = {}

    if (contentType.includes('application/json')) {
      updateFields = await request.json()
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const entries = Array.from(formData.entries())
      for (const [key, value] of entries) {
        if (value instanceof Blob) {
          const arrayBuffer = await value.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)

          updateFields[key] = buffer
        } else {
          try {
            updateFields[key] = JSON.parse(value as string)
          } catch {
            updateFields[key] = value
          }
        }
      }
    } else {
      return NextResponse.json(
        { message: 'Unsupported content type' },
        { status: 400 }
      )
    }

    const { geojson, title, thumbnail } = updateFields

    const mapFields = {
      title,
      owner: userId,
      mapType: 'heatmap', // consider haveing a default in Imap interface
      geojson,
      thumbnail,
    }

    // Call Usecase
    const res = await createMapUseCase(mapFields)

    // If use case error
    if ('error' in res) {
      console.error(res.error)
      return NextResponse.json({ message: res.message }, { status: res.status })
    }

    // Get created map
    const map = res.payload as IMapDocument

    // return new Map Id so page know where to direct user to new page
    return NextResponse.json({
      message: 'User map created',
      status: 200,
      payload: map._id,
    })
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        status: 500,
      },
      { status: 500 }
    )
  }
}
