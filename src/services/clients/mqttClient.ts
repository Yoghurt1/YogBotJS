import { connect, ErrorWithReasonCode, IClientOptions, MqttClient } from 'mqtt'
import { MQTT_PORT, MQTT_URL, OPENF1_USERNAME } from '../../config'
import { inject, injectable } from 'inversify'
import { TokenResponse } from '../../interfaces/openf1/tokenResponse'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { Topic } from '../../enums'
import { sleep } from '../../util'
import { MessageHandler } from '../message/messageHandler'
import { OpenF1Service } from '../openf1/openF1Service'

@injectable()
export class F1MqttClient {
  private client: MqttClient
  private password = ''
  private MQTT_OPTIONS: IClientOptions = {
    username: OPENF1_USERNAME,
    port: MQTT_PORT,
    reconnectPeriod: 1000,
    transformWsUrl: this.transformWsUrl.bind(this)
  }

  constructor(
    @inject(TYPES.OpenF1Service) private openF1Service: OpenF1Service,
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.MessageHandler) private messageHandler: MessageHandler
  ) { }

  public async start(): Promise<void> {
    this.logger.info('Initializing MQTT client...')
    const tokenResponse: TokenResponse = await this.openF1Service.authenticate()

    const options: IClientOptions = {
      ...this.MQTT_OPTIONS,
      password: tokenResponse.access_token
    }

    this.client = connect(MQTT_URL, options)

    this.setListeners()

    while (!this.client || !this.client.connected) {
      this.logger.info('Waiting for MQTT client to connect...')
      await sleep()
    }

    // Refreshing 100 seconds before token expiry, 3500000 ms
    setInterval(() => this.refreshClient(), 3500000)

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

  private transformWsUrl(url: string, options: IClientOptions, client: MqttClient): string {
    client.options.password = this.password

    return url
  }

  private async refreshClient(delay = 1) {
    this.logger.info('Refreshing MQTT client token...')
    let tokenResponse: TokenResponse

    try {
      tokenResponse = await this.openF1Service.authenticate()

      if (!tokenResponse.access_token) {
        this.logger.error('No access token in response. Cannot refresh MQTT client.')
        throw new Error('No access token in response')
      }

      this.password = tokenResponse.access_token
    } catch (error) {
      this.logger.error(error, 'Failed to get new token.')

      delay = delay ** 2
      this.logger.error(`Retrying after ${delay}s...`)

      await sleep(delay * 1000)
      await this.refreshClient(delay)
    }

    this.logger.info('Authenticated successfully.')
  }

  private setListeners(): void {
    this.client.on('connect', () => {
      this.logger.info('Connected to MQTT broker.')
    })

    this.client.on('message', async (topic: Topic, payload: Buffer) => {
      await this.messageHandler.handleMessage(topic, payload)
    })

    this.client.on('error', (error: Error | ErrorWithReasonCode) => {
      this.logger.error(`MQTT client error - ${error.message}`)
      this.logger.debug(error)
    })
  }
}
