'use client'
import React from 'react'
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
import ThemeSwitcher from '@/components/theme-toggle'
import LogoTheme from '../landing/logo-theme'
import { FooterColumn } from './footer-column'



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
    toast({
      description: 'Thank you for subscribing to our newsletter.',
    })
    form.reset({ email: "" });
  }

  return (
    <footer className="flex h-[325px] w-full flex-col justify-center space-y-12 border-t border-gray-200 bg-white px-16 py-14 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-row justify-between gap-x-6">
        {/* Footer Intro */}
        <div className="flex flex-col space-y-5">
          <LogoTheme />
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
        <FooterColumn
          title="Company"
          links={[
            { label: 'Features', href: '/features' },
            { label: 'Pricing', href: '/pricing' },
          ]}
        />


        {/* Company */}
        <FooterColumn
          title="Company"
          links={[
            { label: 'About', href: '/about' },
            { label: 'Careers', href: '/careers' },
          ]}
        />

        {/* Support */}
        <FooterColumn
          title="Support"
          links={[
            { label: 'Documentation', href: '/documentation' },
            { label: 'Help Center', href: '/help' },
            { label: 'Contact', href: '/contact' },
          ]}
        />

        {/* Subscribe */}
        <FooterColumn title="Subscribe" className="w-[384px]">
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
        </FooterColumn>

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
        <ThemeSwitcher />
      </div>
    </footer>
  )
}

