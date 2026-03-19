import 'mocha'
import { assert } from 'chai'
import { MessageEnricher } from '../../../../src/services/message/messageEnricher'
import { Logger } from 'pino'
import { OpenF1Service } from '../../../../src/services/openf1/openF1Service'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import { generateMeeting, generateSession } from '../../../fixtures/openf1Fixtures'
import { Meeting } from '../../../../src/interfaces/openf1/meeting'
import { Session } from '../../../../src/interfaces/openf1/session'
import { EnrichedRaceControlMessage, RaceControlMessage } from '../../../../src/interfaces/openf1/raceControl'
import { generateRaceControlMessage } from '../../../fixtures/messageFixtures'

describe('MessageEnricher', () => {
  let messageEnricher: MessageEnricher

  let logger: Logger
  let openF1Service: OpenF1Service

  beforeEach(() => {
    logger = getLogger()
    openF1Service = mock(OpenF1Service)

    messageEnricher = new MessageEnricher(
      logger,
      instance(openF1Service)
    )
  })

  describe('enrichRaceControlMessage', () => {
    const sessions: Session[] = [generateSession()]
    const meetings: Meeting[] = [generateMeeting()]

    it('should add session and meeting data to the message - empty cache', async () => {
      when(openF1Service.getSessions(anything())).thenResolve(sessions)
      when(openF1Service.getMeetings(anything())).thenResolve(meetings)

      const enrichedMessage: EnrichedRaceControlMessage = await messageEnricher.enrichRaceControlMessage(generateRaceControlMessage())

      assert.deepEqual(enrichedMessage.session, sessions[0])
      assert.deepEqual(enrichedMessage.meeting, meetings[0])
      assert.includeDeepMembers(
        Reflect.get(messageEnricher, 'sessionData'),
        sessions
      )
      assert.includeDeepMembers(
        Reflect.get(messageEnricher, 'meetingData'),
        meetings
      )

      verify(openF1Service.getSessions(anything())).once()
      verify(openF1Service.getMeetings(anything())).once()
    })

    it('should add session and meeting data to the message - cache hit', async () => {
      Reflect.set(messageEnricher, 'sessionData', sessions)
      Reflect.set(messageEnricher, 'meetingData', meetings)

      const enrichedMessage: EnrichedRaceControlMessage = await messageEnricher.enrichRaceControlMessage(generateRaceControlMessage())

      assert.deepEqual(enrichedMessage.session, sessions[0])
      assert.deepEqual(enrichedMessage.meeting, meetings[0])

      verify(openF1Service.getSessions(anything())).never()
      verify(openF1Service.getMeetings(anything())).never()
    })

    it('should add session and meeting data to the message - cache but no hit', async () => {
      Reflect.set(messageEnricher, 'sessionData', sessions)
      Reflect.set(messageEnricher, 'meetingData', meetings)

      const newSessions: Session[] = [{ ...generateSession(), session_key: 1 }]
      const newMeetings: Meeting[] = [{ ...generateMeeting(), meeting_key: 1 }]

      when(openF1Service.getSessions(anything())).thenResolve(newSessions)
      when(openF1Service.getMeetings(anything())).thenResolve(newMeetings)

      const raceControlMessage: RaceControlMessage = { ...generateRaceControlMessage(), session_key: 1, meeting_key: 1 }

      const enrichedMessage: EnrichedRaceControlMessage = await messageEnricher.enrichRaceControlMessage(raceControlMessage)

      assert.deepEqual(enrichedMessage.session, newSessions[0])
      assert.deepEqual(enrichedMessage.meeting, newMeetings[0])
      assert.includeDeepMembers(
        Reflect.get(messageEnricher, 'sessionData'),
        newSessions
      )
      assert.includeDeepMembers(
        Reflect.get(messageEnricher, 'meetingData'),
        newMeetings
      )

      verify(openF1Service.getSessions(anything())).once()
      verify(openF1Service.getMeetings(anything())).once()
    })
  })
})
