import { BaseMessage } from './baseMessage'
import { Meeting } from './meeting'
import { Session } from './session'

/**
 * @description I thought about doing this differently, e.g.
 *
 * <code>export interface EnrichedMessage<T extends BaseMessage> { message: T ... }</code>
 *
 * But ultimately I preferred having this stuff on the same level as the rest of the message
 * so we don't have to do <code>message.message</code> everywhere.
 */
export interface EnrichedMessage extends BaseMessage {
  session: Session
  meeting: Meeting
}
