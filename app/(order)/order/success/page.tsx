import { BadgeCheck } from 'lucide-react'
import { stripe } from '@/lib/stripe'
import GeneralPage from '@/components/layouts/general-page'

type SuccessPageProps = {
  searchParams: Record<string, string | undefined>
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const sessionId = searchParams.session_id

  if (!sessionId) {
    return <GeneralPage title="Error" message="Missing session ID." />
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch (err) {
    console.error('Stripe session fetch failed:', err)
    return <GeneralPage title="Error" message="Failed to load session." />
  }

  return (
    <GeneralPage
      title="Payment Successful"
      message="Your order has been successful."
    >
      <BadgeCheck className="mx-auto h-12 w-12 text-green-600" />
    </GeneralPage>
  )
}
