import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { MessageService } from './messageService'
import { Flag, Topic } from '../../enums'
import { Logger } from 'pino'
import { BaseMessage } from '../../interfaces/openf1/baseMessage'
import { isRaceControlMessage } from '../../util'
import { Dictionary } from '../../interfaces/util'
import { RaceControlMessage } from '../../interfaces/openf1/raceControl'

@injectable()
export class MessageHandler {
  private blueFlagRecord: Dictionary<number[]> = {}
  private lastRaceControlMessage: RaceControlMessage

  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  public async handleMessage(topic: Topic, message: Buffer) {
    const parsedMessage: BaseMessage = JSON.parse(message.toString())

    this.logger.info(`Received message on topic ${topic}.`)
    this.logger.debug(parsedMessage)

    if (isRaceControlMessage(parsedMessage, topic)) {
      if (this.isDuplicateMessage(parsedMessage)) {
        this.logger.debug('Ignoring duplicate message.')
        return
      }

      if (this.isDuplicateBlueFlag(parsedMessage)) {
        this.logger.debug(`Ignoring duplicate blue flag message for driver ${parsedMessage.driver_number} in session ${parsedMessage.session_key}.`)
        return
      }

      await this.messageService.sendRaceControlMessage(parsedMessage)
    } else {
      this.logger.info('Ignoring message.')
    }
  }

  private isDuplicateBlueFlag(message: RaceControlMessage) {
    if (message.flag === Flag.BLUE) {
      const sessionKey: number = message.session_key
      const driverNumber: number = message.driver_number
      const blueFlags: number[] = this.blueFlagRecord[sessionKey]

      if (blueFlags?.length > 0 && blueFlags.includes(driverNumber)) {
        return true
      } else {
        if (!this.blueFlagRecord[sessionKey]) {
          this.blueFlagRecord[sessionKey] = []
        }

        this.blueFlagRecord[sessionKey].push(driverNumber)
      }
    }

    return false
  }

  private isDuplicateMessage(message: RaceControlMessage): boolean {
    if (!this.lastRaceControlMessage) {
      this.lastRaceControlMessage = message
      return false
    } else {
      /* Attempting to filter out any immediate duplicates by comparing all properties
       * except _id, which can sometimes change even if the message doesn't
       */
      const equal: boolean = Object.keys(message)
        .filter(key => key !== '_id')
        .every(key => message[key] === this.lastRaceControlMessage[key])

      this.lastRaceControlMessage = message
      return equal
    }
  }
}
