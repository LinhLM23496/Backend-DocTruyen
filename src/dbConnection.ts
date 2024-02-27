import mongoose from 'mongoose'
import triggerAction from './triggerAction'

const dbConnect = () => {
  const MONGO_URL = process.env.MONGO_URL ?? ''

  mongoose.Promise = Promise
  mongoose.connect(MONGO_URL)

  mongoose.connection.on('connected', () => {
    console.log('\x1b[36m%s\x1b[0m', 'Connected to database sucessfully')

    if (process.env.NODE_ENV === 'production') {
      console.log('Server is running in production mode')
      triggerAction()
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Server is running in development mode')
    }
  })

  mongoose.connection.on('error', (err) => {
    console.log('\x1b[41m%s\x1b[0m', 'Error while connecting to database :' + err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('\x1b[41m%s\x1b[0m', 'Mongodb connection disconnected')
  })
}

export default dbConnect
