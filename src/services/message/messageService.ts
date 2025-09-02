import { injectable, inject } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { DiscordClient } from '../clients/discordClient'
import { MessageEnricher } from './messageEnricher'
import { MessageMapper } from './messageMapper'
import { BaseMessage } from '../../interfaces/openf1/baseMessage'
import { Flag, Topic } from '../../enums'
import { isRaceControlMessage } from '../../util'
import { EnrichedRaceControlMessage } from '../../interfaces/openf1/raceControl'
import { EmbedBuilder } from 'discord.js'
import { DateTime } from 'luxon'

@injectable()
export class MessageService {
  public constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.MessageEnricher) private messageEnricher: MessageEnricher,
    @inject(TYPES.MessageMapper) private messageMapper: MessageMapper,
    @inject(TYPES.DiscordClient) private discordClient: DiscordClient
  ) {}

  public async sendMessage(message: BaseMessage, topic: Topic): Promise<void> {
    if (!this.discordClient.isReady()) {
      this.logger.error(message, 'Discord client is not ready. Cannot send message.')
      return
    }

    if (isRaceControlMessage(message, topic)) {
      this.logger.info('Enriching message...')
      const enrichedMessage: EnrichedRaceControlMessage = await this.messageEnricher.enrichRaceControlMessage(message)

      if (this.isFlagMessageAfterSessionEnd(enrichedMessage)) {
        this.logger.warn(enrichedMessage, 'Ignoring flag message as it was sent after the session ended.')
        return
      }

      const mappedMessage: EmbedBuilder = this.messageMapper.mapRaceControlMessage(enrichedMessage)

      await this.discordClient.sendMessage(mappedMessage)
    } else {
      this.logger.warn(`Ignoring message on topic ${topic}.`)
    }
  }

  private isFlagMessageAfterSessionEnd(message: EnrichedRaceControlMessage): boolean {
    return DateTime.fromISO(message.session.date_end).toUTC() < DateTime.now().toUTC()
      && [Flag.YELLOW, Flag.DOUBLE_YELLOW, Flag.CLEAR, Flag.GREEN].includes(message.flag)
  }
}
