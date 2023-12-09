import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '~/constants/httpStatus'
import { Messages } from '~/constants/message'
import { getBookById } from '~/models/database/Book'
import { getChapterByBookIdAndNumChapter, getChapterById } from '~/models/database/Chapter'

export const isOwnerChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: currentUserId } = req.user as JwtPayload
    const { bookId, chapterId } = req.body

    if (!bookId || typeof bookId !== 'string' || !chapterId || typeof chapterId !== 'string') {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.FIELD_BOOKID_CHAPERID_REQUIRED })
    }

    const book = await getBookById(bookId)

    if (!book) return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.BOOK_NOT_EXIST })

    if (!currentUserId || currentUserId.toString() !== book?.createdBy?.toString()) {
      return res.status(HttpStatus.FORBIDDEN).send({ error: 1, message: Messages.HTTP_403_FORBIDDEN })
    }

    const chapter = await getChapterById(chapterId)

    if (!chapter) return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.CHAPTER_NOT_EXIST })

    if (!currentUserId || currentUserId.toString() !== chapter?.createdBy?.toString()) {
      return res.status(HttpStatus.FORBIDDEN).send({ error: 1, message: Messages.HTTP_403_FORBIDDEN })
    }

    if (chapter?.bookId?.toString() !== bookId) {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.CHAPTER_NOT_EXIST_IN_BOOK })
    }

    return next()
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const isHaveNumberChapter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId, numberChapter } = req.body

    if (!bookId || typeof bookId !== 'string' || !numberChapter || typeof numberChapter !== 'number') {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    const chapter = await getChapterByBookIdAndNumChapter(bookId, numberChapter)

    if (chapter) return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.CHAPTER_ALREADY_EXIST })

    return next()
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}
