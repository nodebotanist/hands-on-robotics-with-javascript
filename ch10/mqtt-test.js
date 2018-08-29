const dotenv = require('dotenv').config()
const mqtt = require('mqtt')

const client = mqtt.connect(
  process.env.ADAFRUIT_IO_URL,
  {
    username: process.env.ADAFRUIT_IO_USERNAME,
    password: process.env.ADAFRUIT_IO_KEY,
    port: process.env.ADAFRUIT_IO_PORT
  }
)

client.on('connect', () => {
  console.log('Connected to AdafruitIO')
  client.subscribe(process.env.ADAFRUIT_IO_FEED, () => {
    client.publish(process.env.ADAFRUIT_IO_FEED, 'Hello from the Pi!')
  })
})