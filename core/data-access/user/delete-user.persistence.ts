import User from '@/db/user.model'
import dbConnect from '@/db/dbConnect'

export default async function deleteUserById(userId: string, email: string) {
  dbConnect()

  const user = await User.findById(userId)

  if (!user) {
    return {
      status: 400,
      message: 'User not found',
      error: 'User not found',
    }
  }

  if (user.email !== email) {
    return {
      status: 400,
      message: 'Email provided does not match.',
      error:
        'The user provided an email that does not match what is in the database.',
    }
  }

  if (user.id != userId) {
    return {
      status: 400,
      message: 'User ID does not match',
      error: 'The user ID provided does not match what is in the database.',
    }
  }

  // After all checks, delete the user from the database.
  await User.deleteOne({ _id: userId })
  return {
    status: 200,
    message: 'User deleted successfully',
  }
}
