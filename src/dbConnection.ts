import mongoose from 'mongoose'

const dbConnect = () => {
  const MONGO_URL = process.env.MONGO_URL ?? ''

  mongoose.Promise = Promise
  mongoose.connect(MONGO_URL)

  mongoose.connection.on('connected', () => {
    console.log('Connected to database sucessfully')
  })

  mongoose.connection.on('error', (err) => {
    console.log('Error while connecting to database :' + err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('Mongodb connection disconnected')
  })
}

export default dbConnect
