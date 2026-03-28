/* eslint-disable @typescript-eslint/naming-convention */
import { EmbedBuilder } from 'discord.js'
import { OPENF1_PASSWORD, OPENF1_USERNAME } from './config'
import { URLSearchParams } from 'url'
import { DRSState } from './enums'

export type MeetingSessionKey = 'meeting_key' | 'session_key'

export const TOKEN_REQUEST: URLSearchParams = new URLSearchParams({
  username: OPENF1_USERNAME,
  password: OPENF1_PASSWORD
})

export const DEFAULT_EMBED: EmbedBuilder = new EmbedBuilder()
  .setColor(0xFF1801)
  .setFooter({ text: 'Support YogBot: https://ko-fi.com/yoghurt1111', iconURL: 'https://pbs.twimg.com/profile_images/1939979660588093440/Hgil-lUH_400x400.jpg' })

export const DRS_STATUS: Record<number, DRSState> = {
  0: DRSState.OFF,
  1: DRSState.OFF,
  2: DRSState.UNKNOWN,
  3: DRSState.UNKNOWN,
  8: DRSState.READY,
  9: DRSState.UNKNOWN,
  10: DRSState.ON,
  12: DRSState.ON,
  14: DRSState.ON
}
