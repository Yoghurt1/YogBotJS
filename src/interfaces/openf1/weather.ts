import { MeetingSessionKey } from '../../constants'
import { SessionedRequest, BaseMessage } from './baseMessage'

export interface Weather {
  // Air temperature (°C).
  air_temperature: number
  date: string
  // Relative humidity (%).
  humidity: number
  meeting_key: number
  // Air pressure (mbar).
  pressure: number
  // Whether there is rainfall - assuming 0 is no, 1 is yes?
  rainfall: number
  session_key: number
  // Track temperature (°C).
  track_temperature: number
  // Wind direction (°), from 0° to 359°.
  wind_direction: number
  // Wind speed (m/s).
  wind_speed: number
}

export interface WeatherRequest extends Partial<Omit<Weather, MeetingSessionKey>>, SessionedRequest {}

export interface WeatherMessage extends Weather, BaseMessage {}
