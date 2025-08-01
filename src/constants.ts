import { OPENF1_PASSWORD, OPENF1_USERNAME } from './config'
import { TokenRequest } from './interfaces/tokenRequest'

export const TOKEN_REQUEST: TokenRequest = {
  username: OPENF1_USERNAME,
  password: OPENF1_PASSWORD
}
