require('dotenv').config()

const app = require('express')()
const bodyParser = require('body-parser')
const cors = require('cors')
const _ = require('lodash')

const application = require('./app')
const DB = require('./db');

(async () => {
  if (process.env.DEV === 'true') {
    console.info('Running on debug mode')
    const morgan = require('morgan')
    app.use(morgan('dev'))
  }

  app.use(bodyParser.json())
  app.use(cors())

  const db = await DB()

  if (_.isUndefined(db)) {
    // Something error with database
    return null
  }

  app.DB = db

  app.DB.sequelize.sync()

  application(app)

  app.listen(process.env.PORT, '127.0.0.1', err => {
    if (err) {
      return console.error('Error bootup', err.toString())
    }
    console.log(`Application up at 127.0.0.1:${process.env.PORT}`)
  })
})()
