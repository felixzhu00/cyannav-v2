import { MapFields } from '@/core/_entities/types/map.types'
import dbConnect from '@/db/dbConnect'
import Map from '@/db/map.model'

export async function updateMapFieldsById(id: string, updateFields: MapFields) {
  await dbConnect() // Ensure database connection

  // Update the map in the database
  const updatedMap = await Map.findByIdAndUpdate(
    id,
    updateFields, // Update fields based on the payload
    { new: true } // Return the updated document
  )

  return updatedMap
}
