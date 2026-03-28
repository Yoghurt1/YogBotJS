import { MeetingSessionKey } from '../../constants'
import { BaseMessage, SessionedRequest } from './baseMessage'

export interface Interval {
  date: string
  driver_number: number
  // The time gap to the race leader in seconds, +1 LAP if lapped, or null for the race leader.
  gap_to_leader?: number | string | null
  // The time gap to the car ahead in seconds, +1 LAP if lapped, or null for the race leader.
  interval?: number | string | null
  meeting_key: number
  session_key: number
}

export interface IntervalRequest extends Partial<Omit<Interval, MeetingSessionKey>>, SessionedRequest {}

export interface IntervalMessage extends Interval, BaseMessage {}
