import { z } from 'zod'

export const LoginFormSchema = z.object({
  email: z.string().nonempty({ message: 'Email is required.' }).email({
    message: 'Invalid email address.',
  }),
  password: z.string().nonempty({ message: 'Password is required.' }),
})
export type LoginFormData = z.infer<typeof LoginFormSchema>

// You can reuse or redefine your schema here
export const RegisterFormSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password must match password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  })

export const FooterEmailFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

export type FooterEmailFormData = z.infer<typeof FooterEmailFormSchema>