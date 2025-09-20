import { faker } from '@faker-js/faker'
import { Flag, RaceControlCategory, Scope } from '../../src/enums'
import { Meeting } from '../../src/interfaces/openf1/meeting'
import { RaceControl } from '../../src/interfaces/openf1/raceControl'
import { Session } from '../../src/interfaces/openf1/session'
import { TokenResponse } from '../../src/interfaces/openf1/tokenResponse'
import { BaseMessage } from '../../src/interfaces/openf1/baseMessage'

export function generateSession(): Session {
  return {
    meeting_key: 1268,
    session_key: 9912,
    location: 'Monza',
    date_start: '2025-09-07T13:00:00+00:00',
    date_end: '2025-09-07T15:00:00+00:00',
    session_type: 'Race',
    session_name: 'Race',
    country_key: 13,
    country_code: 'ITA',
    country_name: 'Italy',
    circuit_key: 39,
    circuit_short_name: 'Monza',
    gmt_offset: '02:00:00',
    year: 2025
  }
}

export function generateMeeting(): Meeting {
  return {
    meeting_key: 1268,
    circuit_key: 39,
    circuit_short_name: 'Monza',
    meeting_code: 'ITA',
    location: 'Monza',
    country_key: 13,
    country_code: 'ITA',
    country_name: 'Italy',
    meeting_name: 'Italian Grand Prix',
    meeting_official_name: 'FORMULA 1 PIRELLI GRAN PREMIO D’ITALIA 2025',
    gmt_offset: '02:00:00',
    date_start: '2025-09-05T11:30:00+00:00',
    year: 2025
  }
}

export function generateRaceControl(flag?: Flag, message?: string): RaceControl {
  return {
    meeting_key: 1268,
    session_key: 9912,
    date: '2025-09-07T13:52:24+00:00',
    driver_number: 10,
    lap_number: 36,
    category: RaceControlCategory.FLAG,
    flag: flag || Flag.BLACK_AND_WHITE,
    scope: Scope.DRIVER,
    sector: 1,
    message: message ?? 'BLACK AND WHITE FLAG FOR CAR 10 (GAS) - TRACK LIMITS'
  }
}

export function generateTokenResponse(): TokenResponse {
  return {
    expires_in: '3600',
    access_token: faker.internet.jwt(),
    token_type: 'Bearer'
  }
}

export function generateBaseMessage(): BaseMessage {
  return {
    _id: faker.number.int({ min: 100000 }),
    _key: new Date().getMilliseconds().toString()
  }
}
