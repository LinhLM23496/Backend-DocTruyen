import express from 'express'
import authenticationRoutes from './authentication.routes'
import usersRoutes from './users.routes'
import refreshTokenRoutes from './refreshToken.routes'
import booksRoutes from './books.routes'

const router = express.Router()

export default (): express.Router => {
  authenticationRoutes(router)
  refreshTokenRoutes(router)
  usersRoutes(router)
  booksRoutes(router)

  return router
}
