/* eslint-disable @typescript-eslint/naming-convention */
import 'mocha'
import { MessageHandler } from '../../../../src/services/message/messageHandler'
import { MessageService } from '../../../../src/services/message/messageService'
import { Logger } from 'pino'
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { RaceControlMessage } from '../../../../src/interfaces/openf1/raceControl'
import { generateRaceControlMessage } from '../../../fixtures/messageFixtures'
import { Flag, Topic } from '../../../../src/enums'
import { MeetingMessage } from '../../../../src/interfaces/openf1/meeting'
import { generateBaseMessage, generateMeeting } from '../../../fixtures/openf1Fixtures'
import { assert } from 'chai'
import { Dictionary } from '../../../../src/interfaces/util'

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
    describe('RaceControl messages', () => {
      let raceControlMessage: RaceControlMessage

      beforeEach(() => {
        raceControlMessage = generateRaceControlMessage()
      })

      it(`should ignore message if it's a duplicate of the last message`, async () => {
        Reflect.set(messageHandler, 'lastRaceControlMessage', raceControlMessage)

        await messageHandler.handleMessage(Topic.RaceControl, Buffer.from(JSON.stringify(raceControlMessage)))

        verify(messageService.sendRaceControlMessage(anything())).never()
      })

      it(`should ignore message if it's a duplicate of the last message with a different _id`, async () => {
        Reflect.set(messageHandler, 'lastRaceControlMessage', raceControlMessage)
        // For some reason eslint doesn't acknowledge the existence of
        // config for this, so doing it inline
        // eslint-disable-next-line no-underscore-dangle
        raceControlMessage._id = 1

        await messageHandler.handleMessage(Topic.RaceControl, Buffer.from(JSON.stringify(raceControlMessage)))

        verify(messageService.sendRaceControlMessage(anything())).never()
      })

      it('should add driver to blue flag record if message is a blue flag and driver not blue flagged before - new session', async () => {
        raceControlMessage.session_key = 1
        raceControlMessage.driver_number = 11
        raceControlMessage.flag = Flag.BLUE

        await messageHandler.handleMessage(Topic.RaceControl, Buffer.from(JSON.stringify(raceControlMessage)))

        verify(messageService.sendRaceControlMessage(deepEqual(raceControlMessage))).called()

        const blueFlagRecord: Dictionary<number[]> = Reflect.get(messageHandler, 'blueFlagRecord')
        assert.lengthOf(blueFlagRecord[1], 1)
        assert.include(blueFlagRecord[1], 11)
      })

      it('should add driver to blue flag record if message is a blue flag and driver not blue flagged before - ongoing session', async () => {
        Reflect.set(messageHandler, 'blueFlagRecord', { 1: [99] })

        raceControlMessage.session_key = 1
        raceControlMessage.driver_number = 11
        raceControlMessage.flag = Flag.BLUE

        await messageHandler.handleMessage(Topic.RaceControl, Buffer.from(JSON.stringify(raceControlMessage)))

        verify(messageService.sendRaceControlMessage(deepEqual(raceControlMessage))).called()

        const blueFlagRecord: Dictionary<number[]> = Reflect.get(messageHandler, 'blueFlagRecord')
        assert.lengthOf(blueFlagRecord[1], 2)
        assert.include(blueFlagRecord[1], 11)
      })

      it('should ignore message if it is a blue flag for a driver that has already received a blue flag in the same session', async () => {
        Reflect.set(messageHandler, 'blueFlagRecord', { 1: [11] })

        raceControlMessage.session_key = 1
        raceControlMessage.driver_number = 11
        raceControlMessage.flag = Flag.BLUE

        await messageHandler.handleMessage(Topic.RaceControl, Buffer.from(JSON.stringify(raceControlMessage)))

        verify(messageService.sendRaceControlMessage(anything())).never()
      })

      it(`should parse message and send it to Discord if it's a valid race control message`, async () => {
        when(messageService.sendRaceControlMessage(raceControlMessage)).thenResolve()

        await messageHandler.handleMessage(Topic.RaceControl, Buffer.from(JSON.stringify(raceControlMessage)))

        verify(messageService.sendRaceControlMessage(deepEqual(raceControlMessage))).once()
      })
    })

    it('should log and ignore if the message is not a race control message', async () => {
      const otherMessage: MeetingMessage = { ...generateMeeting(), ...generateBaseMessage()}

      await messageHandler.handleMessage(Topic.Meetings, Buffer.from(JSON.stringify(otherMessage)))

      verify(messageService.sendRaceControlMessage(anything())).never()
    })
  })
})
