import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { MapFields } from '@/core/_entities/types/map.types'
import { updateMapFieldsById } from '@/core/data-access/map/update-map.persistence'
import { getMapById } from '@/core/data-access/map/get-map.persistence'

export async function updateGeoJSONUseCase(
  id: string,
  variableName: string,
  variableValue: string | number,
  type: 'local' | 'global',
  action: 'add' | 'update' | 'remove'
) {
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

    if (variableName === '' || variableValue === '') {
      return NextResponse.json(
        { error: 'variableName/variableValue can not be empty' },
        { status: 400 }
      )
    }

    if (type === 'local') {
    } else {
      //Type is Global
      const updatedMap = await updateGeoJSONSharedFieldsUseCase(
        id,
        variableName,
        variableValue,
        action
      )

      if (!updatedMap) {
        return NextResponse.json(
          { error: 'Adding/Updating shared unsuccessful' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        message: `Global variable added/updated successfully`,
        map: updatedMap,
      })
    }
  } catch (error) {
    // Log error on console for dev debug
    console.error(error)
    // Send generic response for user API calls
    return NextResponse.json({ error: 'Failed to update map' }, { status: 500 })
  }
}

// export async function updateGeoJSONSharedFieldsUseCase(
//   id: string,
//   variableName: string,
//   variableValue: string | number,
//   action: 'add' | 'update' | 'remove'
// ) {
//   if (action === 'add' || action === 'update') {
//   } else {
//   }
// }
