import { UserFields } from '@/core/_entities/types/user.types'
import { FilterQuery } from 'mongoose'
import User from '@/db/user.model'
import { handleDBError } from '@/lib/utils'

export async function getUsersByFields(
  userFields: UserFields,
  option: 'union' | 'intersection' = 'union' // Default to 'union'
) {
  try {
    // Ensure 'params' is not null or undefined before proceeding
    if (!userFields) {
      return {
        status: 400,
        error: {
          context: 'getUsersByFields',
          issue: 'userFields cannot be null or undefined',
        },
        message: 'Invalid user field',
      }
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
      return {
        status: 404,
        error: {
          context: 'getUsersByFields',
          issue: 'No user with the specified userFields in the database',
        },
        message: 'User(s) not found',
      }
    }

    return { payload: user }
  } catch (error: any) {
    return handleDBError(error, 'getUsersByFields')
  }
}
