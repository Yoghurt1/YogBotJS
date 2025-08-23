import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../interfaces/slashCommand'
import { DEFAULT_EMBED } from '../../constants'

const suggestionEmbed: EmbedBuilder =
  EmbedBuilder.from(DEFAULT_EMBED)
    .setDescription('If you have any suggestions for new functionality, [leave them here!](https://github.com/Yoghurt1/YogBotJS/discussions/new?category=ideas)')

module.exports = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName('suggestions')
    .setDescription('Returns the link for submitting suggestions for new functionality.'),
  execute: async (interaction) => {
    await interaction.reply({ embeds: [suggestionEmbed] })
  }
})
