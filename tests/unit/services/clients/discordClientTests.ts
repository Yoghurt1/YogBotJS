import 'mocha'
import * as sinon from 'sinon'
import { assert } from 'chai'
import { Logger } from 'pino'
import { getLogger } from '../../../fixtures/loggerFixtures'
import { Client, EmbedBuilder, Events, TextChannel } from 'discord.js'
import { getMockDiscordClient } from '../../../fixtures/discordFixtures'
import { DEFAULT_EMBED } from '../../../../src/constants'
import proxyquire from 'proxyquire'

describe('DiscordClient', () => {
  const { DiscordClient } = proxyquire('../../../../src/services/clients/discordClient', {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '../../util': {
      sleep: sinon.stub().resolves()
    }
  })

  let client: typeof DiscordClient

  let logger: Logger
  let discordClient: sinon.SinonStubbedInstance<Client>

  let channel: sinon.SinonStubbedInstance<TextChannel>

  beforeEach(() => {
    channel = sinon.createStubInstance(TextChannel)

    logger = getLogger()
    discordClient = getMockDiscordClient(channel)

    client = new DiscordClient(logger)

    // Setting via reflection as the client is private
    Reflect.set(client, 'client', discordClient)
  })

  describe('start', () => {
    it('should register commands and login', async () => {
      await client.start()

      assert.isTrue(discordClient.login.calledOnce)
      assert.isTrue(discordClient.once.calledWith('clientReady', sinon.match.func))
      assert.isTrue(discordClient.on.calledWith(Events.InteractionCreate, sinon.match.func))
    })
  })

  describe('isReady', () => {
    it('should return false if the client is not ready', () => {
      discordClient.isReady.returns(false)

      assert.isFalse(client.isReady())
    })

    it('should return true if the client is ready', () => {
      discordClient.isReady.returns(true)

      assert.isTrue(client.isReady())
    })
  })

  describe('sendMessage', () => {
    const MESSAGE: EmbedBuilder = EmbedBuilder.from(DEFAULT_EMBED)

    it('should ignore message if channel is not sendable', async () => {
      channel.isSendable.returns(false)
      client.client.channels.fetch.resolves(channel)

      await client.sendMessage(MESSAGE)

      assert.isTrue(channel.send.notCalled)
    })

    it('should send the message if the channel is sendable', async () => {
      channel.isSendable.returns(true)
      client.client.channels.fetch.resolves(channel)

      await client.sendMessage(MESSAGE)

      assert.isTrue(channel.send.calledOnceWith({ embeds: [MESSAGE] }))
    })
  })
})
