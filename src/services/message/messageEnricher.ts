import { inject, injectable } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { Session, SessionRequest } from '../../interfaces/openf1/session'
import { EnrichedRaceControlMessage, RaceControlMessage } from '../../interfaces/openf1/raceControl'
import { Meeting, MeetingRequest } from '../../interfaces/openf1/meeting'
import { Topic } from '../../enums'
import { OpenF1Service } from '../openf1/openF1Service'

@injectable()
export class MessageEnricher {
  private sessionData: Session[] = []
  private meetingData: Meeting[] = []

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.OpenF1Service) private openF1Service: OpenF1Service
  ) { }

  public async enrichRaceControlMessage(message: RaceControlMessage): Promise<EnrichedRaceControlMessage> {
    const session: Session = await this.getSessionData({ session_key: message.session_key })
    const meeting: Meeting = await this.getMeetingData({ meeting_key: message.meeting_key })

    return {
      ...message,
      session: session,
      meeting: meeting
    }
  }

  private async getSessionData(request: SessionRequest): Promise<Session> {
    return this.getData(Topic.Sessions, this.sessionData, request)
  }

  private async getMeetingData(request: MeetingRequest): Promise<Meeting> {
    return this.getData(Topic.Meetings, this.meetingData, request)
  }

  private async getData<RestResponse, RestRequest>(topic: Topic, cachedData: RestResponse[], request: RestRequest): Promise<RestResponse> {
    if (cachedData.length > 0) {
      const hit: RestResponse = cachedData.find(cachedResponse => this.findByRequest(request, cachedResponse))

      if (hit) {
        return hit
      }
    }

    try {
      const responseData: RestResponse = await this.callClient(topic, request)

      this.logger.info(`Data retrieved successfully from endpoint ${topic}.`)
      this.logger.debug(request, 'Request')
      this.logger.debug(responseData, 'Response')

      cachedData.push(responseData)

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

  private async callClient<RestRequest>(topic: Topic, request?: RestRequest): Promise<any> {
    switch (topic) {
      case Topic.Meetings:
        return (await this.openF1Service.getMeetings(request))[0]
      case Topic.Sessions:
        return (await this.openF1Service.getSessions(request))[0]
      default:
        this.logger.warn(`Call to unsupported endpoint ${topic} detected.`)
        return
    }
  }
}
