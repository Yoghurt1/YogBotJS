import { Logger } from 'pino'
import iocContainer from './ioc'
import { F1MqttClient } from './services/clients/mqttClient'
import { TYPES } from './types'
import { exit } from 'process'
import { DiscordClient } from './services/clients/discordClient'

async function main() {
  const mqttClient: F1MqttClient = iocContainer.get(TYPES.F1MqttClient)
  await mqttClient.start()

  const discordClient: DiscordClient = iocContainer.get(TYPES.DiscordClient)
  await discordClient.start()
}

const logger: Logger = iocContainer.get(TYPES.Logger)
main().catch((err) => {
  logger.fatal('Unexpected error:')
  logger.fatal(err)
  logger.fatal('Exiting')
  exit(1)
})
