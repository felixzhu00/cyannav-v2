'use client'
import React from 'react'
import Image from 'next/image'
import logo from '@/public/cyannav_logo.png'
import { Github, Linkedin, Twitter } from 'lucide-react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

const FormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

export default function Footer() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email } = data
    console.log(email)
    toast({
      description: 'Thank you for subscribing to our newsletter.',
    })
  }

  return (
    <footer className="flex h-[325px] w-full flex-col justify-center space-y-12 border-t border-gray-200 bg-white px-16 py-14 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-row justify-between">
        {/* Footer Intro */}
        <div className="flex flex-col space-y-5">
          <Image src={logo} alt="Logo" width={129} height={65} priority />
          <p className="text-sm font-medium">
            Create and design stunning maps to share with others.
          </p>
          <div className="flex space-x-6">
            <Link
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="CyanNav Twitter"
            >
              <Twitter />
            </Link>
            <Link
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="CyanNav Github"
            >
              <Github />
            </Link>
            <Link
              href="https://linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="CyanNav Linkedin"
            >
              <Linkedin />
            </Link>
          </div>
        </div>

        {/* Product */}
        <div className="flex flex-col space-y-5 text-sm">
          <h6 className="font-bold">Product</h6>
          <Link href="/features" legacyBehavior passHref>
            Features
          </Link>
          <Link href="/pricing" legacyBehavior passHref>
            Pricing
          </Link>
        </div>

        {/* Company */}
        <div className="flex flex-col space-y-5 text-sm">
          <h6 className="font-bold">Company</h6>
          <Link href="/about" legacyBehavior passHref>
            About
          </Link>
          <Link href="/careers" legacyBehavior passHref>
            Careers
          </Link>
        </div>

        {/* Support */}
        <div className="flex flex-col space-y-5 text-sm">
          <h6 className="font-bold">Support</h6>
          <Link href="/documentation" legacyBehavior passHref>
            Documentation
          </Link>
          <Link href="/help" legacyBehavior passHref>
            Help Center
          </Link>
          <Link href="/contact" legacyBehavior passHref>
            Contact
          </Link>
        </div>

        {/* Subscribe */}
        <div className="flex w-[384px] flex-col space-y-5 text-sm">
          <h6 className="font-bold">Subscribe</h6>
          <p className="font-medium">
            Get the latest news and updates from CyanNav.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input
                          placeholder="your-email@example.com"
                          {...field}
                          className="flex-grow"
                        />
                      </FormControl>
                      <Button type="submit">Submit</Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-sm font-medium">
          © 2024 CyanNav Inc. All rights reserved.
        </p>
        <div className="flex flex-row space-x-7 text-sm font-medium">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/cookie-policy">Cookie Policy</Link>
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="Light">Light</Label>
          <Switch id="appearance-switch" />
          <Label htmlFor="Dark">Dark</Label>
        </div>
      </div>
    </footer>
  )
}
