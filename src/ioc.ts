import { Container } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from './types'
import { logger } from './logger'
import { DiscordClient } from './services/clients/discordClient'
import { F1MqttClient } from './services/clients/mqttClient'
import { RestClient } from './services/clients/restClient'
import { MessageEnricher } from './services/messageEnricher'
import { MessageMapper } from './services/messageMapper'
import { SNSClient } from '@aws-sdk/client-sns'
import { AWS_REGION } from './config'
import { SnsService } from './services/snsService'

const iocContainer = new Container()

// Constants
iocContainer.bind<Logger>(TYPES.Logger).toConstantValue(logger)
iocContainer.bind<SNSClient>(TYPES.SNSClient).toConstantValue(new SNSClient({ region: AWS_REGION }))

// Clients
iocContainer.bind<DiscordClient>(TYPES.DiscordClient).to(DiscordClient).inSingletonScope()
iocContainer.bind<F1MqttClient>(TYPES.F1MqttClient).to(F1MqttClient).inSingletonScope()
iocContainer.bind<RestClient>(TYPES.RestClient).to(RestClient).inSingletonScope()

// Services
iocContainer.bind<MessageEnricher>(TYPES.MessageEnricher).to(MessageEnricher).inSingletonScope()
iocContainer.bind<MessageMapper>(TYPES.MessageMapper).to(MessageMapper).inSingletonScope()
iocContainer.bind<SnsService>(TYPES.SnsService).to(SnsService).inSingletonScope()

export default iocContainer
