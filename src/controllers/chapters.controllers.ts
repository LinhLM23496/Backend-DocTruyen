import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '~/constants/httpStatus'
import { Messages } from '~/constants/message'
import { createBook, deleteBookById, getBookById, getBooks, updateBookById } from '~/models/database/Book'
import {
  createChapter,
  deleteChapterById,
  getChapterById,
  getChaptersByBookId,
  updateChapterById
} from '~/models/database/Chapter'

export const getAllChaptersByBookId = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.query

    if (!bookId || typeof bookId !== 'string') {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.FIELD_BOOKID_REQUIRED })
    }

    const book = await getBookById(bookId)

    if (!book) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.BOOK_NOT_EXIST })
    }

    const chapters = await getChaptersByBookId(bookId)

    return res.status(HttpStatus.OK).json({ error: 0, data: chapters, message: Messages.GET_ALL_BOOKS_SUCCESS })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const getChapter = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.body

    if (!chapterId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.FIELD_CHAPTERID_REQUIRED })
    }
    const chapter = await getChapterById(chapterId)

    if (!chapter) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.CHAPTER_NOT_EXIST })
    }

    return res.status(HttpStatus.OK).json({ error: 0, data: chapter, message: Messages.GET_CHAPTER_SUCCESS })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
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

    const chapter = await createChapter(data)

    if (!chapter)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 1, message: Messages.ERROR_OCCURRED_RETRY_LATER })

    return res.status(HttpStatus.CREATED).json({ error: 0, data: chapter, message: Messages.HTTP_201_CREATED })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
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

    const updatedChapter = await updateChapterById(chapterId, data)

    if (!updatedChapter)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 1, message: Messages.ERROR_OCCURRED_RETRY_LATER })

    return res.status(HttpStatus.OK).json({ error: 0, data: updatedChapter, message: Messages.UPDATE_BOOK_SUCCESS })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const deleteChapterByBookId = async (req: Request, res: Response) => {
  try {
    const { chapterId } = req.body

    await deleteChapterById(chapterId)

    return res.status(HttpStatus.OK).json({ error: 0, message: Messages.DELETE_CHAPTER_SUCCESS })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}
