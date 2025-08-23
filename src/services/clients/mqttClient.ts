import { connect, IClientOptions, MqttClient } from 'mqtt'
import { MQTT_PORT, MQTT_URL, OPENF1_USERNAME } from '../../config'
import { RestClient } from './restClient'
import { inject, injectable } from 'inversify'
import { TokenResponse } from '../../interfaces/openf1/tokenResponse'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { exit } from 'process'
import { DiscordClient } from './discordClient'
import { BaseMessage } from '../../interfaces/openf1/baseMessage'
import { Topic } from '../../enums'
import { sleep } from '../../util'

@injectable()
export class F1MqttClient {
  private client: MqttClient
  private MQTT_OPTIONS: IClientOptions = {
    username: OPENF1_USERNAME,
    port: MQTT_PORT
  }

  constructor(
    @inject(TYPES.DiscordClient) private discordClient: DiscordClient,
    @inject(TYPES.RestClient) private restClient: RestClient,
    @inject(TYPES.Logger) private logger: Logger
  ) {
    this.logger.info('Initializing MQTT client...')
    void this.restClient.authenticate().then((tokenResponse: TokenResponse) => {
      this.MQTT_OPTIONS.password = tokenResponse.access_token

      this.client = connect(MQTT_URL, this.MQTT_OPTIONS)

      this.setListeners()
    })

    // Refreshing 100 seconds before token expiry, 3500000 ms
    setInterval(() => this.refreshClient(), 3500000)
  }

  public async start(): Promise<void> {
    while (!this.client || !this.client.connected) {
      this.logger.info('Waiting for MQTT client to connect...')
      await sleep()
    }

    for (const topic of Object.values(Topic)) {
      this.client.subscribe(topic, this.subscribeHandler.bind(this, topic))
    }
  }

  private subscribeHandler(topic: string, error?: Error): void {
    if (error) {
      this.logger.error(error, `Failed to subscribe to topic ${topic}.`)
    } else {
      this.logger.info(`Subscribed to topic ${topic}.`)
    }
  }

  private async refreshClient(retries = 0) {
    this.logger.info('Refreshing MQTT client...')
    let tokenResponse: TokenResponse

    try {
      tokenResponse = await this.restClient.authenticate()
    } catch (error) {
      this.logger.error(error, 'Failed to authenticate.')
      retries += 1

      if (retries <= 3) {
        this.logger.error(`Retrying... (${retries}/3)`)
        await this.refreshClient(retries)
      }

      this.logger.fatal('Max retries reached. Exiting.')
      exit(1)
    }

    this.logger.info('Authenticated successfully.')

    this.MQTT_OPTIONS.password = tokenResponse.access_token
    try {
      this.logger.info('Reconnecting to MQTT broker...')
      this.client.reconnect(this.MQTT_OPTIONS)
    } catch (error) {
      this.logger.fatal(error, 'Failed to reconnect to MQTT broker.')
      throw error
    }
  }

  private setListeners(): void {
    this.client.on('connect', () => {
      this.logger.info('Connected to MQTT broker.')
    })

    this.client.on('message', async (topic: Topic, message: Buffer) => {
      const parsedMessage: BaseMessage = JSON.parse(message.toString())
      this.logger.info(`Received message on topic ${topic}.`)
      this.logger.debug(parsedMessage)
      await this.discordClient.sendMessage(parsedMessage, topic)
    })

    this.client.on('error', (error: Error) => {
      this.logger.error(error, 'MQTT client error.')
    })
  }
}
