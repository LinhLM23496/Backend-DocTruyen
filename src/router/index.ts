import express from 'express'
import authenticationRoutes from './authentication.routes'
import usersRoutes from './users.routes'
import refreshTokenRoutes from './refreshToken.routes'

const router = express.Router()

export default (): express.Router => {
  authenticationRoutes(router)
  refreshTokenRoutes(router)
  usersRoutes(router)

  return router
}
