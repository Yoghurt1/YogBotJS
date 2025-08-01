import { connect, IClientOptions, MqttClient } from 'mqtt'
import { MQTT_PORT, MQTT_URL } from '../../config'
import { RestClient } from './restClient'
import { inject, injectable } from 'inversify'
import { TokenResponse } from '../../interfaces/tokenResponse'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { exit } from 'process'
import { DiscordClient } from './discordClient'
import { BaseMessage } from '../../interfaces/baseMessage'

@injectable()
export class F1MqttClient {
  private client: MqttClient

  private readonly TOPICS: string[] = [
    'v1/race_control',
    'v1/sessions'
  ]

  constructor(
    @inject(TYPES.DiscordClient) private discordClient: DiscordClient,
    @inject(TYPES.RestClient) private restClient: RestClient,
    @inject(TYPES.Logger) private logger: Logger
  ) {
    this.logger.info('Initializing MQTT client...')
    this.restClient.authenticate().then(async (tokenResponse) => {
      const options: IClientOptions = {
        password: tokenResponse.access_token,
        port: MQTT_PORT
      }

      this.client = connect(MQTT_URL, options)

      this.client.on('connect', () => {
        this.logger.info('Connected to MQTT broker.')
      })

      this.client.on('message', (topic: string, message: Buffer) => {
        const parsedMessage: BaseMessage = JSON.parse(message.toString())
        this.logger.info(`Received message on topic ${topic}:`)
        this.logger.info(parsedMessage)
        this.discordClient.sendMessage(parsedMessage)
      })
    })

    // Refreshing 100 seconds before token expiry
    setInterval(() => this.refreshClient(), 3500000)
  }

  public async start(): Promise<void> {
    while (!this.client || !this.client.connected) {
      this.logger.info('Waiting for MQTT client to connect...')
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    for (const topic of this.TOPICS) {
      this.client.subscribe(topic, this.subscribeHandler.bind(this, topic))
    }
  }

  private subscribeHandler(topic: string, err?: Error): void {
    if (err) {
      this.logger.error(`Failed to subscribe to topic ${topic}: `)
      this.logger.error(err)
    } else {
      this.logger.info(`Subscribed to topic ${topic}`)
    }
  }

  private async refreshClient(retries = 0) {
    this.logger.info('Refreshing MQTT client...')
    let tokenResponse: TokenResponse

    try {
      this.logger.info('Authenticating /token...')
      tokenResponse = await this.restClient.authenticate()
    } catch (error) {
      this.logger.error('Failed to authenticate: ')
      this.logger.error(error)
      retries += 1

      if (retries <= 3) {
        this.logger.error(`Retrying... (${retries}/3)`)
        this.refreshClient(retries)
      }

      this.logger.fatal('Max retries reached. Exiting.')
      exit(1)
    }

    this.logger.info('Authenticated successfully.')

    const options: IClientOptions = {
      password: tokenResponse.access_token,
      port: 8883
    }

    try {
      this.logger.info('Reconnecting to MQTT broker...')
      this.client = connect(MQTT_URL, options)
      this.client.on('connect', async () => {
        this.logger.info('Reconnected.')
        await this.start()
      })
    } catch (error) {
      this.logger.fatal('Failed to reconnect to MQTT broker:')
      this.logger.fatal(error)
      this.logger.fatal('Exiting.')
      exit(1)
    }
  }
}
