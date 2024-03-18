import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus, LIMIT, Messages, PAGE } from '~/constants'
import { notificationServices, usersServices } from '~/services'
import { sendNotification } from '~/utils'

export const getListNotifications = async (req: Request, res: Response) => {
  try {
    const { _id: currentUserId } = req.user as JwtPayload
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : PAGE
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : LIMIT

    const { data, paging } = await notificationServices.getAllNotifByUserId({ page, limit, userId: currentUserId })

    return res.status(HttpStatus.OK).json({ error: 0, data, paging, message: Messages.GET_ALL_LIKES_SUCCESS })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const readNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.FIELD_ID_REQUIRED })
    }

    await notificationServices.updateReadNotifById(id)

    res.status(HttpStatus.OK).json({ message: Messages.READ_NOTIFICATION_SUCCESS })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const readNotifByMessageId = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.body
    console.log('messageId', messageId)

    if (!messageId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.FIELD_ID_REQUIRED })
    }

    const message = await notificationServices.updateReadNotifByMessageId(messageId)

    if (!message) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.NOTIFICATION_NOT_EXIST })
    }

    res.status(HttpStatus.OK).json({ message: Messages.READ_NOTIFICATION_SUCCESS })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const readAllNotifications = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as JwtPayload

    await notificationServices.updateAllReadNotifByUserId(_id)

    res.status(HttpStatus.OK).json({ message: Messages.READ_ALL_NOTIFICATIONS_SUCCESS })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const countUnReadNotifications = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as JwtPayload
    const count = await notificationServices.countUnReadNotifByUserId(_id)

    res.status(HttpStatus.OK).json({ error: 0, data: count, message: Messages.HTTP_200_OK })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const putNotification = async (req: Request, res: Response) => {
  try {
    const { userId, title, body, route: Route, param: Param } = req.body
    const { _id } = req.user as JwtPayload

    if (!userId || !title || !body) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.ALL_FIELDS_REQUIRED })
    }

    const user = await usersServices.getUserById(userId)

    if (!user || !user?.fcmToken) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.PUT_NOTIFICATION_FAILED })
    }

    const data = {
      Route,
      Param: JSON.stringify(Param)
    }

    const messageId = await sendNotification(user?.fcmToken, { title, body }, data)

    if (!messageId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.PUT_NOTIFICATION_FAILED })
    }

    const dataNotif = {
      messageId,
      user: userId,
      createdBy: _id,
      title,
      body,
      data: { Route, Param },
      createdAt: new Date()
    }

    await notificationServices.createNotifbyUserId(dataNotif)

    res.status(HttpStatus.OK).json({ message: Messages.PUT_NOTIFICATION_SUCCESS })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}
