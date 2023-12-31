import { Chapter, ChapterDocument, ChapterModel } from '~/models/database/Chapter'
import { Paging } from './types'
import mongoose, { ObjectId } from 'mongoose'
import { BookModel } from '~/models/database/Book'

type GetChaptersByBookIdType = {
  bookId: string
  page: number
  limit: number
  order?: string
  odir?: 'ascending' | 'descending'
}

type GetChapterShort = {
  _id: ObjectId
  title: string
  numberChapter: number
}

type GetAllChapter = {
  data: GetChapterShort[]
  paging: Paging
}

export const getChaptersByBookId = async ({
  bookId,
  page,
  limit,
  odir
}: GetChaptersByBookIdType): Promise<GetAllChapter> => {
  // const data = await ChapterModel.find({ bookId })
  //   .select('_id title numberChapter')
  //   .sort({ numberChapter: odir || 'ascending' })
  //   .skip((page - 1) * limit)
  //   .limit(limit)
  //   .exec()

  const data = await ChapterModel.aggregate([
    {
      $match: { bookId }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        numberChapter: 1
      }
    },
    {
      $sort: {
        numberChapter: 1
      }
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: limit
    }
  ])

  const total = await ChapterModel.find({ bookId }).countDocuments()
  const totalPages = Math.ceil(total / limit)

  const paging: Paging = {
    page,
    limit,
    total,
    totalPages
  }

  return { data, paging }
}

export const getChapterById = async (id: string): Promise<ChapterDocument | null> => {
  const chapter = await ChapterModel.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
  await BookModel.findByIdAndUpdate(chapter?.bookId, { $inc: { views: 1 } })

  return chapter
}

export const getChapterByBookIdAndNumChapter = async (
  id: string,
  numberChapter: number
): Promise<ChapterDocument | null> => {
  return ChapterModel.findOne({ bookId: id, numberChapter })
}

export const createChapter = async (values: Chapter): Promise<ChapterDocument> => {
  const chapter = new ChapterModel(values)
  return chapter.save().then((savedChapter) => savedChapter.toObject())
}

export const updateChapterById = async (id: string, values: Chapter): Promise<ChapterDocument | null> => {
  return ChapterModel.findByIdAndUpdate(id, values, { new: true })
}

export const deleteChapterById = async (id: string): Promise<ChapterDocument | any> => {
  return ChapterModel.findByIdAndDelete(id)
}

export const deleteMutilChaptersByBookId = async (bookId: string): Promise<void> => {
  try {
    await ChapterModel.deleteMany({ bookId })
  } catch (error) {
    console.error('Error deleting chapters:', error)
    throw error
  }
}
