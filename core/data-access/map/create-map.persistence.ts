
import Map from '@/db/map.model'
import mongoose from 'mongoose'

export async function createMap(
    title: string,
    owner: mongoose.Types.ObjectId, // Assuming owner is a reference to a User
    mapType: string,
    isPublished: boolean,
    geojson: Buffer,
    thumbnail?: Buffer,
    like?: mongoose.Types.ObjectId[], // Optional
    messages?: mongoose.Types.ObjectId[], // Optional, assuming comments are references
    sharedUsers?: mongoose.Types.ObjectId[], // Optional
    forkedFrom?: mongoose.Types.ObjectId[], // Optional
    dateCreated?: Date // Optional
  ) {
    const mapDetail: any = {
      title,
      owner,
      mapType,
      isPublished,
      geojson,
    }
  
    if (thumbnail) mapDetail.thumbnail = thumbnail
    if (like) mapDetail.like = like
    if (messages) mapDetail.messages = messages
    if (sharedUsers) mapDetail.sharedUsers = sharedUsers
    if (forkedFrom) mapDetail.forkedFrom = forkedFrom
    if (dateCreated) mapDetail.dateCreated = dateCreated
  
    const map = new Map(mapDetail)
    return map.save()
  }