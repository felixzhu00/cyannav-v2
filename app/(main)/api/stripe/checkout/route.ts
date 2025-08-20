import { NextResponse, NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // 1. Get the price ID from the request
    const { priceId } = await req.json()

    // 2. Create a checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // fallback if error is not an instance of Error
    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 400 }
    )
  }
}
