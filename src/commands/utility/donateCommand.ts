import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../interfaces/slashCommand'
import { DEFAULT_EMBED } from '../../constants'

const donateEmbed: EmbedBuilder =
  EmbedBuilder.from(DEFAULT_EMBED)
    .setDescription(`Unfortunately, YogBot does not operate for free. If you'd like to help cover a bit of the running costs, feel free to donate using my Ko-Fi link below. Any and all contributions are greatly appreciated. :)`)

module.exports = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName('donate')
    .setDescription('Returns information on how to contribute to running the bot.'),
  execute: async (interaction) => {
    await interaction.reply({ embeds: [donateEmbed] })
  }
})
