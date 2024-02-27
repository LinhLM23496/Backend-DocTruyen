import { Chapter, ChapterDocument, ChapterModel } from '~/models/database/Chapter'
import { Paging } from './types'
import { ObjectId } from 'mongoose'
import { BookDocument, BookModel } from '~/models/database/Book'
import { readFileSync } from 'fs'
import { DB_CHAPTER } from '~/constants'

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

type GetLastUpdateChapter = {
  page: number
  limit: number
}

type ChaptersLastUpdated = {
  _id: ObjectId
  name: string
  cover: string
  likes: number
  views: number
  updatedAt: Date
  chapters: number
  chapterId: string
  title: string
  numberChapter: number
}

type GetChaptersLastUpdated = {
  data: ChaptersLastUpdated[]
  paging: Paging
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

export const getFirstLastChapterIdByBookId = async (bookId: string): Promise<ChapterFirstLastId | null> => {
  const firstChapter = await ChapterModel.findOne({ bookId }).sort({ numberChapter: 1 }).select('_id').exec()
  const lastChapter = await ChapterModel.findOne({ bookId }).sort({ numberChapter: -1 }).select('_id').exec()

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

export const getChapterInfo = async (chapterId: string): Promise<GetDataChapter> => {
  const data = await ChapterModel.findByIdAndUpdate(chapterId, { $inc: { views: 1 } }, { new: true })
  if (!data) throw 'error getchapterInfo service'

  const { numberChapter, bookId } = data

  const content = readFileSync(DB_CHAPTER + bookId + '/' + chapterId + '.txt', 'utf-8')

  const book = await BookModel.findByIdAndUpdate(data?.bookId, { $inc: { views: 1 } })
  if (!book) throw 'error getchapterInfo service'

  const totalChapter = book.chapters || 0
  let previousId = null
  let nextId = null
  let i = 1
  let j = 1

  if (numberChapter > 1) {
    do {
      const previous = await ChapterModel.findOne({ bookId, numberChapter: numberChapter - i })
        .select('_id')
        .exec()
      previousId = previous?._id.toString()
      i++
    } while (!previousId && numberChapter - i > 0)
  }

  if (!!numberChapter && numberChapter < totalChapter) {
    do {
      const next = await ChapterModel.findOne({ bookId, numberChapter: numberChapter + j })
        .select('_id')
        .exec()
      nextId = next?._id.toString()
      j++
    } while (!nextId && numberChapter + j <= totalChapter)
  }

  return { ...data.toJSON(), content, previousId, nextId }
}

export const createChapterByBookId = async (bookId: string, values: Omit<Chapter, '_id'>): Promise<Chapter> => {
  const exitsChapter = await ChapterModel.findOne({ bookId, numberChapter: values.numberChapter })
  if (exitsChapter) return exitsChapter.toObject()

  const chapter = new ChapterModel(values)
  return chapter.save().then((savedChapter) => savedChapter.toObject())
}

export const getLastUpdateChapter = async ({ page, limit }: GetLastUpdateChapter): Promise<GetChaptersLastUpdated> => {
  const pipelineStages: any[] = [
    {
      $project: {
        _id: 1,
        name: 1,
        cover: 1,
        likes: 1,
        views: 1,
        updatedAt: 1,
        chapters: 1
      }
    },
    {
      $sort: {
        updatedAt: -1
      }
    }
  ]

  const totalCount = await BookModel.aggregate([...pipelineStages, { $count: 'total' }])

  pipelineStages.push(
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: limit
    }
  )

  const booksLastUpdated = await BookModel.aggregate(pipelineStages).exec()

  const dataLastUpdated = booksLastUpdated.map(async (book: any) => {
    let chapterLast: ChapterDocument | null = null
    let i = -1
    do {
      i += 1
      chapterLast = await ChapterModel.findOne({ bookId: book._id, numberChapter: book.chapters + i })
    } while (!chapterLast)

    return {
      ...book,
      chapterId: chapterLast?._id,
      title: chapterLast?.title,
      numberChapter: chapterLast?.numberChapter
    }
  })

  const promiseDataLastUpdated = await Promise.all(dataLastUpdated)

  const total = totalCount[0]?.total || 0
  const totalPages = Math.ceil(total / limit)
  const paging = {
    page,
    limit,
    total,
    totalPages
  }

  return { data: promiseDataLastUpdated, paging }
}
