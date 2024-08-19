import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import placeholder from '@/public/map_placeholder.png'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaApple } from 'react-icons/fa'

export default function Page() {
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
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@cyannav.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="outline"
              className="flex w-full flex-row space-x-2"
            >
              <FcGoogle className="text-lg" />
              <p>Login with Google</p>
            </Button>
            <Button
              variant="outline"
              className="flex w-full flex-row space-x-2"
            >
              <FaGithub className="text-lg" />
              <p>Login with GitHub</p>
            </Button>
            <Button
              variant="outline"
              className="flex w-full flex-row space-x-2"
            >
              <FaApple className="text-lg" />
              <p>Login with Apple</p>
            </Button>
          </div>
          <hr className="my-2" />
          <div className="text-center text-xs">
            New to CyanNav?{' '}
            <Link href="/signup" className="hover:underline">
              Sign up
            </Link>
          </div>
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
