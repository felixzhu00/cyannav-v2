export interface ISubscription {
  userId: string
  stripeSubId: string
  plan: 'free' | 'pro'
  billingInterval: 'monthly' | 'yearly' | null
  status: 'active' | 'canceling' | 'expired'
  endDate: Date
  updatedAt?: Date
}

export interface ISubscriptionDocument extends ISubscription, Document {}
