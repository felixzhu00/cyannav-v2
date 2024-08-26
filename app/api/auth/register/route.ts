import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/user'
import { createUser } from '@/lib/db-query'

const client = new MongoClient('mongodb://localhost:27017')

export async function POST(request: Request) {
  try {
    const { username, email, password, confirmPassword } = await request.json()

    // Input validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: 'All fields are required.' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: 'Passwords do not match.' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists.' },
        { status: 400 }
      )
    }

    const existingUsername = await User.findOne({ username })
    if (existingUsername) {
      return NextResponse.json(
        { message: 'Username already exists.' },
        { status: 400 }
      )
    }

    // Insert the new user into the database
    const result = await createUser(username, email, password)

    // Check if the insertion was successful
    if (result) {
      return NextResponse.json({ message: 'User registered successfully.' })
    } else {
      throw new Error('Failed to insert user.')
    }
  } catch (e: unknown) {
    return NextResponse.json(
      {
        message: 'An error occurred.',
        error: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}
