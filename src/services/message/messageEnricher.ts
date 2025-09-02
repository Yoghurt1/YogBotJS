import { inject, injectable } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { RestClient } from '../clients/restClient'
import { Session, SessionRequest } from '../../interfaces/openf1/session'
import { EnrichedRaceControlMessage, RaceControlMessage } from '../../interfaces/openf1/raceControl'
import { Meeting, MeetingRequest } from '../../interfaces/openf1/meeting'
import { sleep } from '../../util'
import { Topic } from '../../enums'

@injectable()
export class MessageEnricher {
  private sessionData: Session[] = []
  private meetingData: Meeting[] = []

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RestClient) private restClient: RestClient
  ) {
    void this.waitForClient().then(async () => {
      await this.getMeetingData()
      await this.getSessionData()
    })
  }

  public async enrichRaceControlMessage(message: RaceControlMessage): Promise<EnrichedRaceControlMessage> {
    const sessions: Session[] = await this.getSessionData({ session_key: message.session_key })
    const meetings: Meeting[] = await this.getMeetingData({ meeting_key: message.meeting_key })

    return {
      ...message,
      session: sessions[0],
      meeting: meetings[0]
    }
  }

  private async getSessionData(request?: SessionRequest): Promise<Session[]> {
    return this.getData(Topic.Sessions, this.sessionData, request)
  }

  private async getMeetingData(request?: MeetingRequest): Promise<Meeting[]> {
    return this.getData(Topic.Meetings, this.meetingData, request)
  }

  private async getData<RestResponse, RestRequest>(topic: Topic, cachedData: RestResponse[], request?: RestRequest): Promise<RestResponse[]> {
    let cached: RestResponse[]

    if (cachedData?.length > 0) {
      if (request) {
        cached = [cachedData.find(response => this.findByRequest(request, response))]
      } else {
        cached = cachedData
      }
    }

    if (cached) {
      return cached
    }

    try {
      const responseData: RestResponse[] = await this.callClient(topic, request)
      this.logger.info(`Data retrieved successfully from endpoint ${topic}.`)
      this.logger.debug(request, 'Request')
      this.logger.debug(responseData, 'Response')

      cachedData.splice(0)
      cachedData.push(...responseData)

      return responseData
    } catch (error) {
      this.logger.error(error, 'Failed to retrieve session data.')
    }
  }

  private findByRequest<RestRequest, RestResponse>(request: RestRequest, response: RestResponse): boolean {
    return Object.keys(request)
      .map(key => request[key] === response[key])
      .some(match => match === true)
  }

  private async callClient<RestRequest>(topic: Topic, request?: RestRequest): Promise<any[]> {
    switch (topic) {
      case Topic.Meetings:
        return this.restClient.getMeetings(request)
      case Topic.Sessions:
        return this.restClient.getSessions(request)
      default:
        this.logger.warn(`Call to unsupported endpoint ${topic} detected.`)
        return
    }
  }

  private async waitForClient(): Promise<void> {
    while (!this.restClient.ready) {
      this.logger.info('Waiting for REST client to authenticate...')
      await sleep()
    }
  }
}
