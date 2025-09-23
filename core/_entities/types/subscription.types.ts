import { subscriptionSchema } from '@/db/subscription.model'
import { InferSchemaType } from 'mongoose'

export type ISubscription = InferSchemaType<typeof subscriptionSchema>

export interface ISubscriptionDocument extends ISubscription, Document {}
