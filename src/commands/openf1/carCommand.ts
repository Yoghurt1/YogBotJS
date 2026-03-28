import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../interfaces/slashCommand'
import { TYPES } from '../../types'
import iocContainer from '../../ioc'
import { CarCommandService } from '../../services/commands/carCommandService'

module.exports = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName('car')
    .setDescription('Returns information on the given car.')
    .addIntegerOption((option) => option.setName('car_number').setDescription('Car number to look up.').setRequired(true)),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const carCommandService: CarCommandService = iocContainer.get(TYPES.CarCommandService)

    const embed: EmbedBuilder = await carCommandService.getCarResponse(interaction)

    await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral })
  }
})
