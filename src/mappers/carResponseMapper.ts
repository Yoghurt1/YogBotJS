import { EmbedBuilder } from 'discord.js'
import { injectable } from 'inversify'
import { CarData } from '../interfaces/openf1/carData'
import { Driver } from '../interfaces/openf1/driver'
import { Pit } from '../interfaces/openf1/pit'
import { Position } from '../interfaces/openf1/position'
import { Stint } from '../interfaces/openf1/stint'
import { DEFAULT_EMBED } from '../constants'
import { Interval } from '../interfaces/openf1/interval'
import { Session } from '../interfaces/openf1/session'
import { Meeting } from '../interfaces/openf1/meeting'

@injectable()
export class CarResponseMapper {
  public mapCarResponse(meeting: Meeting, session: Session, carData: CarData, driver: Driver, interval: Interval, pit: Pit, position: Position, stint: Stint): EmbedBuilder {
    return EmbedBuilder.from(DEFAULT_EMBED)
      .setTitle(`${meeting.meeting_official_name} - ${session.session_name}`)
      .setThumbnail(driver.headshot_url)
  }
}
