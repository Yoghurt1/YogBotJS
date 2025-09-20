import { Flag, RaceControlCategory, Scope } from '../../src/enums'
import { EnrichedRaceControlMessage, RaceControl, RaceControlMessage } from '../../src/interfaces/openf1/raceControl'
import { generateMeeting, generateRaceControl, generateSession } from './openf1Fixtures'
import { DateTime } from 'luxon'

export function generateRaceControlMessage(flag?: Flag, message?: string): RaceControlMessage {
  const raceControl: RaceControl = generateRaceControl(flag, message)
  const raceControlTimestamp: number = DateTime.fromISO(raceControl.date).toMillis()

  return {
    ...raceControl,
    _key: generateRaceControlMessageKey(raceControl, raceControlTimestamp),
    _id: raceControlTimestamp
  }
}

export function generateEnrichedRaceControlMessage(flag?: Flag, message?: string): EnrichedRaceControlMessage {
  return {
    ...generateRaceControlMessage(flag, message),
    meeting: generateMeeting(),
    session: generateSession()
  }
}

function generateRaceControlMessageKey(raceControl: RaceControl, raceControlTimestamp: number): string {
  return `${raceControlTimestamp}_${raceControl.driver_number ?? 'None'}_${raceControl.lap_number ?? 'None'}_${RaceControlCategory[raceControl.category]}_${Flag[raceControl.flag ?? 'None']}_${Scope[raceControl.scope ?? 'None']}`
}
