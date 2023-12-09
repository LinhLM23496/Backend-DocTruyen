import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '~/constants/httpStatus'
import { Messages } from '~/constants/message'
import { getBookById } from '~/models/database/Book'

export const isOwnerBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: currentUserId } = req.user as JwtPayload
    const { bookId } = req.body

    if (!bookId || typeof bookId !== 'string') {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.FIELD_BOOKID_REQUIRED })
    }

    const book = await getBookById(bookId)

    if (!book) return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.BOOK_NOT_EXIST })

    if (!currentUserId || currentUserId.toString() !== book?.createdBy?.toString()) {
      return res.status(HttpStatus.FORBIDDEN).send({ error: 1, message: Messages.HTTP_403_FORBIDDEN })
    }

    return next()
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}
