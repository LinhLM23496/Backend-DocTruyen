import express from 'express'
import {
  countUnReadNotifications,
  getListNotifications,
  putNotification,
  readAllNotifications,
  readNotification
} from '~/controllers/notifications.controllers'
import { isAuthenticated } from '~/middlewares/user.middlewares'

export default (router: express.Router) => {
  router.get('/notifications', isAuthenticated, getListNotifications)
  router.get('/notifications/count', isAuthenticated, countUnReadNotifications)
  router.put('/notification', isAuthenticated, putNotification)
  router.post('/notification/:id/read', isAuthenticated, readNotification)
  router.post('/notifications/read', isAuthenticated, readAllNotifications)
}
