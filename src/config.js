module.exports = {
  // Discord
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID || '767477430658007080',
  CHANNEL_ID: process.env.CHANNEL_ID || '767481691529805846',

  // OpenF1
  OPENF1_USERNAME: process.env.OPENF1_USERNAME,
  OPENF1_PASSWORD: process.env.OPENF1_PASSWORD,
  MQTT_URL: process.env.MQTT_URL || 'mqtts://mqtt.openf1.org',
  MQTT_PORT: Number(process.env.MQTT_PORT) || 8883,

  // Config
  DELAY: Number(process.env.DELAY) || 5000,

  // AWS
  AWS_REGION: process.env.AWS_REGION || 'eu-west-1',
  ERROR_TOPIC_ARN: process.env.ERROR_TOPIC_ARN,
  ENABLE_SNS_ERRORS: process.env.ENABLE_SNS_ERRORS === 'true' || false,
}