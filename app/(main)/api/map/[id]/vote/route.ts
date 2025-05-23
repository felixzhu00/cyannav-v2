import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { toggleMapVoteUseCase } from '@/core/use-cases/map/vote-toggle.use-case'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    const userId = session?.user?.id
    const body = await request.json()
    const { voteType } = body

    const result = await toggleMapVoteUseCase({
      mapId: params.id,
      userId,
      voteType,
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
