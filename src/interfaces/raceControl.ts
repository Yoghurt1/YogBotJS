import { RaceControlCategory, Scope, Flag } from '../enums'
import { BaseMessage } from './baseMessage'

export interface RestRaceControl {
  category: RaceControlCategory,
  date: Date,
  /** Driver number as printed on the car. */
  driver_number?: number,
  flag?: Flag,
  lap_number?: number,
  meeting_key: number,
  message: string,
  scope?: Scope,
  sector: number,
  session_key: number
}

export interface MqttRaceControl extends BaseMessage {}
