import { MeetingSessionKey } from '../../constants'
import { SessionedRequest, BaseMessage } from './baseMessage'

export interface Pit {
  date: string
  driver_number: number
  lane_duration: number
  lap_number: number
  meeting_key: number
  /**
   * @deprecated Will be removed after 2026 season.
   * stop_duration should be used instead.
   */
  pit_duration: number
  session_key: number
  stop_duration: number
}

export interface PitRequest extends Partial<Omit<Pit, MeetingSessionKey>>, SessionedRequest {}

export interface PitMessage extends Pit, BaseMessage {}
