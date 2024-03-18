import { Paging, PagingParams } from './types'
import { NotificationDocument, NotificationModel } from '~/models/database/Notification'

type GetLikesByUserId = PagingParams & {
  userId: string
}

export type GetAllNotifByUserId = {
  data: NotificationDocument[]
  paging: Paging
}

type NotificationData = {
  messageId: string
  user: string
  createdBy: string
  title: string
  body: string
  data?: object
}

export const createNotifbyUserId = async (data: NotificationData): Promise<NotificationDocument> => {
  return await NotificationModel.create(data)
}

export const countUnReadNotifByUserId = async (userId: string): Promise<number> =>
  await NotificationModel.countDocuments({ user: userId, isRead: false })

export const getAllNotifByUserId = async (params: GetLikesByUserId): Promise<GetAllNotifByUserId> => {
  const { page, limit, userId } = params
  const [data, total] = await Promise.all([
    NotificationModel.find({ user: userId })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }),
    NotificationModel.find({ user: userId }).countDocuments()
  ])

  const totalPages = Math.ceil(total / limit)
  const paging = {
    page,
    limit,
    total,
    totalPages
  }
  return { data, paging }
}

export const updateReadNotifById = async (_id: string) =>
  await NotificationModel.findByIdAndUpdate(_id, { isRead: true, updatedAt: new Date() })

export const updateReadNotifByMessageId = async (messageId: string) =>
  await NotificationModel.findOneAndUpdate({ messageId }, { isRead: true, updatedAt: new Date() }, { new: true })

export const updateAllReadNotifByUserId = async (userId: string) =>
  await NotificationModel.updateMany({ user: userId }, { isRead: true, updatedAt: new Date() })
