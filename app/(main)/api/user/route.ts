import { NextResponse } from 'next/server'
import checkUsernameUseCase from '@/core/use-cases/user/check-username.use-case'
import saveUsernameUseCase from '@/core/use-cases/user/save-username.use-case'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const username = url.searchParams.get('username')

  try {
    const res = await checkUsernameUseCase(username as string)

    if ('error' in res) {
      return NextResponse.json({ message: res.message }, { status: res.status })
    }
    return NextResponse.json({
      message: res.message,
      payload: res.payload,
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
  const username = body.username
  const userId = body.userId

  try {
    const res = await saveUsernameUseCase(userId, username)

    console.log(res)
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
