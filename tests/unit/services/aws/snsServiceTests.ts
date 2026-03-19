import 'mocha'
import { assert } from 'chai'
import { capture, mock, when, instance, verify, anyOfClass } from 'ts-mockito'
import { SnsService } from '../../../../src/services/aws/snsService'
import { Logger } from 'pino'
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns'
import { MessageMapper } from '../../../../src/services/message/messageMapper'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { APIEmbed } from 'discord.js'

describe('SnsService', () => {
  let snsService: SnsService

  let logger: Logger
  let snsClient: SNSClient
  let messageMapper: MessageMapper

  const ERROR = new Error('Test error')
  const MAPPED_ERROR: APIEmbed = { title: 'Test error' }

  beforeEach(() => {
    logger = getLogger()
    snsClient = mock(SNSClient)
    messageMapper = mock(MessageMapper)

    snsService = new SnsService(logger, instance(snsClient), instance(messageMapper))
  })

  describe('publishError', () => {
    it('should construct a PublishCommand and execute', async () => {
      when(messageMapper.mapErrorMessage(ERROR)).thenReturn(MAPPED_ERROR)

      await snsService.publishError(ERROR)

      verify(snsClient.send(anyOfClass(PublishCommand))).once()

      const [command]: [PublishCommand] = capture<PublishCommand>(snsClient.send).last()

      assert.equal(command.input.Message, JSON.stringify(MAPPED_ERROR))
      assert.isDefined(command.input.TopicArn)
    })
  })
})
