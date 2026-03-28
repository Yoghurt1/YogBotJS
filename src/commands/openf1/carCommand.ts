import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../interfaces/slashCommand'
import { DEFAULT_EMBED } from '../../constants'
import { TYPES } from '../../types'
import iocContainer from '../../ioc'
import { OpenF1Service } from '../../services/openf1/openF1Service'

const donateEmbed: EmbedBuilder =
  EmbedBuilder.from(DEFAULT_EMBED)
    .setDescription(`Unfortunately, YogBot does not operate for free. If you'd like to help cover a bit of the running costs, feel free to donate using my Ko-Fi link below. Any and all contributions are greatly appreciated. :)`)

module.exports = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName('car')
    .setDescription('Returns information on the given car.'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    const openF1Service: OpenF1Service = iocContainer.get(TYPES.SnsService)

    await interaction.reply({ embeds: [donateEmbed], flags: MessageFlags.Ephemeral })
  }
})
