import * as path from 'path'
import * as fs from 'fs'
import { BaseInteraction, Channel, Client, Collection, EmbedBuilder, Events, GatewayIntentBits, MessageFlags, REST, Routes } from 'discord.js'
import { inject, injectable } from 'inversify'
import { TYPES } from '../../types'
import { Logger } from 'pino'
import { CHANNEL_ID, CLIENT_ID, DELAY, DISCORD_TOKEN, GUILD_ID } from '../../config'
import { sleep } from '../../util'
import { SlashCommand } from '../../interfaces/slashCommand'

@injectable()
export class DiscordClient {
  private client: Client

  constructor(
    @inject(TYPES.Logger) private logger: Logger
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })
  }

  public async start(): Promise<void> {
    try {
      await this.registerCommands()

      this.logger.info('Starting discord client...')
      await this.client.login(DISCORD_TOKEN)

      this.client.once('clientReady', () => {
        this.logger.info(`Logged in as ${this.client.user.tag}.`)
      })

      this.client.on(Events.InteractionCreate, this.handleInteraction.bind(this))
    } catch (error) {
      this.logger.fatal(error, 'Login failed.')
      throw error
    }
  }

  public isReady(): boolean {
    return this.client.isReady()
  }

  public async sendMessage(message: EmbedBuilder): Promise<void> {
    const channel: Channel = await this.client.channels.fetch(CHANNEL_ID)

    if (channel.isSendable()) {
      await sleep(DELAY)

      this.logger.info('Sending message.')

      await channel.send({ embeds: [message] })
    } else {
      this.logger.error(message, 'Channel is not sendable. Cannot send message.')
    }
  }

  private async handleInteraction(interaction: BaseInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) { return }

    this.logger.debug(interaction, 'Interaction received.')

    const command: SlashCommand = interaction.client.commands.get(interaction.commandName)

    if (!command) {
      this.logger.warn(interaction, `Unknown command ${interaction.commandName} received.`)
      return
    }

    try {
      await command.execute(interaction)
    } catch (error) {
      this.logger.error(error, `Failed to execute command ${interaction.commandName}.`)
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: `There was an error while executing this command. I hope you're happy.`,
          flags: MessageFlags.Ephemeral
        })
      } else {
        await interaction.reply({
          content: `There was an error while executing this command. I hope you're happy.`,
          flags: MessageFlags.Ephemeral
        })
      }
    }
  }

  private async registerCommands(): Promise<void> {
    this.logger.info('Registering commands...')
    this.client.commands = new Collection()

    const foldersPath = path.resolve(__dirname, '../../commands')
    const commandFolders = fs.readdirSync(foldersPath)

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder)
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file)
        const command = require(filePath)

        if ('data' in command && 'execute' in command) {
          this.client.commands.set(command.data.name, command)
          this.logger.info(`Command ${command.data.name} registered.`)
        } else {
          this.logger.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`)
        }
      }
    }

    const rest: REST = new REST().setToken(DISCORD_TOKEN)
    const commands: string[] = this.client.commands.map((command) => command.data.toJSON())

    try {
      this.logger.info(`Started refreshing ${commands.length} slash commands...`)

      const data: unknown[] = await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      ) as unknown[]

      this.logger.info(`Successfully refreshed ${data.length} slash commands.`)
    } catch (error) {
      this.logger.error(error, 'Error occurred when refreshing slash commands.')
    }

    this.logger.info('Commands registered.')
  }
}
