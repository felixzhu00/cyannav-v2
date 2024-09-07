import NextAuth, { type DefaultSession } from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '@/lib/db'
import Google from 'next-auth/providers/google'
import { GoogleProfile } from 'next-auth/providers/google'
import { GitHubProfile } from 'next-auth/providers/github'
import GitHub from 'next-auth/providers/github'
import type { Provider } from 'next-auth/providers'
import User from '@/db/user.model'

declare module 'next-auth' {
  interface Session {
    user: {
      profilePicture: string
      username: string
      email: string
    }
    userId: string & DefaultSession['user']
  }
}

// Helper function to fetch image as Buffer using fetch
async function fetchImageAsBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

const providers: Provider[] = [
  GitHub({
    profile: async (profile: GitHubProfile) => {
      const profilePictureBuffer = await fetchImageAsBuffer(profile.avatar_url)
      const user = {
        username: profile.name || profile.login,
        email: profile.email,
        salt: '1',
        profilePicture: profilePictureBuffer,
      }
      return user
    },
    allowDangerousEmailAccountLinking: true,
  }),
  Google({
    profile: async (profile: GoogleProfile) => {
      const profilePictureBuffer = await fetchImageAsBuffer(profile.picture)
      const user = {
        username: profile.name,
        email: profile.email,
        salt: '1',
        profilePicture: profilePictureBuffer,
      }
      return user
    },
    allowDangerousEmailAccountLinking: true,
  }),
]

const adapter = MongoDBAdapter(client, {
  collections: {
    Users: User.collection.name,
  },
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    session({ session, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          userId: user.id,
        },
      }
    },
  },
} satisfies NextAuthConfig)

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
