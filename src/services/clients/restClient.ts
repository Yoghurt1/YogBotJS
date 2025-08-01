import { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse, create } from 'axios'
import { RestSessions } from '../../interfaces/sessions'
import { TokenResponse } from '../../interfaces/tokenResponse'
import { TOKEN_REQUEST } from '../../constants'
import { inject, injectable } from 'inversify'
import { Logger } from 'pino'

@injectable()
export class RestClient {
  private axios: AxiosInstance

  constructor(
    @inject('Logger') private logger: Logger
  ) {
    const requestConfig: AxiosRequestConfig = {
      baseURL: 'https://api.openf1.org/v1',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      }
    }

    this.axios = create(requestConfig)
  }

  public async authenticate(): Promise<TokenResponse> {
    return this.httpHandler(() => this.axios.post<TokenResponse>('/token', TOKEN_REQUEST))
  }

  public async getSessions(): Promise<RestSessions[]> {
    return this.httpHandler(() => this.axios.get<RestSessions[]>('/sessions'))
  }

  private async httpHandler<T>(request: () => AxiosPromise<T>): Promise<T> {
    let data: T

    try {
      const response: AxiosResponse<T> = await request()
      data = response?.data
    } catch (err: any) {
      return this.handleError(err)
    }

    return data
  }

  private handleError(err: any) {
    this.logger.error('Axios request failed: ', err) 
    return Promise.reject(err)
  }
}
