import 'mocha'
import * as sinon from 'sinon'
import { assert } from 'chai'
import { MessageService } from '../../../../src/services/message/messageService'
import { Logger } from 'pino'
import { MessageEnricher } from '../../../../src/services/message/messageEnricher'
import { MessageMapper } from '../../../../src/services/message/messageMapper'
import { DiscordClient } from '../../../../src/services/clients/discordClient'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { anything, instance, mock, verify, when } from 'ts-mockito'
import { generateRaceControlMessage } from '../../../fixtures/messageFixtures'
import { EnrichedRaceControlMessage, RaceControlMessage } from '../../../../src/interfaces/openf1/raceControl'
import { generateMeeting, generateSession } from '../../../fixtures/openf1Fixtures'
import { EmbedBuilder } from 'discord.js'
import { generateEmbed } from '../../../fixtures/discordFixtures'

describe('MessageService', () => {
  let messageService: MessageService

  let logger: Logger
  let messageEnricher: MessageEnricher
  let messageMapper: MessageMapper
  let discordClient: DiscordClient

  let loggerErrorSpy: sinon.SinonSpy

  beforeEach(() => {
    logger = getLogger()
    messageEnricher = mock(MessageEnricher)
    messageMapper = mock(MessageMapper)
    discordClient = mock(DiscordClient)

    loggerErrorSpy = sinon.spy(logger.error)
    logger.error = loggerErrorSpy

    messageService = new MessageService(
      logger,
      instance(messageEnricher),
      instance(messageMapper),
      instance(discordClient)
    )
  })

  describe('sendRaceControlMessage', () => {
    it('should log and return if discord client not ready', async () => {
      when(discordClient.isReady()).thenReturn(false)

      await messageService.sendRaceControlMessage(generateRaceControlMessage())

      verify(messageEnricher.enrichRaceControlMessage(anything())).never()
      verify(messageMapper.mapRaceControlMessage(anything())).never()
      verify(discordClient.sendMessage(anything())).never()

      assert.isTrue(loggerErrorSpy.calledWith(sinon.match.object, 'Discord client is not ready. Cannot send message.'))
    })

    it('should enrich, map and send the message if discord client is ready', async () => {
      const raceControlMessage: RaceControlMessage = generateRaceControlMessage()
      const enrichedRaceControlMessage: EnrichedRaceControlMessage = { ...raceControlMessage, session: generateSession(), meeting: generateMeeting() }
      const embed: EmbedBuilder = generateEmbed()

      when(discordClient.isReady()).thenReturn(true)
      when(messageEnricher.enrichRaceControlMessage(raceControlMessage)).thenResolve(enrichedRaceControlMessage)
      when(messageMapper.mapRaceControlMessage(enrichedRaceControlMessage)).thenReturn(embed)
      when(discordClient.sendMessage(embed)).thenResolve()

      await messageService.sendRaceControlMessage(raceControlMessage)

      verify(messageEnricher.enrichRaceControlMessage(raceControlMessage)).once()
      verify(messageMapper.mapRaceControlMessage(enrichedRaceControlMessage)).once()
      verify(discordClient.sendMessage(embed)).once()
    })
  })
})
