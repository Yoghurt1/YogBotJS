import { Channel, Client, GatewayIntentBits } from 'discord.js'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { Logger } from 'pino'
import { CHANNEL_ID, DISCORD_TOKEN } from '../../config'
import { exit } from 'process'
import { BaseMessage } from '../../interfaces/baseMessage'

@injectable()
export class DiscordClient {
  private client: Client

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
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
      this.logger.fatal('Login failed: ', error)
      this.logger.fatal('Exiting.')
      exit(1)
    }
  }

  public sendMessage(message: BaseMessage): void {
    if (!this.client.isReady()) {
      this.logger.error('Discord client is not ready. Cannot send message: ', message)
      return
    }

    const channel: Channel = this.client.channels.cache.get(CHANNEL_ID)
    channel.isSendable() ? channel.send(JSON.stringify(message)) : this.logger.error('Channel is not sendable. Cannot send message: ', message)
  }
}
