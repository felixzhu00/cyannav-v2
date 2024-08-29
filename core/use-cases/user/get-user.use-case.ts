import { UserFields } from '@/core/_entities/types/user.types'
import { getUsersByFields } from '@/core/data-access/user/get-user.persistence'
import { NextResponse } from 'next/server'

export async function getAUserIdByFields(userFields: UserFields) {
  try {
    const users = await getUsersByFields(userFields, 'union')
    if (users.length === 0) {
      const fieldKeys = Object.keys(userFields)
      const fieldList = fieldKeys.join(', ')
      const messOp = fieldKeys.length > 1 ? `field(s):${fieldList}` : fieldList

      return NextResponse.json(
        { error: `Unable to find user with ${messOp}` },
        { status: 404 }
      )
    }
    if (users.length > 1) {
      return NextResponse.json(
        { error: 'Multiple users with field(s) are found' },
        { status: 404 }
      )
    }

    // Return the userId we are looking for
    return NextResponse.json(users[0]._id)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
