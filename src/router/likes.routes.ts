import express from 'express'
import { actionLike, getLikes } from '~/controllers/likes.controllers'
import { isAuthenticated } from '~/middlewares/user.middlewares'

export default (router: express.Router) => {
  router.get('/likes', isAuthenticated, getLikes)
  router.post('/likes/:bookId', isAuthenticated, actionLike)
}
