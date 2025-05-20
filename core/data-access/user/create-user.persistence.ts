import { APIResponse } from '@/core/_entities/types/api.types'
import { IUser } from '@/core/_entities/types/user.types'
import dbConnect from '@/db/dbConnect'
import User from '@/db/user.model'
import { createErrorResponse, handleDBError } from '@/lib/utils'

export async function createUser(params: IUser): Promise<APIResponse> {
  try {
    await dbConnect()
    // Ensure 'params' is not null or undefined before proceeding
    if (!params) {
      return createErrorResponse(
        400,
        'Params cannot be null or undefined',
        'User Data does not conform to User Schema'
      )
    }

    const user = new User(params)
    await user.save()

    return {
      status: 200,
      payload: user,
      message: 'Successfully Added User to DB',
    } // Return the saved map object
  } catch (error: any) {
    return handleDBError(error)
  }
}
