import User from '@/db/user.model'
import dbConnect from '@/db/dbConnect'

export async function checkUserByUsername(username: string) {
  await dbConnect()
  const userExists = await User.findOne({ username })
  if (userExists) {
    return {
      status: 200,
      message: 'Username was found in database', // to the user
      payload: true,
    }
  } else {
    return {
      status: 400,
      message: 'Username was not found in database',
      error: "The user provided an username that's already in use", // to developer
    }
  }
}
