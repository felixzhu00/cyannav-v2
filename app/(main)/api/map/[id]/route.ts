import { getMapUseCase } from '@/core/use-cases/map/get-map.use-case'
import {
  toggleMapArrayFieldsByIdUseCase,
  updateMapFieldsUseCase,
} from '@/core/use-cases/map/update-map.use-case'
import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    // Destructure the id from param /map/${id}
    const { id } = params

    // Handle business logic getting the formated map
    const res = await getMapUseCase(id)

    // If use case error
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
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

    const res = await updateMapFieldsUseCase(id, updateFields)

    if ('error' in res) {
      return NextResponse.json({ message: res.message }, { status: res.status })
    }

    return NextResponse.json(
      { message: res.message, payload: res.payload },
      { status: res.status }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        errors: { server: ['Internal server error'] },
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Destructure the id from param /map/${id}
//     const { id } = params
//     // Destructure and assign type to updateFields data from request
//     const updateFields = (await request.json()) as MapFields

//     console.log(updateFields)
//     // Update Any Map Fields
//     const res = await updateMapFieldsUseCase(id, updateFields)

//     // If use case error
//     if ('error' in res) {
//       console.error(res.error)
//       return NextResponse.json({ message: res.message }, { status: res.status })
//     }

//     // Return success
//     return NextResponse.json(
//       { message: res.message, payload: res.payload },
//       { status: res.status }
//     )
//   } catch (error) {
//     // Log error on console for dev debug
//     console.error(error)

//     // Send generic response for user API calls
//     return NextResponse.json(
//       {
//         errors: { server: ['Internal server error'] },
//         message: 'Internal server error',
//       },
//       { status: 500 }
//     )
//   }
// }

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get map ID from route param
    const { id: mapId } = params

    // Get current user session
    const session = await auth()
    const userId = session?.user?.id

    const { updateKey } = await request.json()

    const res = await toggleMapArrayFieldsByIdUseCase(mapId, userId, updateKey)

    // If use case error
    if ('error' in res) {
      console.error(res.error)
      return NextResponse.json({ message: res.message }, { status: res.status })
    }

    return NextResponse.json({
      message: 'Toggle successful',
      status: 200,
      payload: true,
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
