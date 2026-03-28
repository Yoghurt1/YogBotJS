import { MeetingSessionKey } from '../../constants'
import { Tyre } from '../../enums'
import { SessionedRequest, BaseMessage } from './baseMessage'

export interface Stint {
  compound: Tyre
  driver_number: number
  // Number of the last completed lap in this stint.
  lap_end: number
  // Number of the initial lap in this stint (starts at 1).
  lap_start: number
  meeting_key: number
  session_key: number
  // The sequential number of the stint within the session (starts at 1).
  stint_number: number
  // The age of the tyres at the start of the stint, in laps completed.
  tyre_age_at_start: number
}

export interface StintRequest extends Partial<Omit<Stint, MeetingSessionKey>>, SessionedRequest {}

export interface StintMessage extends Stint, BaseMessage {}
