import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { Logger } from 'pino'
import { MessageEnricher } from './messageEnricher'
import { Emote, Flag, RaceControlCategory, Topic } from '../enums'
import { EnrichedRaceControlMessage, RaceControlMessage } from '../interfaces/raceControl'
import { BaseMessage } from '../interfaces/baseMessage'
import { EmbedBuilder } from 'discord.js'
import { DateTime } from 'luxon'

@injectable()
export class MessageMapper {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.MessageEnricher) private messageEnricher: MessageEnricher
  ) {}

  public async mapRaceControlMessage(message: BaseMessage, topic: Topic): Promise<EmbedBuilder> {
    if (this.isRaceControlMessage(message, topic)) {
      this.logger.info('Enriching message...')
      const enrichedMessage: EnrichedRaceControlMessage = await this.messageEnricher.enrichMessage(message)

      this.logger.info('Mapping enriched message to Discord embed...')
      return new EmbedBuilder()
        .setColor(0xFF1801)
        .setTitle(`${enrichedMessage.meeting.meeting_official_name} - ${enrichedMessage.session.session_name}`)
        .setDescription(`${this.getEmote(enrichedMessage)} ${enrichedMessage.message}`)
        .setFooter({ text: this.getFooter(enrichedMessage) })
    }
  }

  private getEmote(message: EnrichedRaceControlMessage): string {
    if (!!message.flag) {
      return Emote[Flag[message.flag]]
    }

    if (message.category === RaceControlCategory.SAFETY_CAR) {
      return message.message.includes('VIRTUAL SAFETY CAR') ? Emote.FCY : Emote.SAFETY_CAR
    }

    if (message.message.includes('UNDER INVESTIGATION')) {
      return Emote.INVESTIGATION
    }

    if (message.message.includes('NOTED')) {
      return Emote.NOTED
    }

    if (message.message.includes('NO FURTHER ACTION')) {
      return Emote.NO_FURTHER_ACTION
    }

    if (message.message.includes('PENALTY')) {
      return Emote.BLACK
    }

    if (message.message.includes('TRACK LIMITS')) {
      return Emote.OFF_TRACK
    }

    return ''
  }

  private getFooter(message: EnrichedRaceControlMessage): string {
    const offset: number = parseInt(message.meeting.gmt_offset.split(':')[0], 10)
    const msgDate: DateTime = DateTime.fromISO(message.date, { setZone: true }).plus({ hours: offset })
    let footer: string = `${msgDate.toFormat('HH:mm:ss')}`

    if (message.lap_number) {
      footer = footer + ` - Lap ${message.lap_number}`
    }

    return footer
  }

  private isRaceControlMessage(message: BaseMessage, topic: Topic): message is RaceControlMessage {
    return topic === Topic.RaceControl
  }
}
