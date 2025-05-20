// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import createUserUseCase from '@/core/use-cases/user/create-user.use-case'

// You can reuse or redefine your schema here
const RegisterSchema = z
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

export async function POST(req: NextRequest) {
  const body = await req.json()

  const result = RegisterSchema.safeParse(body)

  if (!result.success) {
    const errorMessages = result.error.flatten()
    return NextResponse.json(
      {
        message: 'Validation failed',
        details: errorMessages.fieldErrors,
      },
      { status: 400 }
    )
  }

  const { confirmPassword, ...validData } = result.data

  const response = await createUserUseCase(validData)

  if ('error' in response) {
    return NextResponse.json(
      { message: response.error.message, details: response.error.details },
      { status: response.status }
    )
  }

  return NextResponse.json(
    { message: response.message, payload: response.payload },
    { status: response.status }
  )
}
