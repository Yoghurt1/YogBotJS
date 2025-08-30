import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { PublishCommand, PublishCommandInput, PublishCommandOutput, ServiceInputTypes, ServiceOutputTypes, SNSClient } from '@aws-sdk/client-sns'
import { ERROR_TOPIC_ARN } from '../../config'
import { MessageMapper } from '../message/messageMapper'
import { Logger } from 'pino'
import { Command } from 'smithy'

@injectable()
export class SnsService {
  public constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.SNSClient) private client: SNSClient,
    @inject(TYPES.MessageMapper) private messageMapper: MessageMapper
  ) { }

  public async publishError(err: Error): Promise<PublishCommandOutput> {
    const params: PublishCommandInput = {
      TopicArn: ERROR_TOPIC_ARN,
      Message: JSON.stringify(this.messageMapper.mapErrorMessage(err))
    }

    const command: PublishCommand = new PublishCommand(params)

    return this.sendCommand<PublishCommand, PublishCommandOutput>(command)
  }

  private async sendCommand<T extends Command<ServiceInputTypes>, U extends ServiceOutputTypes>(command: T): Promise<U> {
    try {
      this.logger.info('Sending error to SQS.')
      return this.client.send(command)
    } catch (error) {
      this.logger.error(error, 'Failed to send error to SQS.')
    }
  }
}
