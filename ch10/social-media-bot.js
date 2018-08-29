const dotenv = require('dotenv').config()
const mqtt = require('mqtt')
const five = require('johnny-five')
const RaspiIO = require('raspi-io')

let board = new five.Board({
  io: new RaspiIO()
})

board.on('ready', () => {
  let LCD = new five.LCD({
    controller: "PCF8574",
    rows: 2,
    cols: 16
  })

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
    client.subscribe('nodebotanist/feeds/social-media-bot.twitter')
    client.subscribe('nodebotanist/feeds/social-media-bot.twitch')

    client.on('message', (topic, message) => {
      LCD.clear()
      LCD.home()
      LCD.autoscroll()
      LCD.print(message)
    })
  })
})
