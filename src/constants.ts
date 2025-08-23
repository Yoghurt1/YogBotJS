import { EmbedBuilder } from 'discord.js'
import { OPENF1_PASSWORD, OPENF1_USERNAME } from './config'
import { URLSearchParams } from 'url'

export const TOKEN_REQUEST: URLSearchParams = new URLSearchParams({
  username: OPENF1_USERNAME,
  password: OPENF1_PASSWORD
})

export const DEFAULT_EMBED: EmbedBuilder = new EmbedBuilder()
  .setColor(0xFF1801)
  .setFooter({ text: 'Support YogBot: https://ko-fi.com/yoghurt1111', iconURL: 'https://pbs.twimg.com/profile_images/1939979660588093440/Hgil-lUH_400x400.jpg' })
