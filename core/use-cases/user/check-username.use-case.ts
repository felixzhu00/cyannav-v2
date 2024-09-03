import { checkUserByUsername } from '@/core/data-access/user/check-user.persistence'

export default async function checkUsernameUseCase(newUsername: string) {
  if (!newUsername)
    return {
      status: 400,
      message: 'Username is required', // displayed to the user
      error: 'The user did not provide a username', // not displayed to the developer
    }

  try {
    const isUsernameAvailable = await checkUserByUsername(newUsername)
    if (!('payload' in isUsernameAvailable)) {
      return { status: 200, message: 'Username is available.', payload: true }
    }

    return { status: 400, message: 'Username already exists.', payload: false }
  } catch (error) {
    console.error(error)
    return {
      status: 400,
      message: 'An error occurred while checking username availability', // displayed to the user
      error: 'An error occurred while checking username availability', // not displayed to the developer
    }
  }
}
