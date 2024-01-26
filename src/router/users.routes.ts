import express from 'express'
import {
  createSuggestedOfUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  updateUserInfo
} from '~/controllers/users.controllers'
import { isAuthenticated, isOwner } from '~/middlewares/user.middlewares'

export default (router: express.Router) => {
  router.get('/users', isAuthenticated, getAllUsers)
  router.get('/user', isAuthenticated, getUserInfo)
  router.put('/user', isAuthenticated, isOwner, updateUserInfo)
  router.delete('/user', isAuthenticated, isOwner, deleteUser)
  router.post('/user/create-suggested', isAuthenticated, createSuggestedOfUser)
}
