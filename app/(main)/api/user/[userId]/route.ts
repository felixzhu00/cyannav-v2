import { NextResponse } from 'next/server'
import deleteUserUseCase from '@/core/use-cases/user/delete-user.use-case'
import updateUserProfilePictureUseCase from '@/core/use-cases/user/update-profile-picture.use-case'

export async function DELETE(request: Request) {
  const body = await request.json()
  const { userId } = body

  try {
    const res = await deleteUserUseCase(userId)

    if ('error' in res) {
      return NextResponse.json({ message: res.message }, { status: res.status })
    }

    return NextResponse.json({
      message: res.message,
      status: res.status,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error: { server: ['Internal Server Error'] },
        message: 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const body = await request.json()

  const { userId, profilePicture } = body

  try {
    const res = await updateUserProfilePictureUseCase(userId, profilePicture)

    if ('error' in res) {
      return NextResponse.json({ message: res.message }, { status: res.status })
    }

    return NextResponse.json({
      message: res.message,
      status: res.status,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error: { server: ['Internal Server Error'] },
        message: 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}
