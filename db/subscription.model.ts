import { ISubscriptionDocument } from '@/core/_entities/types/subscription.types'
import { InferSchemaType, Schema, model, models } from 'mongoose'

const subscriptionSchema = new Schema<ISubscriptionDocument>({
  userId: { type: String, required: true, unique: true },
  stripeSubId: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  billingInterval: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly',
  },
  status: {
    type: String,
    enum: ['active', 'canceling', 'expired'],
    default: 'active',
  },
  endDate: { type: Date, required: true },
  updatedAt: { type: Date, default: Date.now },
})

delete models.Subscription
//Export Subscription Schema
export default model<ISubscriptionDocument>('Subscription', subscriptionSchema)

// Export Type of Subscription Schema
export type IMap = InferSchemaType<typeof subscriptionSchema>
