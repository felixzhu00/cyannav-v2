import { IMessage } from '@/core/_entities/types/messages.types'
import Message from '@/db/message.model'

export async function createMessage(params: IMessage) {
  const message = new Message(params)
  return message.save()
}
