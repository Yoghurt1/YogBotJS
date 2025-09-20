import { inject, injectable } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { RestClient } from '../clients/restClient'
import { TokenResponse } from '../../interfaces/openf1/tokenResponse'
import { MeetingRequest, Meeting } from '../../interfaces/openf1/meeting'
import { SessionRequest, Session } from '../../interfaces/openf1/session'

@injectable()
export class OpenF1Service {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.RestClient) private restClient: RestClient
  ) { }

  public async authenticate(): Promise<TokenResponse> {
    this.logger.info('Authenticating with OpenF1 API...')

    const response: TokenResponse = await this.restClient.getToken()

    this.logger.info('API authentication success.')
    this.logger.debug(response)

    return response
  }

  public async getSessions(params?: SessionRequest): Promise<Session[]> {
    if (params) {
      params.year = params.year || new Date().getFullYear()
    } else {
      params = { year: new Date().getFullYear() }
    }

    return this.restClient.getSessions(params)
  }

  public async getMeetings(params?: MeetingRequest): Promise<Meeting[]> {
    if (params) {
      params.year = params.year || new Date().getFullYear()
    } else {
      params = { year: new Date().getFullYear() }
    }

    return this.restClient.getMeetings(params)
  }
}
