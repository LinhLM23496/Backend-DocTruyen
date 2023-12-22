import express from 'express'
import authenticationRoutes from './authentication.routes'
import usersRoutes from './users.routes'
import refreshTokenRoutes from './refreshToken.routes'
import booksRoutes from './books.routes'
import chaptersRoutes from './chapters.routes'
import suggestionRoutes from './suggestion.routes'

const router = express.Router()

export default (): express.Router => {
  authenticationRoutes(router)
  refreshTokenRoutes(router)
  usersRoutes(router)
  booksRoutes(router)
  chaptersRoutes(router)
  suggestionRoutes(router)

  return router
}
