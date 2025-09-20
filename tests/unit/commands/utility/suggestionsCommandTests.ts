import 'mocha'
import { assert } from 'chai'
import * as sinon from 'sinon'
import * as SuggestionsCommand from '../../../../src/commands/utility/suggestionsCommand'
import { SlashCommand } from '../../../../src/interfaces/slashCommand'
import { beforeEach } from 'mocha'
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { DEFAULT_EMBED } from '../../../../src/constants'

describe('SuggestionsCommand', () => {
  let command: SlashCommand

  beforeEach(() => {
    command = SuggestionsCommand as SlashCommand
  })

  describe('data', () => {
    it('should have the correct name and description', () => {
      assert.equal(command.data.name, 'suggestions')
      assert.equal(command.data.description, 'Returns the link for submitting suggestions for new functionality.')
    })
  })

  describe('execute', () => {
    let interactionStub: sinon.SinonStubbedInstance<ChatInputCommandInteraction>

    beforeEach(() => {
      interactionStub = sinon.createStubInstance(ChatInputCommandInteraction)
    })

    it('should reply with the correct embed', async () => {
      const expectedEmbed: EmbedBuilder = EmbedBuilder.from(DEFAULT_EMBED)
        .setDescription(`If you have any suggestions for new functionality, [leave them here!](https://github.com/Yoghurt1/YogBotJS/discussions/new?category=ideas)`)

      await command.execute(interactionStub)

      assert.isTrue(interactionStub.reply.calledOnceWith({ embeds: [expectedEmbed] }))
    })
  })
})
