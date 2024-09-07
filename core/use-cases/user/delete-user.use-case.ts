import deleteUserById from '@/core/data-access/user/delete-user.persistence'

export default async function deleteUserUseCase(userId: string, email: string) {
  if (!email)
    return {
      status: 400,
      message: 'Email is required',
      error: 'The user did not provide an email',
    }

  if (!userId)
    return {
      status: 400,
      message: 'Please relogin.',
      error:
        'The userId was not detected. The user will need to be reauthenticated.',
    }

  try {
    const deletedUser = await deleteUserById(userId, email)

    if (deletedUser.status === 200) {
      return {
        status: 200,
        message: 'User has been deleted',
      }
    }

    return {
      status: 400,
      message: 'An error has occurred from deleting user.',
      error: 'An error occurred while deleting user',
    }
  } catch (error) {
    console.error(error)
    return {
      status: 400,
      message: 'An error occurred while deleting user',
      error: 'An error occurred while deleting user',
    }
  }
}
