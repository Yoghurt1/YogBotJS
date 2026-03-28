
export interface BaseMessage {
  _id: number
  _key: string
}

export interface Sessioned {
  meeting_key: number
  session_key: number
}

export interface SessionedMessage extends BaseMessage, Sessioned {}

/**
 * An interface to represent the union type to allow strings to be
 * submitted as part of a request, enabling the "latest" value
 * to be supplied rather than a numeric key.
 */
export interface SessionedRequest {
  meeting_key?: number | string
  session_key?: number | string
}
