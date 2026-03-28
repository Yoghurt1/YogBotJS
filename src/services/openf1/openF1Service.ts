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
import { Lap, LapRequest } from '../../interfaces/openf1/lap'
import { Pit, PitRequest } from '../../interfaces/openf1/pit'
import { Position, PositionRequest } from '../../interfaces/openf1/position'
import { Stint, StintRequest } from '../../interfaces/openf1/stint'
import { WeatherRequest, Weather } from '../../interfaces/openf1/weather'

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
    return this.restClient.getSessions(params)
  }

  public async getMeetings(params: MeetingRequest = {}): Promise<Meeting[]> {
    return this.restClient.getMeetings(params)
  }

  public async getDrivers(params: DriverRequest = {}): Promise<Driver[]> {
    this.setDefaultParams(params)

    return this.restClient.getDrivers()
  }

  public async getCarData(params: CarDataRequest = {}): Promise<CarData[]> {
    this.setDefaultParams(params)

    return this.restClient.getCarData()
  }

  public async getIntervals(params: IntervalRequest = {}): Promise<Interval[]> {
    this.setDefaultParams(params)

    return this.restClient.getIntervals()
  }

  public async getLaps(params: LapRequest = {}): Promise<Lap[]> {
    this.setDefaultParams(params)

    return this.restClient.getLaps()
  }

  public async getPits(params: PitRequest = {}): Promise<Pit[]> {
    this.setDefaultParams(params)

    return this.restClient.getPits()
  }

  public async getPositions(params: PositionRequest = {}): Promise<Position[]> {
    this.setDefaultParams(params)

    return this.restClient.getPositions()
  }

  public async getStints(params: StintRequest = {}): Promise<Stint[]> {
    this.setDefaultParams(params)

    return this.restClient.getStints()
  }

  public async getWeather(params: WeatherRequest = {}): Promise<Weather[]> {
    this.setDefaultParams(params)

    return this.restClient.getWeather(params)
  }

  private setDefaultParams(params: SessionedRequest): void {
    params.session_key = params.session_key ?? 'latest'
    params.meeting_key = params.meeting_key ?? 'latest'
  }
}
