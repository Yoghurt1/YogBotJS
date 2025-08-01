import { Container } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from './types'
import { logger } from './logger'
import { DiscordClient } from './services/clients/discordClient'
import { F1MqttClient } from './services/clients/mqttClient'
import { RestClient } from './services/clients/restClient'

const iocContainer = new Container()

iocContainer.bind<Logger>(TYPES.Logger).toConstantValue(logger)

iocContainer.bind<DiscordClient>(TYPES.DiscordClient).to(DiscordClient).inSingletonScope()
iocContainer.bind<F1MqttClient>(TYPES.F1MqttClient).to(F1MqttClient).inSingletonScope()
iocContainer.bind<RestClient>(TYPES.RestClient).to(RestClient).inSingletonScope()

export default iocContainer
