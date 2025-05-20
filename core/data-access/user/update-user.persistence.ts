import { APIResponse } from '@/core/_entities/types/api.types'
import { UserFields } from '@/core/_entities/types/user.types'
import dbConnect from '@/db/dbConnect'
import User from '@/db/user.model'
import { createErrorResponse, handleDBError } from '@/lib/utils'
import { Types } from 'mongoose'

export async function updateUserFieldsById(
  id: string,
  updateFields: UserFields
): Promise<APIResponse> {
  try {
    await dbConnect()

    // Validate ID format
    if (!Types.ObjectId.isValid(id)) {
      return createErrorResponse(
        400,
        'Invalid user ID format',
        'ID should be a valid MongoDB ObjectId'
      )
    }

    // Ensure updateFields is not empty or undefined
    if (!updateFields || Object.keys(updateFields).length === 0) {
      const fields = updateFields
        ? Object.keys(updateFields).join(', ')
        : 'none'
      return createErrorResponse(
        400,
        'Update fields cannot be null, undefined, or empty',
        `Invalid update fields: ${fields}`
      )
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    })

    if (!updatedUser) {
      return createErrorResponse(
        404,
        'User not found',
        'No user with the specified ID in the database'
      )
    }

    return {
      status: 200,
      message: 'Successfully updated user fields by ID',
      payload: updatedUser,
    }
  } catch (error) {
    return handleDBError(error)
  }
}

// export async function updateProfilePictureById(
//   id: string,
//   profilePicture: Buffer
// ) {
//   await dbConnect()
//   try {
//     const user = await User.findById(id)

//     if (user) {
//       user.profilePicture = profilePicture

//       await user.save()

//       return {
//         status: 200,
//         message: 'Profile picture updated successfully',
//       }
//     } else {
//       return {
//         status: 404,
//         message: 'User not found in database',
//         error: 'The user ID provided does not exist',
//       }
//     }
//   } catch (error) {
//     console.error(error)
//     return {
//       status: 500,
//       message: 'An error occurred while updating the profile picture',
//       error: 'An error occurred while updating the profile picture',
//     }
//   }
// }

// export async function updateUsernameById(id: string, newUsername: string) {
//   await dbConnect()
//   try {
//     // Find the user by ID
//     const user = await User.findById(id)

//     if (user) {
//       // Update the username
//       user.username = newUsername

//       // Save the updated user document
//       await user.save()

//       return {
//         status: 200,
//         message: 'Username updated successfully',
//       }
//     } else {
//       return {
//         status: 404,
//         message: 'User not found in database',
//         error: 'The user ID provided does not exist',
//       }
//     }
//   } catch (error) {
//     console.error(error)
//     return {
//       status: 500,
//       message: 'An error occurred while updating the username',
//       error: 'An error occurred while updating the username',
//     }
//   }
// }
