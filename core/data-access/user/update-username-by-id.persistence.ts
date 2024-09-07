import User from '@/db/user.model'
import dbConnect from '@/db/dbConnect'

export async function updateUsernameById(id: string, newUsername: string) {
  await dbConnect()
  try {
    // Find the user by ID
    const user = await User.findById(id)

    if (user) {
      // Update the username
      user.username = newUsername

      // Save the updated user document
      await user.save()

      return {
        status: 200,
        message: 'Username updated successfully',
      }
    } else {
      return {
        status: 404,
        message: 'User not found in database',
        error: 'The user ID provided does not exist',
      }
    }
  } catch (error) {
    console.error(error)
    return {
      status: 500,
      message: 'An error occurred while updating the username',
      error: 'An error occurred while updating the username',
    }
  }
}
