import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

export class SlashCommand {
  data: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>

  public constructor(command: SlashCommand) {
    Object.assign(this, command)
  }
}
