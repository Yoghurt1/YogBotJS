import 'mocha'
import { assert } from 'chai'
import { OpenF1Service } from '../../../../src/services/openf1/openF1Service'
import { Logger } from 'pino'
import { RestClient } from '../../../../src/services/clients/restClient'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito'
import { TokenResponse } from '../../../../src/interfaces/openf1/tokenResponse'
import { generateMeeting, generateSession, generateTokenResponse } from '../../../fixtures/openf1Fixtures'
import { Session, SessionRequest } from '../../../../src/interfaces/openf1/session'
import { Meeting, MeetingRequest } from '../../../../src/interfaces/openf1/meeting'

describe('OpenF1Service', () => {
  let openF1Service: OpenF1Service

  let logger: Logger
  let restClient: RestClient

  beforeEach(() => {
    logger = getLogger()
    restClient = mock(RestClient)

    openF1Service = new OpenF1Service(
      logger,
      instance(restClient)
    )
  })

  describe('authenticate', () => {
    it('should authenticate and return token response', async () => {
      const expectedTokenResponse: TokenResponse = generateTokenResponse()

      when(restClient.getToken()).thenResolve(expectedTokenResponse)

      const tokenResponse: TokenResponse = await openF1Service.authenticate()

      assert.deepEqual(tokenResponse, expectedTokenResponse)
    })
  })

  describe('getSessions', () => {
    const sessions: Session[] = [generateSession()]

    beforeEach(() => {
      when(restClient.getSessions(anything())).thenResolve(sessions)
    })

    it('should get sessions with the current year if no params provided', async () => {
      const response: Session[] = await openF1Service.getSessions()

      assert.deepEqual(response, sessions)

      verify(restClient.getSessions(deepEqual({ year: new Date().getFullYear() }))).once()
    })

    it('should get sessions with the provided params', async () => {
      const params: SessionRequest = { year: 2025 }

      const response: Session[] = await openF1Service.getSessions(params)

      assert.deepEqual(response, sessions)

      verify(restClient.getSessions(deepEqual(params))).once()
    })

    it('should get sessions with the current year if params provided without year', async () => {
      const params: SessionRequest = { country_code: 'ITA' }

      const response: Session[] = await openF1Service.getSessions(params)

      assert.deepEqual(response, sessions)

      verify(restClient.getSessions(deepEqual({ ...params, year: new Date().getFullYear() }))).once()
    })
  })

  describe('getMeetings', () => {
    const meetings: Meeting[] = [generateMeeting()]

    beforeEach(() => {
      when(restClient.getMeetings(anything())).thenResolve(meetings)
    })

    it('should get meetings with the current year if no params provided', async () => {
      const response: Meeting[] = await openF1Service.getMeetings()

      assert.deepEqual(response, meetings)

      verify(restClient.getMeetings(deepEqual({ year: new Date().getFullYear() }))).once()
    })

    it('should get meetings with the provided params', async () => {
      const params: MeetingRequest = { year: 2025 }

      const response: Meeting[] = await openF1Service.getMeetings(params)

      assert.deepEqual(response, meetings)

      verify(restClient.getMeetings(deepEqual(params))).once()
    })

    it('should get meetings with the current year if params provided without year', async () => {
      const params: MeetingRequest = { country_code: 'ITA' }

      const response: Meeting[] = await openF1Service.getMeetings(params)

      assert.deepEqual(response, meetings)

      verify(restClient.getMeetings(deepEqual({ ...params, year: new Date().getFullYear() }))).once()
    })
  })
})
