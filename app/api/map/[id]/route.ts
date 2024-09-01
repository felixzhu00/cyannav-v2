import { getMapUseCase } from '@/core/use-cases/map/get-map.use-case'
import { updateMapFieldsUseCase } from '@/core/use-cases/map/update-map.use-case'
import { MapFields } from '@/core/_entities/types/map.types'
import { NextResponse } from 'next/server'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  console.error('getMap', params)
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
    // Destructure the id from param /map/${id}
    const { id } = params
    // Destructure and assign type to updateFields data from request
    const updateFields = (await request.json()) as MapFields

    // Update Any Map Fields
    const res = await updateMapFieldsUseCase(id, updateFields)

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
