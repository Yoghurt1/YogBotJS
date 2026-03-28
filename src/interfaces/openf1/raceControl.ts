import { RaceControlCategory, Scope, Flag } from '../../enums'
import { Sessioned, SessionedMessage } from './baseMessage'
import { EnrichedMessage } from './enrichedMessage'

export interface RaceControl extends Sessioned {
  category: RaceControlCategory
  /**
   * ISO date string
   *
   * @example '2025-08-03T14:41:45+00:00'
   */
  date: string
  /** Driver number as printed on the car. */
  driver_number?: number
  flag?: Flag
  lap_number?: number
  meeting_key: number
  message: string
  scope?: Scope
  sector?: number
  session_key: number
}

export interface RaceControlMessage extends RaceControl, SessionedMessage {}

export interface EnrichedRaceControlMessage extends RaceControlMessage, EnrichedMessage {}
