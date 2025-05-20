import { UserFields } from '@/core/_entities/types/user.types'
import { FilterQuery } from 'mongoose'
import User from '@/db/user.model'
import { createErrorResponse, handleDBError } from '@/lib/utils'
import dbConnect from '@/db/dbConnect'

export async function getUsersByFields(
  userFields: UserFields,
  option: 'union' | 'intersection' = 'union' // Default to 'union'
) {
  try {
    await dbConnect()

    // All keys to string
    const fields = userFields
      ? Object.keys(userFields).join(', ')
      : 'User Fields'
    // Ensure 'params' is not null or undefined before proceeding
    if (!userFields) {
      return createErrorResponse(
        400,
        `${fields}cannot be null or undefined`,
        'Invalid user field'
      )
    }
    // Prepare the query object based on the 'option' parameter
    let query: FilterQuery<typeof User>

    if (option === 'union') {
      // Use `$or` operator for a union of fields
      query = {
        $or: Object.entries(userFields).map(([key, value]) => ({
          [key]: value,
        })),
      }
    } else {
      // Use the fields directly for an intersection of fields
      query = userFields as FilterQuery<typeof User>
    }

    // Perform the find operation
    const user = await User.find(query)

    // Check if Users are found in DB
    if (!user) {
      return createErrorResponse(
        400,
        'No user with the specified fields in the database',
        'User(s) not found'
      )
    }

    return {
      status: 200,
      message: 'Successfully retrieved User',
      payload: user,
    }
  } catch (error) {
    return handleDBError(error)
  }
}

// export async function checkUserByUsername(username: string) {
//   await dbConnect()
//   const userExists = await User.findOne({ username })
//   if (userExists) {
//     return {
//       status: 200,
//       message: 'Username was found in database', // to the user
//       payload: true,
//     }
//   } else {
//     return {
//       status: 400,
//       message: 'Username was not found in database',
//       error: "The user provided an username that's already in use", // to developer
//     }
//   }
// }
