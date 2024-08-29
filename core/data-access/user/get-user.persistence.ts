import { UserFields } from '@/core/_entities/types/user.types'
import { FilterQuery } from 'mongoose';
import User from "@/db/user.model"

export async function getUsersByFields(
  userFields: UserFields,
  option: 'union' | 'intersection' = 'union' // Default to 'union'
) {
  // Prepare the query object based on the 'option' parameter
  let query: FilterQuery<typeof User>

  if (option === 'union') {
    // Use `$or` operator for a union of fields
    query = {
      $or: Object.entries(userFields).map(([key, value]) => ({ [key]: value })),
    }
  } else {
    // Use the fields directly for an intersection of fields
    query = userFields as FilterQuery<typeof User>;
  }

  // Perform the find operation
  const user = await User.find(query)

  return user
}
