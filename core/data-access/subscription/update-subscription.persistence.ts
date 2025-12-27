import Subscription from '@/db/subscription.model'

type UpsertPayload = {
  userId: string
  stripeSubId: string
  plan?: 'pro'
  billingInterval?: 'monthly' | 'yearly'
  status?: 'active' | 'canceling'
  endDate: Date
}

export async function upsertSubscription({
  userId,
  stripeSubId,
  plan = 'pro',
  billingInterval = 'monthly',
  status = 'active',
  endDate,
}: UpsertPayload) {
  await Subscription.findOneAndUpdate(
    { userId },
    {
      $set: {
        stripeSubId,
        plan,
        billingInterval,
        status,
        endDate,
        updatedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  )
}
