import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js'

export class SlashCommand {
  data!: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder
  execute!: (interaction: ChatInputCommandInteraction) => Promise<void>

  public constructor(command: SlashCommand) {
    Object.assign(this, command)
  }
}
