const path = require('path')
const fs = require('fs')
const Sequelize = require('sequelize')
const async = require('async')
const { isNull, isFunction } = require('lodash')

const _MODEL_PATH = path.join(__dirname, 'schemas')

module.exports = async () => {
  try {
    const options = {
      host: process.env.RDS_DB_HOST,
      dialect: 'mysql',
      define: { underscored: true },
      pool: { max: 5, min: 0, acquire: 20000, idle: 10000 },
      timezone: '+00:00',
      logging: process.env.RDS_DB_LOG === 'true',
      benchmark: process.env.RDS_DB_BENCHMARK === 'true'
    }

    const sequelize = new Sequelize(process.env.RDS_DB_NAME, process.env.RDS_DB_USER, process.env.RDS_DB_PWD, options)

    // Don't parallel. We need to auth to DB first
    await sequelize.authenticate()

    const files = await getModels()
    const db = await importDBAndSetToDBSkeleton(sequelize, files)
    await associateRelationBetweenDB(db)

    db.Sequelize = Sequelize
    db.sequelize = sequelize

    return db
  } catch (err) {
    console.error('Database connection problem ---:', err.toString())
  }
}

const getModels = () => new Promise((resolve, reject) => {
  fs.readdir(_MODEL_PATH, (err, files) => err ? reject(err) : resolve(files))
})

const importDBAndSetToDBSkeleton = (sequelize, files) => new Promise((resolve, reject) => {
  const db = {}
  async.each(files, (file, callback) => {
    // not start with . , is .js and not index.js
    if (file.indexOf('.') !== 0 && !isNull(file.match(/\.js$/)) && file !== 'index.js') {
      const model = sequelize.import(path.join(_MODEL_PATH, file))
      db[model.name] = model
    }
    callback()
  }, () => resolve(db))
})

const associateRelationBetweenDB = db => new Promise((resolve, reject) => {
  async.eachOf(db, (model, modelName, callback) => {
    if (isFunction(db[modelName].associate)) {
      db[modelName].associate(db)
    }
    callback()
  }, () => resolve(db))
})
