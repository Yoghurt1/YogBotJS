import 'mocha'
import { assert } from 'chai'
import * as sinon from 'sinon'
import * as DonateCommand from '../../../../src/commands/utility/donateCommand'
import { SlashCommand } from '../../../../src/interfaces/slashCommand'
import { beforeEach } from 'mocha'
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { DEFAULT_EMBED } from '../../../../src/constants'

describe('DonateCommand', () => {
  let command: SlashCommand

  beforeEach(() => {
    command = DonateCommand as SlashCommand
  })

  describe('data', () => {
    it('should have the correct name and description', () => {
      assert.equal(command.data.name, 'donate')
      assert.equal(command.data.description, 'Returns information on how to contribute to running the bot.')
    })
  })

  describe('execute', () => {
    let interactionStub: sinon.SinonStubbedInstance<ChatInputCommandInteraction>

    beforeEach(() => {
      interactionStub = sinon.createStubInstance(ChatInputCommandInteraction)
    })

    it('should reply with the correct embed', async () => {
      const expectedEmbed: EmbedBuilder = EmbedBuilder.from(DEFAULT_EMBED)
        .setDescription(`Unfortunately, YogBot does not operate for free. If you'd like to help cover a bit of the running costs, feel free to donate using my Ko-Fi link below. Any and all contributions are greatly appreciated. :)`)

      await command.execute(interactionStub)

      assert.isTrue(interactionStub.reply.calledOnceWith({ embeds: [expectedEmbed] }))
    })
  })
})
