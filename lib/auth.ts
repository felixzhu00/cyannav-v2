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
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      profilePicture: string
      username: string
      email: string
    }
    userId: string & DefaultSession['user']
  }
}
const providers: Provider[] = [
  GitHub({
    profile(profile: GitHubProfile) {
      const user = {
        // id: profile.id.toString(), // Uncomment if needed
        username: profile.name || profile.login,
        email: profile.email,
        salt: '1',
        profilePicture: profile.avatar_url,
      }
      return user
    },
    allowDangerousEmailAccountLinking: true, // TEMP FIX
  }),
  Google({
    profile(profile: GoogleProfile) {
      const user = {
        // id: profile.id, // Uncomment if needed
        username: profile.name,
        email: profile.email,
        salt: '1',
        profilePicture: profile.picture,
      }
      return user
    },
    allowDangerousEmailAccountLinking: true, // TEMP FIX
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
    async session({ session, user }) {
      // Adding user.id or _id to session object
      if (user) {
        session.userId = user.id // or session.userId = user._id
      }
      return session
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
