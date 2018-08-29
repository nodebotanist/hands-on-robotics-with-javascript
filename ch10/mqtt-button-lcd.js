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
  let button = new five.Button('P1-29')

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
    
      button.on('press', () => {
        client.publish(process.env.ADAFRUIT_IO_FEED, 'Button pressed!')
      })

      client.on('message', (topic, message) => {
        LCD.clear().home().print(topic).setCursor(0,1).print(message)
      })
    })
  })
})
