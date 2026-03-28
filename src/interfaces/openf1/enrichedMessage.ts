import { SessionedMessage } from './baseMessage'
import { Meeting } from './meeting'
import { Session } from './session'

export interface EnrichedMessage extends SessionedMessage {
  session: Session
  meeting: Meeting
}

export interface Enriched<T> {
  message: T
  session: Session
  meeting: Meeting
}
