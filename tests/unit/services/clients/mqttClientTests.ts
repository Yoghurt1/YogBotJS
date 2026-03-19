import 'mocha'
import * as sinon from 'sinon'
import { assert } from 'chai'
import { mock, instance, when, verify } from 'ts-mockito'
import proxyquire from 'proxyquire'
import { Logger } from 'pino'
import { MessageService } from '../../../../src/services/message/messageService'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { MqttClient } from 'mqtt'
import { generateTokenResponse } from '../../../fixtures/openf1Fixtures'
import { OpenF1Service } from '../../../../src/services/openf1/openF1Service'
import { MQTT_URL } from '../../../../src/config'
import { Topic } from '../../../../src/enums'

describe('F1MqttClient', () => {
  const mqttClient: sinon.SinonStubbedInstance<MqttClient> = sinon.createStubInstance(MqttClient)
  mqttClient.connected = true

  const connectStub = sinon.stub().returns(mqttClient)

  const { F1MqttClient } = proxyquire('../../../../src/services/clients/mqttClient', {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '../../util': {
      sleep: sinon.stub().resolves()
    },
    'mqtt': {
      connect: connectStub
    }
  })

  let client: typeof F1MqttClient

  let openF1Service: OpenF1Service
  let logger: Logger
  let messageService: MessageService

  beforeEach(() => {
    openF1Service = mock(OpenF1Service)
    logger = getLogger()
    messageService = mock(MessageService)

    when(openF1Service.authenticate()).thenResolve(generateTokenResponse())

    client = new F1MqttClient(
      instance(openF1Service),
      logger,
      instance(messageService)
    )
  })

  describe('start', () => {
    it('should authenticate with OpenF1, connect to MQTT client, set listeners and subscribe to topics', async () => {
      await client.start()

      verify(openF1Service.authenticate()).once()
      assert.isTrue(connectStub.calledOnceWith(MQTT_URL, sinon.match.object))
      // connect, message and error listeners
      assert.isTrue(mqttClient.on.callCount === 3)
      // Subscribing to all topics in the enum
      assert.isTrue(mqttClient.subscribe.callCount === Object.values(Topic).length)
    })
  })
})
