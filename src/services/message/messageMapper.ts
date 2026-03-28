import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { Logger } from 'pino'
import { Emote, Flag, FlagColour, RaceControlCategory } from '../../enums'
import { EnrichedRaceControlMessage } from '../../interfaces/openf1/raceControl'
import { APIEmbed, codeBlock, EmbedBuilder } from 'discord.js'
import { DateTime } from 'luxon'
import { DEFAULT_COLOUR, DEFAULT_EMBED } from '../../constants'

@injectable()
export class MessageMapper {
  constructor(
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  public mapRaceControlMessage(message: EnrichedRaceControlMessage): EmbedBuilder {
    this.logger.info('Mapping enriched message to Discord embed...')

    return EmbedBuilder.from(DEFAULT_EMBED)
      .setTitle(`${message.meeting.meeting_official_name} - ${message.session.session_name}`)
      .setDescription(`${this.getEmote(message)} ${message.message}`)
      .setFooter({ text: this.getFooter(message) })
      .setColor(this.getColour(message))
  }

  public mapErrorMessage(error: Error): APIEmbed {
    const builder: EmbedBuilder =
      EmbedBuilder.from(DEFAULT_EMBED)
        .setTitle(`Fatal error - ${error.name}`)
        .setDescription(`${error.message}\n${codeBlock(error.stack)}`)
        .setFooter({ text: DateTime.now().toRFC2822() })

    return builder.data
  }

  private getEmote(message: EnrichedRaceControlMessage): string {
    if (!!message.flag) {
      return Emote[this.getFlag(message)]
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
    let footer = `${msgDate.toFormat('HH:mm:ss')}`

    if (message.lap_number) {
      footer = footer + ` - Lap ${message.lap_number}`
    }

    return footer
  }

  private getColour(message: EnrichedRaceControlMessage): number {
    if (!!message.flag) {
      return FlagColour[this.getFlag(message)]
    }

    if (message.category === RaceControlCategory.SAFETY_CAR) {
      return FlagColour.YELLOW
    }

    if (message.message.includes('PENALTY')) {
      return FlagColour.BLACK
    }

    return DEFAULT_COLOUR
  }

  private getFlag(message: EnrichedRaceControlMessage): string {
    return Object.entries(Flag).find(([_key, value]) => value === message.flag)[0]
  }
}
