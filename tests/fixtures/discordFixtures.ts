import { Channel, ChannelManager, Client, EmbedBuilder, TextChannel } from 'discord.js'
import * as sinon from 'sinon'
import { DEFAULT_EMBED } from '../../src/constants'

export function getMockDiscordClient(channel: Channel): sinon.SinonStubbedInstance<Client> {
  channel = sinon.createStubInstance(TextChannel)

  const stub = sinon.createStubInstance(Client)
  stub.channels = sinon.createStubInstance(ChannelManager)
  stub.channels.fetch = sinon.stub().resolves(channel)

  return stub
}

export function generateEmbed(): EmbedBuilder {
  return EmbedBuilder.from(DEFAULT_EMBED)
}
