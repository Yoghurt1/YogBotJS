import { Container } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from './types'
import { logger } from './logger'
import { DiscordClient } from './services/clients/discordClient'
import { F1MqttClient } from './services/clients/mqttClient'
import { RestClient } from './services/clients/restClient'
import { MessageEnricher } from './services/message/messageEnricher'
import { MessageMapper } from './services/message/messageMapper'
import { SNSClient } from '@aws-sdk/client-sns'
import { AWS_REGION } from './config'
import { SnsService } from './services/aws/snsService'
import { MessageService } from './services/message/messageService'
import { MessageHandler } from './services/message/messageHandler'
import { OpenF1Service } from './services/openf1/openF1Service'

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
iocContainer.bind<MessageService>(TYPES.MessageService).to(MessageService).inSingletonScope()
iocContainer.bind<MessageHandler>(TYPES.MessageHandler).to(MessageHandler).inSingletonScope()
iocContainer.bind<SnsService>(TYPES.SnsService).to(SnsService).inSingletonScope()
iocContainer.bind<OpenF1Service>(TYPES.OpenF1Service).to(OpenF1Service).inSingletonScope()

export default iocContainer
