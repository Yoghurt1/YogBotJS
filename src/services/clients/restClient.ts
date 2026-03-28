import { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse, create, isAxiosError } from 'axios'
import { Session, SessionRequest } from '../../interfaces/openf1/session'
import { TokenResponse } from '../../interfaces/openf1/tokenResponse'
import { TOKEN_REQUEST } from '../../constants'
import { inject, injectable } from 'inversify'
import { Logger } from 'pino'
import { Meeting, MeetingRequest } from '../../interfaces/openf1/meeting'
import { Topic } from '../../enums'
import { StatusCodes } from 'http-status-codes'
import { TYPES } from '../../types'
import { CarData, CarDataRequest } from '../../interfaces/openf1/carData'
import { Driver, DriverRequest } from '../../interfaces/openf1/driver'
import { Interval, IntervalRequest } from '../../interfaces/openf1/interval'
import { LapRequest, Lap } from '../../interfaces/openf1/lap'
import { PositionRequest, Position } from '../../interfaces/openf1/position'
import { StintRequest, Stint } from '../../interfaces/openf1/stint'
import { WeatherRequest, Weather } from '../../interfaces/openf1/weather'
import { Pit, PitRequest } from '../../interfaces/openf1/pit'
import { DateTime } from 'luxon'

@injectable()
export class RestClient {
  public ready: boolean

  private axios: AxiosInstance
  private TOKEN: string

  constructor(
    @inject(TYPES.Logger) private logger: Logger
  ) {
    const requestConfig: AxiosRequestConfig = {
      baseURL: 'https://api.openf1.org',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }

    this.axios = create(requestConfig)
  }

  public async getToken(): Promise<TokenResponse> {
    const response: TokenResponse = await this.httpHandler(() => this.axios.post<TokenResponse>('/token', TOKEN_REQUEST.toString()))

    this.TOKEN = response.access_token
    this.axios.defaults.headers['Authorization'] = `Bearer ${this.TOKEN}`
    this.ready = true

    return response
  }

  public async getSessions(params?: SessionRequest): Promise<Session[]> {
    return this.httpHandler(() => this.axios.get<Session[]>(Topic.Sessions, { params }))
  }

  public async getMeetings(params?: MeetingRequest): Promise<Meeting[]> {
    return this.httpHandler(() => this.axios.get<Meeting[]>(Topic.Meetings, { params }))
  }

  public async getCarData(params?: CarDataRequest): Promise<CarData[]> {
    const date: string = params?.date ?? DateTime.now().minus({ minutes: 2 }).toISO()
    delete params?.date

    return this.httpHandler(() => this.axios.get<CarData[]>(`${Topic.CarData}?date>=${date}`, { params }))
  }

  public async getDrivers(params?: DriverRequest): Promise<Driver[]> {
    return this.httpHandler(() => this.axios.get<Driver[]>(Topic.Drivers, { params }))
  }

  public async getIntervals(params?: IntervalRequest): Promise<Interval[]> {
    return this.httpHandler(() => this.axios.get<Interval[]>(Topic.Intervals, { params }))
  }

  public async getLaps(params?: LapRequest): Promise<Lap[]> {
    return this.httpHandler(() => this.axios.get<Lap[]>(Topic.Laps, { params }))
  }

  public async getPits(params?: PitRequest): Promise<Pit[]> {
    return this.httpHandler(() => this.axios.get<Pit[]>(Topic.Pit, { params }))
  }

  public async getPositions(params?: PositionRequest): Promise<Position[]> {
    return this.httpHandler(() => this.axios.get<Position[]>(Topic.Position, { params }))
  }

  public async getStints(params?: StintRequest): Promise<Stint[]> {
    return this.httpHandler(() => this.axios.get<Stint[]>(Topic.Stints, { params }))
  }

  public async getWeather(params?: WeatherRequest): Promise<Weather[]> {
    return this.httpHandler(() => this.axios.get<Weather[]>(Topic.Weather, { params }))
  }

  private async httpHandler<T>(request: () => AxiosPromise<T>, retries = 0): Promise<T> {
    let data: T

    try {
      const response: AxiosResponse<T> = await request()
      data = response?.data
    } catch (err: any) {
      if (isAxiosError(err) && err.code === StatusCodes[StatusCodes.GATEWAY_TIMEOUT]) {
        if (retries <= 3) {
          retries += 1
          this.logger.info(`Axios request failed. Retrying... (${retries}/3)`)

          return this.httpHandler(request, retries)
        }
      }

      return this.handleError(err)
    }

    return data
  }

  private handleError(error: AxiosError) {
    this.logger.error(error, 'Axios request failed.')
    return Promise.reject(error)
  }
}
