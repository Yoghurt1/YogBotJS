import { BaseMessage } from './baseMessage'

export interface Meeting {
  circuit_key: number
  circuit_short_name: string
  country_code: string
  country_key: number
  country_name: string
  /**
   * ISO date string
   *
   * @example '2025-08-03T14:41:45+00:00'
   */
  date_start: string
  gmt_offset: string
  location: string
  meeting_key: number
  /** e.g. Singapore Grand Prix */
  meeting_name: string
  /** e.g. FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2023 */
  /** Same as country_code; maybe undocumented? */
  meeting_code?: string
  meeting_official_name: string
  year: number
}

export interface MeetingRequest extends Partial<Meeting> {}

export interface MeetingMessage extends Meeting, BaseMessage {}
