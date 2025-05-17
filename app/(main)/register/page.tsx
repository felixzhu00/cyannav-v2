import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import placeholder from '@/public/map_placeholder.png'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import { signIn, providerMap } from '@/lib/auth'
import { AuthError } from 'next-auth'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import RegisterForm from '@/components/auth/register-form'

export const RegisterFormSchema = z
  .object({
    email: z
      .string()
      .nonempty({ message: 'Email is required.' })
      .email({ message: 'Please enter a valid email address.' }),
    password: z
      .string()
      .nonempty({ message: 'Password is required.' })
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .nonempty({ message: 'Please confirm your password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export default async function Register() {
  const session = await auth()

  if (session) {
    redirect('/dashboard?view=recent-maps')
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="hidden bg-muted lg:block">
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
            <h1 className="text-2xl font-bold">Create An Account</h1>
          </div>

          <RegisterForm />

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium underline hover:text-chart-2"
            >
              Log in
            </Link>
          </div>

          <div className="my-4 flex items-center gap-4">
            <hr className="flex-grow border border-ring" />
            <span className="text-sm text-muted-foreground">or</span>
            <hr className="flex-grow border border-ring" />
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
                    <span>Sign up with {provider.name}</span>
                  </Button>
                </form>
              ))}
            </div>
          </div>

          <div className="text-center text-xs">
            By signing up, you agree to our{' '}
            <Link href="#" className="underline hover:text-chart-2">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline hover:text-chart-2">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
