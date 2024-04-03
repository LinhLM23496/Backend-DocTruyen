import { Chapter, ChapterDocument, ChapterModel } from '~/models/database/Chapter'
import { Paging, PagingParams } from './types'
import { ObjectId } from 'mongoose'
import { BookModel } from '~/models/database/Book'
import { readFileSync } from 'fs'
import { DB_CHAPTER } from '~/constants'
import { booksServices } from '.'

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
  existingLike?: number
}

type GetLastUpdateChapter = PagingParams & {
  filter: { categories?: string[] }
}

type ChaptersLastUpdated = {
  bookId: ObjectId
  nameBook?: string
  cover?: string
  views: number
  chapters: number
  numberChapter: number
  chapterId?: ObjectId
  nameChapter?: string
  nunberChapter?: number
  createdAt: Date
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
  const [data, total] = await Promise.all([
    ChapterModel.aggregate([
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
    ]),
    ChapterModel.find({ bookId }).countDocuments()
  ])

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

export const getFirstLastChapterIdByBookId = async (bookId: string): Promise<ChapterFirstLastId> => {
  const totalChapter = await ChapterModel.find({ bookId }).sort({ numberChapter: 1 }).select('_id').exec()
  const firstChapterId = totalChapter[0]?._id?.toString() ?? null
  const lastChapterId = totalChapter[totalChapter.length - 1]?._id?.toString() || null

  return { firstChapterId, lastChapterId }
}

export const createChapter = async (values: Chapter): Promise<ChapterDocument> => {
  const chapter = new ChapterModel(values)
  return chapter.save().then((savedChapter) => savedChapter.toObject())
}

export const updateChapterById = async (id: string, values: Chapter): Promise<ChapterDocument | null> => {
  return ChapterModel.findByIdAndUpdate(id, { ...values, updatedAt: new Date() }, { new: true })
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

const getContent = async (bookId: string, chapterId: string): Promise<string> => {
  try {
    return await readFileSync(DB_CHAPTER + bookId + '/' + chapterId + '.txt', 'utf-8')
  } catch (error) {
    return 'CONTENT NOT FOUND'
  }
}

const getPreviousIdChapter = async (bookId: string, numberChapter: number): Promise<string | null> => {
  if (numberChapter <= 1) {
    return null
  }

  let previousId: string | null = null
  let i = 1

  while (numberChapter - i > 0 && !previousId) {
    const previous = await ChapterModel.findOne({ bookId, numberChapter: numberChapter - i })
      .select('_id')
      .exec()
    previousId = previous?._id.toString() ?? null
    i++
  }

  return previousId
}

const getNextIdChapter = async (
  bookId: string,
  numberChapter: number,
  totalChapter: number
): Promise<string | null> => {
  if (numberChapter >= totalChapter) {
    return null
  }

  let nextId: string | null = null
  let i = 1

  while (numberChapter + i <= totalChapter && !nextId) {
    const next = await ChapterModel.findOne({ bookId, numberChapter: numberChapter + i })
      .select('_id')
      .exec()
    nextId = next?._id.toString() ?? null
    i++
  }

  return nextId
}

export const getChapterInfo = async (chapterId: string): Promise<GetDataChapter> => {
  const data = await ChapterModel.findByIdAndUpdate(chapterId, { $inc: { views: 1 } }, { new: true })
  if (!data) throw 'error getchapterInfo service'

  const { numberChapter, bookId } = data
  const chapters = await booksServices.getChaptersBookById(bookId)
  const [content, previousId, nextId] = await Promise.all([
    getContent(bookId, chapterId),
    getPreviousIdChapter(bookId, numberChapter),
    getNextIdChapter(bookId, numberChapter, chapters),
    booksServices.increasedViewsByBookId(bookId)
  ])

  return { ...data.toJSON(), content, previousId, nextId }
}

export const createChapterByBookId = async (bookId: string, values: Omit<Chapter, '_id'>): Promise<Chapter> => {
  const exitsChapter = await ChapterModel.findOne({ bookId, numberChapter: values.numberChapter })
  if (exitsChapter) return exitsChapter.toObject()

  const chapter = new ChapterModel(values)
  return chapter.save().then((savedChapter) => savedChapter.toObject())
}

export const getLastUpdateChapter = async ({
  page,
  limit,
  filter
}: GetLastUpdateChapter): Promise<GetChaptersLastUpdated> => {
  const { categories } = filter
  const pipelineStages: any[] = [
    {
      $project: {
        _id: 1,
        name: 1,
        cover: 1,
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

  if (categories && categories.length > 0) {
    pipelineStages.unshift({
      $match: {
        categories: { $in: categories }
      }
    })
  }

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
    const chapterLast = await ChapterModel.findOne({ bookId: book._id, numberChapter: book.chapters })

    return {
      bookId: book._id,
      cover: book.cover,
      nameBook: book.name,
      chapters: book.chapters,
      views: book.views,
      chapterId: chapterLast?._id,
      nameChapter: chapterLast?.title,
      numberChapter: chapterLast?.numberChapter,
      createdAt: book.updatedAt
    }
  })

  const promiseDataLastUpdated = (await Promise.all(dataLastUpdated)) as ChaptersLastUpdated[]

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
