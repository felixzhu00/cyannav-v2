import User from '@/db/user.model'
import dbConnect from '@/db/dbConnect'
import { createErrorResponse, handleDBError } from '@/lib/utils'
import { Types } from 'mongoose'

export default async function deleteUserById(userId: string) {
  try {
    await dbConnect()

    // Validate ObjectId
    if (!Types.ObjectId.isValid(userId))
      return createErrorResponse(
        400,
        'Invalid User ID',
        'Provided ID is not a valid MongoDB ObjectId'
      )

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return {
        status: 404,
        message: 'User not found',
        error: 'No user with that ID exists in the database',
      }
    }

    return {
      status: 200,
      message: 'User successfully deleted',
      payload: deletedUser,
    }
  } catch (error) {
    return handleDBError(error)
  }
}
