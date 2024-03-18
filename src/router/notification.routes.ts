import express from 'express'
import {
  countUnReadNotifications,
  getListNotifications,
  putNotification,
  readAllNotifications,
  readNotifByMessageId,
  readNotification
} from '~/controllers/notifications.controllers'
import { isAuthenticated } from '~/middlewares/user.middlewares'

export default (router: express.Router) => {
  router.get('/notifications', isAuthenticated, getListNotifications)
  router.get('/notifications/count-unread', isAuthenticated, countUnReadNotifications)
  router.put('/notification', isAuthenticated, putNotification)
  router.put('/notification/:id/read', isAuthenticated, readNotification)
  router.put('/notification/message-read', isAuthenticated, readNotifByMessageId)
  router.put('/notifications/read-all', isAuthenticated, readAllNotifications)
}
