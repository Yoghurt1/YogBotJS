import { BaseMessage } from './baseMessage'

/** TODO: Create enums for these fields
 * circuit_key
 * circuit_short_name
 * country_code
 * country_key
 * country_name
 * gmt_offset(?)
 * location
 * session_name(?)
 * session_type(?)
 */
export interface RestSessions {
  circuit_key: number,
  circuit_short_name: string,
  /** Three-character unique identifier */
  country_code: string,
  country_key: number,
  country_name: string,
  date_end: Date,
  date_start: Date,
  /** 
   * The difference in hours and minutes between local time at the location of the event and Greenwich Mean Time (GMT).
   * // TODO: Format here is HH:MM:SS - may be a better way to type this? */
  gmt_offset: string,
  location: string,
  meeting_key: number,
  session_key: number,
  session_name: string,
  session_type: string,
  year: number
}

export interface MqttSessions extends BaseMessage {}
