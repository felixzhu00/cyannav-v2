// app/api/map/[id]/route.ts

import { NextResponse } from 'next/server'
import Map, { IMapDocument } from '@/models/map'
import { IUserDocument } from '@/models/user'
import dbConnect from '@/lib/dbConnect'
import { Types } from 'mongoose'
import { IMessageDocument } from '@/models/message'

// import User from '@/models/user'
// import Message from '@/models/message'
// import message from '@/models/message'

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
    // const user = await User.find()
    // const message = await Message.find()

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
    return NextResponse.json(
      {
        errors: { server: ['Internal server error'] },
        message: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
