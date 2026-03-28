import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { OpenF1Service } from '../openf1/openF1Service'
import { Logger } from 'pino'
import { Weather } from '../../interfaces/openf1/weather'
import { EmbedBuilder } from 'discord.js'
import { EnrichmentService } from '../enrichmentService'
import { Enriched } from '../../interfaces/openf1/enrichedMessage'
import { WeatherResponseMapper } from '../../mappers/weatherResponseMapper'

@injectable()
export class WeatherCommandService {

  public constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.OpenF1Service) private openF1Service: OpenF1Service,
    @inject(TYPES.EnrichmentService) private enrichmentService: EnrichmentService,
    @inject(TYPES.WeatherResponseMapper) private weatherResponseMapper: WeatherResponseMapper
  ) {}

  public async getWeatherResponse(): Promise<EmbedBuilder> {
    this.logger.info('Getting weather data...')

    const weatherData: Weather[] = await this.openF1Service.getWeather()
    const enrichedWeatherData: Enriched<Weather> = await this.enrichmentService.enrichResponse(weatherData[weatherData.length - 1])

    return this.weatherResponseMapper.mapWeatherResponse(enrichedWeatherData)
  }
}
