import { injectable } from 'inversify'
import { Enriched } from '../interfaces/openf1/enrichedMessage'
import { Weather } from '../interfaces/openf1/weather'
import { EmbedBuilder } from 'discord.js'
import { Meeting } from '../interfaces/openf1/meeting'
import { DateTime } from 'luxon'
import { DEFAULT_EMBED } from '../constants'

@injectable()
export class WeatherResponseMapper {

  public mapWeatherResponse(weather: Enriched<Weather>): EmbedBuilder {
    return EmbedBuilder.from(DEFAULT_EMBED)
      .setTitle(`${weather.meeting.meeting_official_name} - ${weather.session.session_name}`)
      .setFooter({ text: this.getFooter(weather.message, weather.meeting) })
      .addFields(
        { name: 'Air temperature', value: `${weather.message.air_temperature}°C`, inline: true },
        { name: 'Track temperature', value: `${weather.message.track_temperature}°C`, inline: true },
        { name: 'Humidity', value: `${weather.message.humidity}%`, inline: true },
        { name: 'Wind direction', value: `${weather.message.wind_direction}° ${this.getWindDirection(weather.message.wind_direction)}`, inline: true },
        { name: 'Wind speed', value: `${weather.message.wind_speed}m/s`, inline: true },
        { name: 'Pressure', value: `${weather.message.pressure}mbar`, inline: true },
        { name: 'Rainfall', value: weather.message.rainfall === 0 ? 'No' : 'Yes', inline: true }
      )
  }

  private getFooter(message: Weather, meeting: Meeting): string {
    const offset: number = parseInt(meeting.gmt_offset.split(':')[0], 10)
    const msgDate: DateTime = DateTime.fromISO(message.date, { setZone: true }).plus({ hours: offset })

    return `Accurate as of ${msgDate.toFormat('HH:mm:ss')}`
  }

  private getWindDirection(direction: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N']

    return directions[Math.round(direction / 22.5)]
  }
}
