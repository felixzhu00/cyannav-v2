import User from '@/db/user.model'
import dbConnect from '@/db/dbConnect'

export async function updateProfilePictureById(
  id: string,
  profilePicture: Buffer
) {
  await dbConnect()
  try {
    const user = await User.findById(id)

    if (user) {
      user.profilePicture = profilePicture

      await user.save()

      return {
        status: 200,
        message: 'Profile picture updated successfully',
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
      message: 'An error occurred while updating the profile picture',
      error: 'An error occurred while updating the profile picture',
    }
  }
}
