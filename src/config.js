module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  OPENF1_USERNAME: process.env.OPENF1_USERNAME,
  OPENF1_PASSWORD: process.env.OPENF1_PASSWORD,
  MQTT_URL: process.env.MQTT_URL || 'mqtts://mqtt.openf1.org',
  MQTT_PORT: Number(process.env.MQTT_PORT) || 8883,
  CHANNEL_ID: process.env.CHANNEL_ID || '1400859518253924392',
}