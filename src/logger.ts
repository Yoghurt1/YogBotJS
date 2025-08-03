import pino from 'pino'
import path from 'path'

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: path.resolve(__dirname, '../app.log') },
      level: 'debug'
    },
    {
      target: 'pino-pretty',
      options: { colorize: true, minimumLevel: 'info' },
      level: process.env.LOG_LEVEL || 'info'
    }
  ]
})

export const logger = pino({ level: 'trace' }, transport)
