import { MeetingSessionKey } from '../../constants'
import { BaseMessage, SessionedRequest } from './baseMessage'

export interface CarData {
  // Whether the brake pedal is pressed (100) or not (0).
  brake: number
  /**
   * ISO date string
   *
   * @example '2025-08-03T14:41:45+00:00'
   */
  date: string
  driver_number: number
  // Number as represented by DRS_STATUS in src/constants.ts
  // TODO: Represent this not like a stupid person
  drs: number
  meeting_key: number | string
  // Gears, 1 through 8. 0 indicates neutral or no gear engaged.
  n_gear: number
  rpm: number
  session_key: number | string
  // Velocity in km/h.
  speed: number
  // Percentage of maximum engine power being used.
  throttle: number
}

export interface CarDataRequest extends Partial<Omit<CarData, MeetingSessionKey>>, SessionedRequest {}

export interface CarDataMessage extends CarData, BaseMessage {}
