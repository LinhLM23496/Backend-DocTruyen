import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus, LIMIT, Messages, PAGE } from '~/constants'
import { booksServices, chaptersServices } from '~/services'
import { sendInternalServerError } from '~/utils'

export const getAllChaptersByBookId = async (req: Request, res: Response) => {
  try {
    const { bookId, page: pageReq, limit: limitReq } = req.query
    const page = typeof pageReq === 'string' ? parseInt(pageReq) : PAGE
    const limit = typeof limitReq === 'string' ? parseInt(limitReq) : LIMIT
    const odir = req.query.odir === 'desc' ? 'descending' : 'ascending'

    if (!bookId || typeof bookId !== 'string') {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.FIELD_BOOKID_REQUIRED })
    }

    const book = await booksServices.getBookById(bookId)

    if (!book) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.BOOK_NOT_EXIST })
    }

    const chapters = await chaptersServices.getChaptersByBookId({
      bookId,
      page,
      limit,
      odir
    })

    return res.status(HttpStatus.OK).json({ error: 0, data: chapters, message: Messages.GET_ALL_BOOKS_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const getChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.query

    if (!chapterId || typeof chapterId !== 'string') {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.FIELD_CHAPTERID_REQUIRED })
    }

    const chapter = await chaptersServices.getChapterInfo(chapterId)

    if (!chapter) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.CHAPTER_NOT_EXIST })
    }

    return res.status(HttpStatus.OK).json({ error: 0, data: chapter, message: Messages.GET_CHAPTER_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const createChapterByBookId = async (req: Request, res: Response) => {
  try {
    const { bookId, title, numberChapter, description, cover } = req.body
    const { _id } = req.user as JwtPayload

    if (!bookId || !title || !numberChapter) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    const data: any = { title, numberChapter, bookId, createdBy: _id }

    if (description) data['description'] = description
    if (cover) data['cover'] = cover

    const chapter = await chaptersServices.createChapter(data)

    if (!chapter)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 1, message: Messages.ERROR_OCCURRED_RETRY_LATER })

    return res.status(HttpStatus.CREATED).json({ error: 0, data: chapter, message: Messages.HTTP_201_CREATED })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const updateChapterByBookId = async (req: Request, res: Response) => {
  try {
    const { chapterId, title, description, cover } = req.body
    const data: any = {}

    if (title) data['title'] = title
    if (description) data['description'] = description
    if (cover) data['cover'] = cover

    if (Object.keys(data).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    data['updatedAt'] = new Date()

    const updatedChapter = await chaptersServices.updateChapterById(chapterId, data)

    if (!updatedChapter)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 1, message: Messages.ERROR_OCCURRED_RETRY_LATER })

    return res
      .status(HttpStatus.OK)
      .json({ error: 0, data: Messages.UPDATE_CHAPTER_SUCCESS, message: Messages.UPDATE_CHAPTER_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const deleteChapterByBookId = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.body

    await chaptersServices.deleteChapterById(chapterId)

    return res
      .status(HttpStatus.OK)
      .json({ error: 0, data: Messages.DELETE_CHAPTER_SUCCESS, message: Messages.DELETE_CHAPTER_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const getChapterLastUpdate = async (req: Request, res: Response) => {
  try {
    const { page: pageReq, limit: limitReq } = req.query
    const page = typeof pageReq === 'string' ? parseInt(pageReq) : PAGE
    const limit = typeof limitReq === 'string' ? parseInt(limitReq) : LIMIT
    const filter = {
      categories: (req.query.categories as string[]) ?? []
    }

    const { data, paging } = await chaptersServices.getLastUpdateChapter({ page, limit, filter })

    return res.status(HttpStatus.OK).json({ error: 0, data, paging, message: Messages.GET_LAST_UPDATE_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
