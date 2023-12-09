import express from 'express'
import { deleteUser, getAllUsers, getUserInfo, updateUserInfo } from '~/controllers/users.controllers'
import { isAuthenticated, isOwner, roleCheck } from '~/middlewares'

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, roleCheck(['user']), getAllUsers)
  router.delete('/users', isAuthenticated, isOwner, deleteUser)
  router.get('/users/profile', isAuthenticated, getUserInfo)
  router.put('/users/profile', isAuthenticated, isOwner, updateUserInfo)
}
