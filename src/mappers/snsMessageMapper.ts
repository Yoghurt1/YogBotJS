import { APIEmbed, EmbedBuilder, codeBlock } from 'discord.js'
import { injectable } from 'inversify'
import { DateTime } from 'luxon'

@injectable()
export class SnsMessageMapper {
  public mapErrorMessage(error: Error): APIEmbed {
    const builder: EmbedBuilder =
      new EmbedBuilder()
        .setColor(0xFF1801)
        .setTitle(`Fatal error - ${error.name}`)
        .setDescription(`${error.message}\n${codeBlock(error.stack)}`)
        .setFooter({ text: DateTime.now().toRFC2822() })

    return builder.data
  }
}
