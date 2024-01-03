import { Chapter, ChapterDocument, ChapterModel } from '~/models/database/Chapter'
import { Paging } from './types'
import { ObjectId } from 'mongoose'
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

type ChapterFirstLastId = {
  firstChapterId?: string | null
  lastChapterId?: string | null
}

type GetDataChapter = ChapterDocument & {
  previousId?: string | null
  nextId?: string | null
}

export const getChaptersByBookId = async ({
  bookId,
  page,
  limit,
  odir
}: GetChaptersByBookIdType): Promise<GetAllChapter> => {
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

export const getChapterByBookIdAndNumChapter = async (id: string, numberChapter: number): Promise<ChapterDocument> => {
  if (!id) throw 'error'
  const data = await ChapterModel.findOne({ bookId: id, numberChapter })
  if (!data) throw 'error'

  await BookModel.findByIdAndUpdate(data?.bookId, { $inc: { views: 1 } })

  return data.toJSON()
}

export const getFirstLastChapterIdByBookId = async (id: string): Promise<ChapterFirstLastId | null> => {
  const firstChapter = await ChapterModel.findOne({ bookId: id, numberChapter: 1 }).select('_id').exec()
  const totalChapter = await ChapterModel.find({ bookId: id }).countDocuments()
  const lastChapter = await ChapterModel.findOne({ bookId: id, numberChapter: totalChapter }).select('_id').exec()

  if (!firstChapter || !lastChapter) {
    throw 'error getFirstLastChapterIdByBookId'
  }

  return { firstChapterId: firstChapter._id?.toString(), lastChapterId: lastChapter._id?.toString() }
}

export const getPerviorNextChapterIdByBookId = async (id: string): Promise<ChapterFirstLastId | null> => {
  const firstChapter = await ChapterModel.findOne({ bookId: id, numberChapter: 1 }).select('_id').exec()
  const totalChapter = await ChapterModel.find({ bookId: id }).countDocuments()
  const lastChapter = await ChapterModel.findOne({ bookId: id, numberChapter: totalChapter }).select('_id').exec()

  if (!firstChapter || !lastChapter) {
    throw 'error getFirstLastChapterIdByBookId'
  }

  return { firstChapterId: firstChapter._id?.toString(), lastChapterId: lastChapter._id?.toString() }
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

export const getchapterInfo = async (chapterId: string): Promise<GetDataChapter> => {
  if (!chapterId) throw 'error'
  const data = await ChapterModel.findByIdAndUpdate(chapterId, { $inc: { views: 1 } }, { new: true })
  if (!data) throw 'error'

  const { numberChapter, bookId } = data

  await BookModel.findByIdAndUpdate(data?.bookId, { $inc: { views: 1 } })

  const totalChapter = await ChapterModel.find({ bookId }).countDocuments()
  let previousId = null
  let nextId = null

  if (numberChapter > 1) {
    const previous = await ChapterModel.findOne({ bookId, numberChapter: numberChapter - 1 })
      .select('_id')
      .exec()
    previousId = previous?._id.toString()
  }

  if (!!numberChapter && numberChapter < totalChapter) {
    const next = await ChapterModel.findOne({ bookId, numberChapter: numberChapter + 1 })
      .select('_id')
      .exec()
    nextId = next?._id.toString()
  }

  return { ...data.toJSON(), previousId, nextId }
}