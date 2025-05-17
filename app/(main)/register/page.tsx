import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import placeholder from '@/public/map_placeholder.png'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaApple } from 'react-icons/fa'
import { signIn, providerMap } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()

  if (session) {
    redirect('/dashboard?view=recent-maps')
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="bg-muted hidden lg:block">
        <Image
          src={placeholder}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-2xl font-bold">Login</h1>
            <p className="text-muted-foreground text-balance">
              Sign in using one of the following providers
            </p>
          </div>
          <div className="grid gap-4">
            <div className="flex flex-col gap-2">
              {Object.values(providerMap).map((provider) => (
                <form
                  key={provider.id}
                  action={async () => {
                    'use server'
                    try {
                      await signIn(provider.id, {
                        redirectTo: '/dashboard?view=recent-maps',
                      })
                    } catch (error) {
                      if (error instanceof AuthError) {
                        return
                        // redirect(
                        //   `${SIGNIN_ERROR_URL}?error=${error.type}`
                        // )
                      }
                      throw error
                    }
                  }}
                >
                  <Button
                    type="submit"
                    className="flex w-full flex-row items-center space-x-2 rounded-md border p-2 hover:bg-opacity-80"
                  >
                    {provider.id === 'google' && (
                      <FcGoogle className="text-lg" />
                    )}
                    {provider.id === 'github' && (
                      <FaGithub className="text-lg" />
                    )}
                    {provider.id === 'apple' && <FaApple className="text-lg" />}
                    <span>Sign in with {provider.name}</span>
                  </Button>
                </form>
              ))}
            </div>
          </div>

          <hr className="my-2" />

          <div className="text-center text-xs">
            <Link href="#" className="hover:underline">
              Get help
            </Link>
          </div>
          <div className="text-center text-xs">
            By signing in, you agree to our{' '}
            <Link href="#" className="hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="hover:underline">
              Privacy Policy
            </Link>
            {'.'}
          </div>
        </div>
      </div>
    </div>
  )
}
