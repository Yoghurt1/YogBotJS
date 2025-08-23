module.exports = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  OPENF1_USERNAME: process.env.OPENF1_USERNAME,
  OPENF1_PASSWORD: process.env.OPENF1_PASSWORD,
  MQTT_URL: process.env.MQTT_URL || 'mqtts://mqtt.openf1.org',
  MQTT_PORT: Number(process.env.MQTT_PORT) || 8883,
  CHANNEL_ID: process.env.CHANNEL_ID || '1153073648236761128',
  DELAY: Number(process.env.DELAY) || 5000,

  // AWS
  AWS_REGION: process.env.AWS_REGION || 'eu-west-1',
  ERROR_TOPIC_ARN: process.env.ERROR_TOPIC_ARN
}