import * as sinon from 'sinon'
import pino, { Logger } from 'pino'

export function getLogger(): Logger {
  const logger = pino()
  sinon.stub(logger, 'debug')
  sinon.stub(logger, 'info')
  sinon.stub(logger, 'warn')
  sinon.stub(logger, 'error')
  return logger
}
