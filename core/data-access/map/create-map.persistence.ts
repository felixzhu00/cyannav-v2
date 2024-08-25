import { IMap } from '@/core/_entities/types/map.types'
import Map from '@/db/map.model'

export async function createMap(params: IMap) {
  const map = new Map(params)
  return map.save()
}
