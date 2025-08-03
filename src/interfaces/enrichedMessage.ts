import { BaseMessage } from './baseMessage'
import { Meeting } from './meeting'
import { Session } from './session'

export interface EnrichedMessage extends BaseMessage {
  session: Session
  meeting: Meeting
}
