import { LikeModel } from '~/models/database/Like'
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
  await LikeModel.countDocuments({ user: userId, isRead: true })

export const getAllNotifByUserId = async (params: GetLikesByUserId): Promise<GetAllNotifByUserId> => {
  const { page, limit, userId } = params
  const [data, total] = await Promise.all([
    NotificationModel.find({ user: userId })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }),
    NotificationModel.find({ userId }).countDocuments()
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
  await NotificationModel.findByIdAndUpdate(_id, { isRead: true })

export const updateAllReadNotifByUserId = async (userId: string) =>
  await NotificationModel.updateMany({ user: userId }, { isRead: true })
