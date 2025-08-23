import { Logger } from 'pino'
import iocContainer from './ioc'
import { F1MqttClient } from './services/clients/mqttClient'
import { TYPES } from './types'
import { exit } from 'process'
import { DiscordClient } from './services/clients/discordClient'
import { SnsService } from './services/snsService'

const logger: Logger = iocContainer.get(TYPES.Logger)
const sns: SnsService = iocContainer.get(TYPES.SnsService)

async function main() {
  const mqttClient: F1MqttClient = iocContainer.get(TYPES.F1MqttClient)
  await mqttClient.start()

  const discordClient: DiscordClient = iocContainer.get(TYPES.DiscordClient)
  await discordClient.start()
}

async function errHandler(err: Error) {
  logger.fatal(err, 'Fatal error. Notifying and exiting...')

  await sns.publishError(err)

  exit(1)
}

process.on('uncaughtException', errHandler)
process.on('unhandledRejection', errHandler)

main().catch(errHandler)
