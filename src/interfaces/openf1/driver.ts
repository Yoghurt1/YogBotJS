import { MeetingSessionKey } from '../../constants'
import { BaseMessage, SessionedRequest } from './baseMessage'

export interface Driver {
  /**
   * Driver's name as displayed on TV (kinda), all caps
   *
   * @example "M VERSTAPPEN"
   */
  broadcast_name: string
  driver_number: number
  /**
   * @example "Max"
   */
  first_name: string
  /**
   * Driver's full name, surname capitalised
   *
   * @example "Max VERSTAPPEN"
   */
  full_name: string
  /**
   * URL to a headshot of the driver.
   *
   * @example "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png.transform/1col/image.png"
   */
  headshot_url: string
  /**
   * @example "Verstappen"
   */
  last_name: string
  // Allowing strings to request "latest" meeting.
  meeting_key: number | string
  /**
   * Three-letter abbreviation of the driver's name.
   */
  name_acronym: string
  // Allowing strings to request "latest" session.
  session_key: number | string
  /**
   * Hex code of the team's colour.
   *
   * @example "3671C6"
   */
  team_colour: string
  /**
   * @example "Red Bull Racing"
   */
  team_name: string
}

export interface DriverRequest extends Partial<Omit<Driver, MeetingSessionKey>>, SessionedRequest {}

export interface DriverMessage extends Driver, BaseMessage {}
