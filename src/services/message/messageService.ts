import { injectable, inject } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { DiscordClient } from '../clients/discordClient'
import { EnrichmentService } from '../enrichmentService'
import { RaceControlMessageMapper } from '../../mappers/raceControlMessageMapper'
import { EnrichedRaceControlMessage, RaceControlMessage } from '../../interfaces/openf1/raceControl'
import { EmbedBuilder } from 'discord.js'

@injectable()
export class MessageService {
  public constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.EnrichmentService) private enrichmentService: EnrichmentService,
    @inject(TYPES.RaceControlMessageMapper) private messageMapper: RaceControlMessageMapper,
    @inject(TYPES.DiscordClient) private discordClient: DiscordClient
  ) {}

  public async sendRaceControlMessage(message: RaceControlMessage): Promise<void> {
    if (!this.discordClient.isReady()) {
      this.logger.error(message, 'Discord client is not ready. Cannot send message.')
      return
    }

    this.logger.info('Enriching message...')
    const enrichedMessage: EnrichedRaceControlMessage = await this.enrichmentService.enrichRaceControlMessage(message)

    const mappedMessage: EmbedBuilder = this.messageMapper.mapRaceControlMessage(enrichedMessage)

    await this.discordClient.sendMessage(mappedMessage)
  }
}
