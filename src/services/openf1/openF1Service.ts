import { inject, injectable } from 'inversify'
import { Logger } from 'pino'
import { TYPES } from '../../types'
import { RestClient } from '../clients/restClient'
import { TokenResponse } from '../../interfaces/openf1/tokenResponse'
import { MeetingRequest, Meeting } from '../../interfaces/openf1/meeting'
import { SessionRequest, Session } from '../../interfaces/openf1/session'
import { Driver, DriverRequest } from '../../interfaces/openf1/driver'
import { CarData, CarDataRequest } from '../../interfaces/openf1/carData'
import { Interval, IntervalRequest } from '../../interfaces/openf1/interval'
import { SessionedRequest } from '../../interfaces/openf1/baseMessage'

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

  public async getSessions(params: SessionRequest = {}): Promise<Session[]> {
    params.year = params.year ?? new Date().getFullYear()

    return this.restClient.getSessions(params)
  }

  public async getMeetings(params: MeetingRequest = {}): Promise<Meeting[]> {
    params.year = params.year ?? new Date().getFullYear()

    return this.restClient.getMeetings(params)
  }

  public async getDrivers(params: DriverRequest = {}): Promise<Driver[]> {
    return this.getWithDefaultParams(this.restClient.getDrivers, params)
  }

  public async getCarData(params: CarDataRequest = {}): Promise<CarData[]> {
    return this.getWithDefaultParams(this.restClient.getCarData, params)
  }

  public async getIntervals(params: IntervalRequest = {}): Promise<Interval[]> {
    return this.getWithDefaultParams(this.restClient.getIntervals, params)
  }

  private setDefaultParams(params: SessionedRequest): SessionedRequest {
    params.session_key = params.session_key ?? 'latest'
    params.meeting_key = params.meeting_key ?? 'latest'

    return params
  }

  private async getWithDefaultParams<T>(clientMethod: (params) => Promise<T[]>, params: SessionedRequest): Promise<T[]> {
    this.setDefaultParams(params)

    return clientMethod(params)
  }
}
