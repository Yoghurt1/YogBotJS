import pino from 'pino'

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: `${__dirname}/app.log` },
    },
    {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  ],
})

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info'
  },
  transport
)
