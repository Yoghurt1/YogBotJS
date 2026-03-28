import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { PublishCommand, PublishCommandInput, PublishCommandOutput, SNSClient } from '@aws-sdk/client-sns'
import { ERROR_TOPIC_ARN } from '../../config'
import { Logger } from 'pino'
import { AwsService } from './awsService'
import { SnsMessageMapper } from '../../mappers/snsMessageMapper'

@injectable()
export class SnsService extends AwsService {
  public constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.SNSClient) protected client: SNSClient,
    @inject(TYPES.SnsMessageMapper) private messageMapper: SnsMessageMapper
  ) { super(logger, client) }

  public async publishError(err: Error): Promise<PublishCommandOutput> {
    const params: PublishCommandInput = {
      TopicArn: ERROR_TOPIC_ARN,
      Message: JSON.stringify(this.messageMapper.mapErrorMessage(err))
    }

    const command: PublishCommand = new PublishCommand(params)

    this.logger.info('Publishing error to SNS.')
    return this.sendCommand<PublishCommand, PublishCommandOutput>(command)
  }
}
