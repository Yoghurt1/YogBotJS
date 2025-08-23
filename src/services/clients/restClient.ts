import { AxiosError, AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse, create, isAxiosError } from 'axios'
import { Session, SessionRequest } from '../../interfaces/session'
import { TokenResponse } from '../../interfaces/tokenResponse'
import { TOKEN_REQUEST } from '../../constants'
import { inject, injectable } from 'inversify'
import { Logger } from 'pino'
import { Meeting, MeetingRequest } from '../../interfaces/meeting'
import { Topic } from '../../enums'
import { StatusCodes } from 'http-status-codes'

@injectable()
export class RestClient {
  public ready: boolean

  private axios: AxiosInstance
  private TOKEN: string

  constructor(
    @inject('Logger') private logger: Logger
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

  public async authenticate(): Promise<TokenResponse> {
    this.logger.info('Authenticating with OpenF1 API...')
    const response: TokenResponse = await this.httpHandler(() => this.axios.post<TokenResponse>('/token', TOKEN_REQUEST.toString()))

    this.logger.info('API authentication success.')
    this.logger.debug(response)

    this.TOKEN = response.access_token
    this.axios.defaults.headers['Authorization'] = `Bearer ${this.TOKEN}`
    this.ready = true

    return response
  }

  public async getSessions(params?: SessionRequest): Promise<Session[]> {
    if (params) {
      params.year = params.year || new Date().getFullYear()
    } else {
      params = { year: new Date().getFullYear() }
    }

    return this.httpHandler(() => this.axios.get<Session[]>(Topic.Sessions, { params }))
  }

  public async getMeetings(params?: MeetingRequest): Promise<Meeting[]> {
    if (params) {
      params.year = params.year || new Date().getFullYear()
    } else {
      params = { year: new Date().getFullYear() }
    }

    return this.httpHandler(() => this.axios.get<Meeting[]>(Topic.Meetings, { params }))
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
