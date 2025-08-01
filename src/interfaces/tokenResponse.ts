export type ExpiresIn = "3600"
export type TokenType = 'Bearer'

export interface TokenResponse {
  expires_in: ExpiresIn
  access_token: string
  token_type: TokenType
}
