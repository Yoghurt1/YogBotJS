import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js'
import { SlashCommand } from '../../interfaces/slashCommand'
import { TYPES } from '../../types'
import iocContainer from '../../ioc'
import { WeatherCommandService } from '../../services/commands/weatherCommandService'
import { Logger } from 'pino'

module.exports = new SlashCommand({
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Returns weather information for the current session.'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    try {
      const weatherCommandService: WeatherCommandService = iocContainer.get(TYPES.WeatherCommandService)

      const embed: EmbedBuilder = await weatherCommandService.getWeatherResponse()

      await interaction.followUp({ embeds: [embed], flags: MessageFlags.Ephemeral })
    } catch (error) {
      const logger: Logger = iocContainer.get(TYPES.Logger)
      logger.error(error, 'Error executing weather command:')

      await interaction.followUp({ content: `An error occurred. It's all your fault.`, flags: MessageFlags.Ephemeral })
    }
  }
})
