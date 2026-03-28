import { inject, injectable } from 'inversify'
import { TYPES } from '../types'
import { Logger } from 'pino'
import { Emote, Flag, RaceControlCategory } from '../enums'
import { EnrichedRaceControlMessage, RaceControlMessage } from '../interfaces/openf1/raceControl'
import { EmbedBuilder } from 'discord.js'
import { DateTime } from 'luxon'
import { DEFAULT_EMBED } from '../constants'
import { Meeting } from '../interfaces/openf1/meeting'

@injectable()
export class RaceControlMessageMapper {
  constructor(
    @inject(TYPES.Logger) private logger: Logger
  ) {}

  public mapRaceControlMessage(message: EnrichedRaceControlMessage): EmbedBuilder {
    this.logger.info('Mapping enriched message to Discord embed...')

    return EmbedBuilder.from(DEFAULT_EMBED)
      .setTitle(`${message.meeting.meeting_official_name} - ${message.session.session_name}`)
      .setDescription(`${this.getEmote(message)} ${message.message}`)
      .setFooter({ text: this.getFooter(message, message.meeting) })
  }

  private getEmote(message: RaceControlMessage): string {
    if (!!message.flag) {
      const flag: string = Object.entries(Flag).find(([_key, value]) => value === message.flag)[0]
      return Emote[flag]
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

  private getFooter(message: RaceControlMessage, meeting: Meeting): string {
    const offset: number = parseInt(meeting.gmt_offset.split(':')[0], 10)
    const msgDate: DateTime = DateTime.fromISO(message.date, { setZone: true }).plus({ hours: offset })
    let footer = `${msgDate.toFormat('HH:mm:ss')}`

    if (message.lap_number) {
      footer = footer + ` - Lap ${message.lap_number}`
    }

    return footer
  }
}
