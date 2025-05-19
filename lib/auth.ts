import NextAuth, { type DefaultSession } from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/db'
import Google from 'next-auth/providers/google'
import { GoogleProfile } from 'next-auth/providers/google'
import { GitHubProfile } from 'next-auth/providers/github'
import GitHub from 'next-auth/providers/github'
import type { Provider } from 'next-auth/providers'
import User from '@/db/user.model'
import Credentials from 'next-auth/providers/credentials'
import { IUserDocument } from '@/core/_entities/types/user.types'
import dbConnect from '@/db/dbConnect'

declare module 'next-auth' {
  interface Session {
    user: {
      username: string
    } & DefaultSession['user']
    userId: string
  }
}

// Helper function to fetch image as Buffer using fetch
async function fetchImageAsBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

const providers: Provider[] = [
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      console.log(credentials)
      const user = (await User.findOne({
        email: credentials.email,
      })) as IUserDocument

      if (!user) {
        throw new Error('No user found with this email')
      }

      // Example password validation (replace with hashed comparison)
      const isValid = user.password === credentials.password

      if (!isValid) {
        throw new Error('Invalid password')
      }

      const image =
        user.profilePicture instanceof Buffer
          ? `data:image/png;base64,${user.profilePicture.toString('base64')}`
          : '/cyannav cyan.svg'

      return {
        id: user.id.toString(),
        username: user.username,
        email: user.email,
        image,
      }
    },
  }),
  GitHub({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    authorization: { params: { scope: 'read:user user:email' } },
    profile: async (profile: GitHubProfile) => {
      return {
        id: profile.id.toString(),
        username: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    allowDangerousEmailAccountLinking: true,
  }),
  Google({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    profile: async (profile: GoogleProfile) => {
      return {
        id: profile.sub.toString(),
        username: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      }
    },
    allowDangerousEmailAccountLinking: true,
  }),
]

export const adapter = MongoDBAdapter(clientPromise, {
  databaseName: 'cyan',
  collections: {
    Users: 'users', // or your actual collection name
  },
})

export const authConfig = {
  adapter,
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.provider || !user?.email) return true

      await dbConnect()

      const existingUser = await User.findOne({ email: user.email })

      if (existingUser) {
        await User.updateOne(
          { email: user.email },
          { $addToSet: { providers: account.provider } }
        )
      } else {
        // User doesn't exist yet, create manually with providers array
        await User.create({
          email: user.email,
          username: user.name || user.email,
          providers: [account.provider],
          // other defaults as needed
        })
      }

      return true
    },
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          userId: user.id,
          username: (user as any).username, // assuming it's on the user object
        },
      }
    },
  },
  events: {
    async createUser({ user }) {
      await dbConnect()
      // Runs upon first user login, this is here as an in
      const userHasBuffer = await User.findOne({
        email: user.email,
        profilePicture: { $ne: null },
      })
      if (!userHasBuffer) {
        //Fetch avatar and store buffer in DB
        const imageRes = await fetch(user.image as string)
        const buffer = await imageRes.arrayBuffer()

        // Update the newly created user
        await User.updateOne(
          { email: user.email },
          {
            $set: {
              plan: 'free',
              dateCreated: new Date(),
              profilePicture: Buffer.from(buffer),
              favorite: [],
            },
          }
        )
      }
    },
  },
  session: {
    strategy: 'database', // stores sessions in DB
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== 'credentials')
