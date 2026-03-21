import 'mocha'
import { assert } from 'chai'
import { MessageMapper } from '../../../../src/services/message/messageMapper'
import { Logger } from 'pino'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { EnrichedRaceControlMessage } from '../../../../src/interfaces/openf1/raceControl'
import { generateEnrichedRaceControlMessage } from '../../../fixtures/messageFixtures'
import { APIEmbed, EmbedBuilder } from 'discord.js'
import { DateTime } from 'luxon'
import { Emote, Flag, FlagColour, RaceControlCategory } from '../../../../src/enums'
import { DEFAULT_COLOUR } from '../../../../src/constants'

describe('MessageMapper', () => {
  let mapper: MessageMapper

  let logger: Logger

  beforeEach(() => {
    logger = getLogger()

    mapper = new MessageMapper(logger)
  })

  describe('mapErrorMessage', () => {
    it('should construct error embed correctly', () => {
      const error: Error = new Error('Test error')
      error.name = 'TestError'
      error.stack = 'Error stack trace'

      const embed: APIEmbed = mapper.mapErrorMessage(error)

      assert.equal(embed.title, `Fatal error - ${error.name}`)
      assert.include(embed.description, error.message)
      assert.include(embed.description, error.stack)
      assert.isNotEmpty(embed.footer.text)
    })
  })

  describe('mapRaceControlMessage', () => {
    let message: EnrichedRaceControlMessage

    beforeEach(() => {
      message = generateEnrichedRaceControlMessage()
    })

    it('should set title correctly', () => {
      const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

      assert.equal(embed.data.title, `${message.meeting.meeting_official_name} - ${message.session.session_name}`)
    })

    it('should set footer correctly - time only', () => {
      const date: DateTime = DateTime.now()
      message.date = date.toISO()
      message.meeting.gmt_offset = '02:00:00'
      message.lap_number = undefined

      const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

      assert.equal(embed.data.footer?.text, `${date.plus({ hours: 2 }).toFormat('HH:mm:ss')}`)
    })

    it('should set footer correctly - time and lap', () => {
      const date: DateTime = DateTime.now()
      message.date = date.toISO()
      message.meeting.gmt_offset = '02:00:00'
      message.lap_number = 1

      const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

      assert.equal(embed.data.footer?.text, `${date.plus({ hours: 2 }).toFormat('HH:mm:ss')} - Lap ${message.lap_number}`)
    })

    describe('Description', () => {
      describe('Flag present', () => {
        const cases = [
          { flag: Flag.BLACK, emote: Emote.BLACK },
          { flag: Flag.BLUE, emote: Emote.BLUE },
          { flag: Flag.YELLOW, emote: Emote.YELLOW },
          { flag: Flag.DOUBLE_YELLOW, emote: Emote.DOUBLE_YELLOW },
          { flag: Flag.RED, emote: Emote.RED },
          { flag: Flag.GREEN, emote: Emote.GREEN },
          { flag: Flag.CLEAR, emote: Emote.CLEAR },
          { flag: Flag.BLACK_AND_WHITE, emote: Emote.BLACK_AND_WHITE },
          { flag: Flag.CHEQUERED, emote: Emote.CHEQUERED }
        ]

        for (const testCase of cases) {
          it(`should include correct emote for flag ${testCase.flag}`, () => {
            message = generateEnrichedRaceControlMessage(testCase.flag)

            const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

            assert.include(embed.data.description, testCase.emote)
          })
        }
      })

      describe('No flag present', () => {
        const cases = [
          { message: 'UNDER INVESTIGATION', emote: Emote.INVESTIGATION },
          { message: 'NOTED', emote: Emote.NOTED },
          { message: 'NO FURTHER ACTION', emote: Emote.NO_FURTHER_ACTION },
          { message: 'PENALTY', emote: Emote.BLACK },
          { message: 'TRACK LIMITS', emote: Emote.OFF_TRACK }
        ]

        for (const testCase of cases) {
          it(`should include correct emote when message contains ${testCase.message}`, () => {
            message = generateEnrichedRaceControlMessage(undefined, testCase.message)
            message.flag = undefined

            const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

            assert.include(embed.data.description, testCase.emote)
          })
        }

        it('should include correct emote for virtual safety car message', () => {
          message = generateEnrichedRaceControlMessage(undefined, 'VIRTUAL SAFETY CAR DEPLOYED')
          message.flag = undefined
          message.category = RaceControlCategory.SAFETY_CAR

          const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

          assert.include(embed.data.description, Emote.FCY)
        })

        it('should include correct emote for safety car message', () => {
          message = generateEnrichedRaceControlMessage(undefined, 'SAFETY CAR DEPLOYED')
          message.flag = undefined
          message.category = RaceControlCategory.SAFETY_CAR

          const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

          assert.include(embed.data.description, Emote.SAFETY_CAR)
        })
      })
    })

    describe('Colour', () => {
      describe('Flag present', () => {
        const cases = [
          { flag: Flag.BLACK, flagColour: FlagColour.BLACK },
          { flag: Flag.BLUE, flagColour: FlagColour.BLUE },
          { flag: Flag.YELLOW, flagColour: FlagColour.YELLOW },
          { flag: Flag.DOUBLE_YELLOW, flagColour: FlagColour.DOUBLE_YELLOW },
          { flag: Flag.RED, flagColour: FlagColour.RED },
          { flag: Flag.GREEN, flagColour: FlagColour.GREEN },
          { flag: Flag.CLEAR, flagColour: FlagColour.CLEAR },
          { flag: Flag.BLACK_AND_WHITE, flagColour: FlagColour.BLACK_AND_WHITE },
          { flag: Flag.CHEQUERED, flagColour: FlagColour.CHEQUERED }
        ]

        for (const testCase of cases) {
          it(`should use correct colour for flag ${testCase.flag}`, () => {
            message = generateEnrichedRaceControlMessage(testCase.flag)

            const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

            assert.equal(embed.data.color, testCase.flagColour)
          })
        }
      })

      describe('No flag present', () => {
        it(`should use yellow colour when message category is ${RaceControlCategory.SAFETY_CAR}`, () => {
          message = generateEnrichedRaceControlMessage()
          message.flag = undefined
          message.category = RaceControlCategory.SAFETY_CAR

          const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

          assert.equal(embed.data.color, FlagColour.YELLOW)
        })

        it('should use black colour when message contains PENALTY', () => {
          message = generateEnrichedRaceControlMessage(undefined, 'PENALTY')
          message.flag = undefined

          const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

          assert.equal(embed.data.color, FlagColour.BLACK)
        })

        it('should use default colour if no other conditions met', () => {
          message = generateEnrichedRaceControlMessage()
          message.flag = undefined

          const embed: EmbedBuilder = mapper.mapRaceControlMessage(message)

          assert.equal(embed.data.color, DEFAULT_COLOUR)
        })
      })
    })
  })
})
