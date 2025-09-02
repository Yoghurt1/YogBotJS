import { Topic } from './enums'
import { BaseMessage } from './interfaces/openf1/baseMessage'
import { RaceControlMessage } from './interfaces/openf1/raceControl'

export async function sleep(ms = 1000): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms))
}

export function isRaceControlMessage(message: BaseMessage, topic: Topic): message is RaceControlMessage {
  return topic === Topic.RaceControl
}
