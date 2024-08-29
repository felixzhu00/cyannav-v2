import { NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { updateMapSharedUsers } from '@/core/data-access/map/update-map.persistence'

export async function addUserToMapUseCase(id: string, userId: string, operation: "add" | "remove") {
  try {
    // Ensure the ID is valid
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid map ID' }, { status: 400 })
    }

    // Validate userId
    if (!Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    // Call the service to add user to map
    const { updatedMap, message } = await updateMapSharedUsers(
      id,
      userId,
      operation
    )

    return NextResponse.json(
      {
        data: updatedMap,
        message: message || (operation === "add" ? 'Successfully added User': 'Successfully removed User'),
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

