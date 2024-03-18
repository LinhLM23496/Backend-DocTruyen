import express from 'express'
import * as dotenv from 'dotenv'
import http from 'http'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import router from './router'
import dbConnect from './dbConnection'
import { applicationDefault, initializeApp } from 'firebase-admin/app'

dotenv.config() //must have

process.env.GOOGLE_APPLICATION_CREDENTIALS

// config firebase notification
initializeApp({
  credential: applicationDefault(),
  projectId: process.env.PROJECT_ID
})

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors({ credentials: true }))

app.use(compression())
app.use(cookieParser())
app.use(express.json())

const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

dbConnect()

app.use('/api/', router())
