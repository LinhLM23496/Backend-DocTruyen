import express from 'express'
import * as dotenv from 'dotenv'
import http from 'http'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './router'
import dbConnect from './dbConnection'

dotenv.config() //must have

const app = express()
const port = process.env.PORT ?? 3000
const MONGO_URL = process.env.MONGO_URL ?? ''

app.use(cors({ credentials: true }))

app.use(compression())
app.use(cookieParser())
app.use(bodyParser.json())

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running onn http://localhost:${port}`)
})

dbConnect()

app.use('/', router())
