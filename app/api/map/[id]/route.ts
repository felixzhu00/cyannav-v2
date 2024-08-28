// app/api/map/[id]/route.ts

import { NextResponse } from 'next/server'
import Map from '@/db/map.model'
import { Types } from 'mongoose'
import dbConnect from '@/db/dbConnect'
import { IMapDocument } from '@/core/_entities/types/map.types'
import { IUserDocument } from '@/core/_entities/types/user.types'
import { IMessageDocument } from '@/core/_entities/types/messages.types'
import { revalidatePath } from 'next/cache'

import User from '@/db/user.model'
import Message from '@/db/message.model'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json(
      {
        errors: { id: ['Invalid ID'] },
        message: 'Invalid ID',
      },
      { status: 400 }
    )
  }

  try {
    await dbConnect()

    // Uncomment this if there is an issue with nextjs saying that User, Message schema are not registered
    const user = await User.find()
    const message = await Message.find()
    // Code above help Nextjs load model schema

    const map: IMapDocument | null = await Map.findById(id)
      .populate('owner', 'username')
      .populate({
        path: 'messages', // Populates the 'messages' field
        populate: {
          path: 'author', // Populates the 'author' field within each message
          select: 'username', // Only get the 'username' field from the User schema
        },
      })
      .lean()

    if (!map) {
      return NextResponse.json(
        {
          errors: { id: ['Map not found'] },
          message: 'Map not found',
        },
        { status: 404 }
      )
    }

    // Shape db.map into json map
    const transformedMap = {
      ...map,
      owner: (map.owner as IUserDocument)?.username?.toString(),
      geojson: map.geojson ? Buffer.from(map.geojson.buffer) : undefined,
      thumbnail: map.thumbnail ? Buffer.from(map.thumbnail) : undefined,
      messages: map.messages?.map((m) => {
        // Explicitly assert the type of m.author
        const author = (m as IMessageDocument).author as IUserDocument
        return {
          ...(m as IMessageDocument),
          author: author.username,
        }
      }),
      sharedUsers: map.sharedUsers?.map((userId) =>
        (userId as Types.ObjectId).toString()
      ),
      forkedFrom: map.forkedFrom?.toString(),
      likes: map.likes?.map((likeId) => (likeId as Types.ObjectId).toString()),
    }

    return NextResponse.json(transformedMap)
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  if (!id) {
    return NextResponse.json(
      {
        errors: { id: ['Invalid ID'] },
        message: 'Invalid ID',
      },
      { status: 400 }
    )
  }

  const updateFields = await request.json() // Extract fields to be updated from the request body

  try {
    await dbConnect() // Ensure database connection

    // Update the map in the database
    const updatedMap = await Map.findByIdAndUpdate(
      id,
      updateFields, // Update fields based on the payload
      { new: true } // Return the updated document
    )

    if (updatedMap) {
      // Revalidate the specific path after the map is updated
      // revalidatePath(`/map/${id}`)
      console.log(id)
      return NextResponse.json({
        message: 'Map updated successfully',
        map: updatedMap,
      })
    }
    return NextResponse.json({ error: 'Map not found' }, { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update map' }, { status: 500 })
  }
}
