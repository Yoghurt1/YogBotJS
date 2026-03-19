import * as sinon from 'sinon'
import { AxiosInstance } from 'axios'

export function getMockAxiosInstance(): AxiosInstance {
  const axios: AxiosInstance = <AxiosInstance>{}
  axios.post = sinon.stub()
  axios.get = sinon.stub()
  axios.defaults.headers['Authorization'] = ''

  return axios
}
