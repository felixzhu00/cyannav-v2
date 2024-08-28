import { getMapUseCase } from '@/core/use-cases/map/get-map.use-case'
import { updateMapFieldsUseCase } from '@/core/use-cases/map/update-map.use-case'
import { MapFields } from '@/core/_entities/types/map.types'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  // Destructure the id from param /map/${id}
  const { id } = params

  // Handle business logic getting the formated map
  const res = await getMapUseCase(id)

  return res
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Destructure the id from param /map/${id}
  const { id } = params

  // Destructure and assign type to updateFields data from request
  const updateFields = (await request.json()) as MapFields

  // Update Any Map Fields
  const res = updateMapFieldsUseCase(id, updateFields)

  return res
}
