import { updateProfilePictureById } from '@/core/data-access/user/update-profile-picture-by-id.persistence'

export default async function updateUserProfilePictureUseCase(
  userId: string,
  profilePicture: Buffer
) {
  if (!profilePicture)
    return {
      status: 400,
      message: 'Profile picture is required',
      error: 'The user did not provide a profile picture',
    }

  try {
    const savedProfilePicture = await updateProfilePictureById(
      userId,
      profilePicture
    )
    if (savedProfilePicture.status == 200) {
      return {
        status: 200,
        message: 'New profile picture has been saved',
      }
    }

    return {
      status: 400,
      message: 'An error has occurred from saving new profile picture.',
    }
  } catch (error) {
    console.error(error)
    return {
      status: 400,
      message: 'An error occurred while saving profile picture',
      error: 'An error occurred while saving profile picture',
    }
  }
}
