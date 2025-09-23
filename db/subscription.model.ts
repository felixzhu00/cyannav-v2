import { Schema, model, models } from 'mongoose'

const subscriptionSchema = new Schema({
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

export default model('Subscription', subscriptionSchema)
