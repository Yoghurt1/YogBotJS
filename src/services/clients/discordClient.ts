import { Channel, Client, GatewayIntentBits } from 'discord.js'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { Logger } from 'pino'
import { CHANNEL_ID, DELAY, DISCORD_TOKEN } from '../../config'
import { exit } from 'process'
import { BaseMessage } from '../../interfaces/baseMessage'
import { MessageMapper } from '../messageMapper'
import { Topic } from '../../enums'
import { sleep } from '../../util'

@injectable()
export class DiscordClient {
  private client: Client

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.MessageMapper) private messageMapper: MessageMapper
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })
  }

  public async start(): Promise<void> {
    try {
      this.logger.info('Starting discord client...')
      await this.client.login(DISCORD_TOKEN)

      this.client.once('ready', () => {
        this.logger.info(`Logged in as ${this.client.user.tag}.`)
      })
    } catch (error) {
      this.logger.fatal(error, 'Login failed.')
      this.logger.fatal('Exiting.')
      exit(1)
    }
  }

  public async sendMessage(message: BaseMessage, topic: Topic): Promise<void> {
    if (topic !== Topic.RaceControl) {
      this.logger.warn(`Ignoring message on topic ${topic}.`)
      return
    }

    if (!this.client.isReady()) {
      this.logger.error(message, 'Discord client is not ready. Cannot send message.')
      return
    }

    const formattedMessage = await this.messageMapper.mapRaceControlMessage(message, topic)
    const channel: Channel = this.client.channels.cache.get(CHANNEL_ID)
    if (channel.isSendable()) {
      await sleep(DELAY)

      this.logger.info('Sending message.')

      await channel.send({ embeds: [formattedMessage] })
    } else {
      this.logger.error(message, 'Channel is not sendable. Cannot send message.')
    }
  }
}
