import { updateUsernameById } from '@/core/data-access/user/update-username-by-id.persistence'

export default async function saveUsernameUseCase(
  id: string,
  newUsername: string
) {
  if (!newUsername)
    return {
      status: 400,
      message: 'Username is required', // displayed to the user
      error: 'The user did not provide a username',
    }

  try {
    const savedUsername = await updateUsernameById(id, newUsername)
    if (!('payload' in savedUsername)) {
      return {
        status: 200,
        message: 'New username has been saved',
      }
    }

    return {
      status: 400,
      message: 'An error has occurred from saving new username.',
    }
  } catch (error) {
    console.error(error)
    return {
      status: 400,
      message: 'An error occurred while checking username availability',
      error: 'An error occurred while checking username availability',
    }
  }
}
