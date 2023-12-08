import express from 'express'
import { refreshToken } from '~/controllers/refreshToken.controllers'

export default (router: express.Router) => {
  router.post('/refreshToken', refreshToken)
}
