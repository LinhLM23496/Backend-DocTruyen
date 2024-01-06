import express from 'express'
import * as dotenv from 'dotenv'
import http from 'http'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import router from './router'
import dbConnect from './dbConnection'
import triggerAction from './triggerAction'

dotenv.config() //must have

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
triggerAction()

app.use('/api/', router())
