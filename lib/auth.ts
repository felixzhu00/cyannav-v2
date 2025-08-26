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
import crypto from 'crypto'
import { randomUUID } from 'crypto'
import { encode as defaultEncode } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      username: string
    } & DefaultSession['user'] &
      IUserDocument
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
      if (!credentials?.email || !credentials?.password) {
        return null
      }

      await dbConnect()
      const user = (await User.findOne({
        email: credentials.email,
      })) as IUserDocument

      if (!user) {
        throw new Error('No user found with this email')
      }

      const hashedAttempt = crypto
        .pbkdf2Sync(
          credentials.password as string,
          user.salt as string,
          100,
          64,
          'sha256'
        )
        .toString('hex')

      const isValid = hashedAttempt === user.password

      if (!isValid) {
        throw new Error('Invalid password')
      }

      const image =
        user.profilePicture instanceof Buffer
          ? `data:image/png;base64,${user.profilePicture.toString('base64')}`
          : '/logo.svg'

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
      await dbConnect()

      // Check if user is in db
      const existingUser = await User.findOne({ email: user.email })

      // Add provider to the list of provider user login in with
      if (existingUser) {
        await User.updateOne(
          { email: user.email },
          { $addToSet: { providers: account?.provider } }
        )
      } else {
        // User first time login
        const imageRes = await fetch(user.image as string)
        const buffer = await imageRes.arrayBuffer()
        await User.create({
          email: user.email,
          username: user.name || user.email,
          providers: [account?.provider],
          profilePicture: Buffer.from(buffer), // Store profile picture in DB
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
          username: (user as any).username,
        },
      }
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'credentials') {
        token.credentials = true
      }
      return token
    },
  },
  session: {
    strategy: 'database', // stores sessions in DB
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = randomUUID()

        if (!params.token.sub) {
          throw new Error('No user ID found in token')
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        if (!createdSession) {
          throw new Error('Failed to create session')
        }

        return sessionToken
      }
      return defaultEncode(params)
    },
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
