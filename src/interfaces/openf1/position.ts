import { MeetingSessionKey } from '../../constants'
import { SessionedRequest, BaseMessage } from './baseMessage'

export interface Position {
  date: string
  driver_number: number
  meeting_key: number
  position: number
  session_key: number
}

export interface PositionRequest extends Partial<Omit<Position, MeetingSessionKey>>, SessionedRequest {}

export interface PositionMessage extends Position, BaseMessage {}
