import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth' // your custom function
import { toggleUserFavoriteUseCase } from '@/core/use-cases/user/star-toggle.use-case'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id

    const result = await toggleUserFavoriteUseCase({
      mapId: params.id,
      userId,
    })

    return NextResponse.json(result, { status: result.status })
  } catch (error) {
    console.error('Vote API error:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
