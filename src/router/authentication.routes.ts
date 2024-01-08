import express from 'express'
import { changePasswordByCode, forgotPassword, login, register } from '~/controllers/authentication.controllers'

export default (router: express.Router) => {
  router.post('/auth/register', register)
  router.post('/auth/login', login)
  router.post('/auth/forgotPassword', forgotPassword)
  router.put('/auth/changePasswordByCode', changePasswordByCode)
}
