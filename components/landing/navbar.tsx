import React from 'react'
import { CircleUserRound, Settings } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import SignOut from '@/components/landing/sign-out'

interface NavbarProps {
  session: Session | null
}

interface Session {
  user: {
    username: string
    profilePicture: string
    email: string
  }
  userId: string
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="#intro" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              Getting Started
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="#features" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              Features
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="#community" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              Community
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="#pricing" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              Pricing
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} dark:bg-transparent`}
            >
              Support
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          {session && session.user ? (
            <span className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="h-10 w-10 rounded-full border border-zinc-200 dark:border-zinc-700">
                    <AvatarImage
                      src={`data:image/jpeg;base64,${session.user.profilePicture}`}
                    />
                    <AvatarFallback className="h-10 w-10">
                      <CircleUserRound />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-sm font-medium">
                  <DropdownMenuItem asChild>
                    <Link href="/user?view=settings" passHref>
                      <div className="flex flex-row items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <p>Account Settings</p>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <SignOut />
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          ) : (
            <Link href="/login" legacyBehavior passHref>
              <Button variant="default">Get Started</Button>
            </Link>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
export default Navbar
