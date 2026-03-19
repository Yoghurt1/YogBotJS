import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { MessageService } from './messageService'
import { Topic } from '../../enums'
import { Logger } from 'pino'
import { BaseMessage } from '../../interfaces/openf1/baseMessage'
import { isRaceControlMessage } from '../../util'

@injectable()
export class MessageHandler {
  constructor(
    @inject(TYPES.MessageService) private messageService: MessageService,
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  public async handleMessage(topic: Topic, message: Buffer) {
    const parsedMessage: BaseMessage = JSON.parse(message.toString())

    this.logger.info(`Received message on topic ${topic}.`)
    this.logger.debug(parsedMessage)

    if (isRaceControlMessage(parsedMessage, topic)) {
      await this.messageService.sendRaceControlMessage(parsedMessage)
    } else {
      this.logger.info('Ignoring message.')
    }
  }
}
