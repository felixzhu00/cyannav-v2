import { NextResponse, NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!process.env.STRIPE_WEBHOOK_SECRET)
      throw new Error('STRIPE_WEBHOOK_SECRET is not defined')

    if (!signature) throw new Error('Signature is not defined')

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      console.log('Payment success', event)
      // Get the items in checkout via the id from completed session
      const session = event.data.object
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

      // Assert the plan the user payed for (month/yearly)
      const item = lineItems.data[0]
      const priceId = item.price?.id // either id of monthly or yearly plan

      console.log(priceId)
      // DB logic
      // Change user plan to pro and add a transaction to transaction list

      // Backend Logic to update frontend view(remove upgrade button)
    }

    return NextResponse.json({ received: true }, { status: 200 })
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
