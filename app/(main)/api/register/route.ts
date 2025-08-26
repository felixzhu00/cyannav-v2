// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import createUserUseCase from '@/core/use-cases/user/create-user.use-case'
import { RegisterFormSchema } from '@/core/_entities/z-schemas/form.schema'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const result = RegisterFormSchema.safeParse(body)

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
      { message: response.error, details: response.message },
      { status: response.status }
    )
  }

  return NextResponse.json(
    { message: response.message, payload: response.payload },
    { status: response.status }
  )
}
