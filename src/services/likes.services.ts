import { LikeModel } from '~/models/database/Like'
import { DataLike, GetAllLikesByUserId, PagingParams } from './types'

type GetLikesByUserId = PagingParams & {
  userId: string
}

// 0: delete, 1: created
export const createLikebyBookId = async (bookId: string, userId: string): Promise<number> => {
  const exitsLike = await LikeModel.findOne({ book: bookId, user: userId })

  if (exitsLike) {
    await LikeModel.deleteOne({ _id: exitsLike._id })
    return 0
  } else {
    await LikeModel.create({ book: bookId, user: userId })
    return 1
  }
}

export const countLikesByBookId = async (bookId: string): Promise<number> =>
  await LikeModel.countDocuments({ book: bookId })

export const getAllLikesByUserId = async (params: GetLikesByUserId): Promise<GetAllLikesByUserId> => {
  const { page, limit, userId } = params
  const data: DataLike[] = await LikeModel.find({ user: userId })
    .limit(limit)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 }) // sort by createdAt desc
    .populate('book', 'name cover chapters status updatedAt')

  const total = await LikeModel.find({ userId }).countDocuments()
  const totalPages = Math.ceil(total / limit)
  const paging = {
    page,
    limit,
    total,
    totalPages
  }
  return { data, paging }
}
