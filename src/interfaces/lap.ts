import { Segment } from '../enums'
import { BaseMessage } from './baseMessage'

export interface Laps {
  /** 
   * ISO date string 
   * @example '2025-08-03T14:41:45+00:00'
   */
  date_start: string,
  /** Driver number as printed on the car. */
  driver_number: number,
  /** Floating point number */
  duration_sector_1: number,
  /** Floating point number */
  duration_sector_2: number,
  /** Floating point number */
  duration_sector_3: number,
  /** 
   * The speed of the car, in km/h, at the first intermediate point on the track.
   * Whole number. 
   */
  i1_speed: number,
  /** 
   * The speed of the car, in km/h, at the second intermediate point on the track.
   * Whole number. 
   */
  i2_speed: number,
  is_pit_out_lap: boolean,
  /** Floating point number */
  lap_duration: number,
  lap_number: number,
  meeting_key: number,
  segments_sector_1: Segment[],
  segments_sector_2: Segment[],
  segments_sector_3: Segment[],
  session_key: number,
  /**
   * The speed of the car, in km/h, at the speed trap, 
   * which is a specific point on the track where the highest speeds are usually recorded.
   * Whole number.
   */
  st_speed: number
}

export interface MqttLaps extends Laps, BaseMessage {}
