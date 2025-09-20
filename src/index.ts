import { Logger } from 'pino'
import iocContainer from './ioc'
import { F1MqttClient } from './services/clients/mqttClient'
import { TYPES } from './types'
import { DiscordClient } from './services/clients/discordClient'
import { SnsService } from './services/aws/snsService'
import { ENABLE_SNS_ERRORS } from './config'

const logger: Logger = iocContainer.get(TYPES.Logger)
const sns: SnsService = iocContainer.get(TYPES.SnsService)

async function main() {
  const mqttClient: F1MqttClient = iocContainer.get(TYPES.F1MqttClient)
  await mqttClient.start()

  const discordClient: DiscordClient = iocContainer.get(TYPES.DiscordClient)
  await discordClient.start()
}

async function errHandler(err: Error) {
  logger.error(err, 'Uncaught exception or unhandled rejection.')

  if (ENABLE_SNS_ERRORS) {
    await sns.publishError(err)
  }
}

process.on('uncaughtException', errHandler)
process.on('unhandledRejection', errHandler)

main().catch(errHandler)
