import { ServiceInputTypes, ServiceOutputTypes } from '@aws-sdk/client-sns'
import { Logger } from 'pino'
import { Client, Command } from 'smithy'

export abstract class AwsService {
  public constructor(
    protected logger: Logger,
    protected client: Client
  ) {}

  protected sendCommand<T extends Command<ServiceInputTypes>, U extends ServiceOutputTypes>(command: T): Promise<U> {
    try {
      this.logger.debug(command, 'Sending command to AWS.')
      return this.client.send(command)
    } catch (error) {
      this.logger.error(error, 'AWS command failed.')
    }
  }
}
