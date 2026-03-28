import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { Logger } from 'pino'
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { OpenF1Service } from '../openf1/openF1Service'
import { CarData, CarDataRequest } from '../../interfaces/openf1/carData'
import { Driver, DriverRequest } from '../../interfaces/openf1/driver'
import { Interval, IntervalRequest } from '../../interfaces/openf1/interval'
import { Pit, PitRequest } from '../../interfaces/openf1/pit'
import { Position, PositionRequest } from '../../interfaces/openf1/position'
import { Stint, StintRequest } from '../../interfaces/openf1/stint'
import { Session } from '../../interfaces/openf1/session'
import { Meeting } from '../../interfaces/openf1/meeting'
import { CarResponseMapper } from '../../mappers/carResponseMapper'
import { sleep } from '../../util'
import { DateTime } from 'luxon'

@injectable()
export class CarCommandService {

  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.OpenF1Service) private openF1Service: OpenF1Service,
    @inject(TYPES.CarResponseMapper) private carResponseMapper: CarResponseMapper
  ) {}

  public async getCarResponse(interaction: ChatInputCommandInteraction): Promise<EmbedBuilder> {
    const carNum: number = interaction.options.getInteger('car_number', true)
    this.logger.info(`Getting data for car ${carNum}...`)

    const meeting: Meeting = (await this.openF1Service.getMeetings({ meeting_key: 'latest' }))[0]
    const session: Session = (await this.openF1Service.getSessions({ session_key: 'latest' }))[0]
    this.logger.info(session.date_end)

    this.logger.info('driver')
    const driver: Driver = await this.getDriver(carNum)
    await sleep()

    this.logger.info('cardata')
    const date: string = DateTime.fromISO(session.date_end).minus({ minutes: 2 }).toISO()
    const carData: CarData = await this.getCarData(carNum, date)
    await sleep()

    this.logger.info('interval')
    const interval: Interval = await this.getInterval(carNum)
    await sleep()

    this.logger.info('pit')
    const pit: Pit = await this.getPit(carNum)
    await sleep()

    this.logger.info('position')
    const position: Position = await this.getPosition(carNum)
    await sleep()

    this.logger.info('stint')
    const stint: Stint = await this.getStint(carNum)
    await sleep()

    return this.carResponseMapper.mapCarResponse(meeting, session, carData, driver, interval, pit, position, stint)
  }

  private async getDriver(carNum: number): Promise<Driver> {
    const driverRequest: DriverRequest = {
      driver_number: carNum
    }

    const drivers: Driver[] = await this.openF1Service.getDrivers(driverRequest)

    return drivers[drivers.length - 1]
  }

  private async getCarData(carNum: number, date: string): Promise<CarData> {
    const carDataRequest: CarDataRequest = {
      driver_number: carNum,
      date: date
    }

    const carData: CarData[] = await this.openF1Service.getCarData(carDataRequest)

    return carData[carData.length - 1]
  }

  private async getInterval(carNum: number): Promise<Interval> {
    const intervalRequest: IntervalRequest = {
      driver_number: carNum
    }

    const intervals: Interval[] = await this.openF1Service.getIntervals(intervalRequest)

    return intervals[intervals.length - 1]
  }

  private async getPit(carNum: number): Promise<Pit> {
    const pitRequest: PitRequest = {
      driver_number: carNum
    }

    const pits: Pit[] = await this.openF1Service.getPits(pitRequest)

    return pits[pits.length - 1]
  }

  private async getPosition(carNum: number): Promise<Position> {
    const positionRequest: PositionRequest = {
      driver_number: carNum
    }

    const positions: Position[] = await this.openF1Service.getPositions(positionRequest)

    return positions[positions.length - 1]
  }

  private async getStint(carNum: number): Promise<Stint> {
    const stintRequest: StintRequest = {
      driver_number: carNum
    }

    const stints: Stint[] = await this.openF1Service.getStints(stintRequest)

    return stints[stints.length - 1]
  }
}
