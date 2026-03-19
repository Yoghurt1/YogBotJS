import 'mocha'
import { MessageHandler } from '../../../../src/services/message/messageHandler'
import { MessageService } from '../../../../src/services/message/messageService'
import { Logger } from 'pino'
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { RaceControlMessage } from '../../../../src/interfaces/openf1/raceControl'
import { generateRaceControlMessage } from '../../../fixtures/messageFixtures'
import { Topic } from '../../../../src/enums'
import { MeetingMessage } from '../../../../src/interfaces/openf1/meeting'
import { generateBaseMessage, generateMeeting } from '../../../fixtures/openf1Fixtures'

describe('MessageHandler', () => {
  let messageHandler: MessageHandler

  let messageService: MessageService
  let logger: Logger

  beforeEach(() => {
    messageService = mock(MessageService)
    logger = getLogger()

    messageHandler = new MessageHandler(
      instance(messageService),
      logger
    )
  })

  describe('handleMessage', () => {
    it(`should parse message and send it to Discord if it's a race control message`, async () => {
      const raceControlMessage: RaceControlMessage = generateRaceControlMessage()

      when(messageService.sendRaceControlMessage(raceControlMessage)).thenResolve()

      await messageHandler.handleMessage(Topic.RaceControl, Buffer.from(JSON.stringify(raceControlMessage)))

      verify(messageService.sendRaceControlMessage(deepEqual(raceControlMessage))).once()
    })

    it('should log and ignore if the message is not a race control message', async () => {
      const otherMessage: MeetingMessage = { ...generateMeeting(), ...generateBaseMessage()}

      await messageHandler.handleMessage(Topic.Meetings, Buffer.from(JSON.stringify(otherMessage)))

      verify(messageService.sendRaceControlMessage(anything())).never()
    })
  })
})
