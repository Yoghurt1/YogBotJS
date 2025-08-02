import { Container } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from './types'
import { logger } from './logger'
import { DiscordClient } from './services/clients/discordClient'
import { F1MqttClient } from './services/clients/mqttClient'
import { RestClient } from './services/clients/restClient'
import { MessageEnricher } from './services/messageEnricher'
import { MessageMapper } from './services/messageMapper'

const iocContainer = new Container()

// Constants
iocContainer.bind<Logger>(TYPES.Logger).toConstantValue(logger)

// Clients
iocContainer.bind<DiscordClient>(TYPES.DiscordClient).to(DiscordClient).inSingletonScope()
iocContainer.bind<F1MqttClient>(TYPES.F1MqttClient).to(F1MqttClient).inSingletonScope()
iocContainer.bind<RestClient>(TYPES.RestClient).to(RestClient).inSingletonScope()

// Services
iocContainer.bind<MessageEnricher>(TYPES.MessageEnricher).to(MessageEnricher).inSingletonScope()
iocContainer.bind<MessageMapper>(TYPES.MessageMapper).to(MessageMapper).inSingletonScope()

export default iocContainer
