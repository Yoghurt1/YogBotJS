import { OPENF1_PASSWORD, OPENF1_USERNAME } from './config'
import { URLSearchParams } from 'url'

export const TOKEN_REQUEST: URLSearchParams = new URLSearchParams({
  username: OPENF1_USERNAME,
  password: OPENF1_PASSWORD
})
