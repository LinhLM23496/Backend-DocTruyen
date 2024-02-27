import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus, LIMIT, Messages, PAGE } from '~/constants'
import { likesServices } from '~/services'
import { getBookById } from '~/services/books.services'
import { getRandomSentence } from '~/utils'

export const getLikes = async (req: Request, res: Response) => {
  try {
    const { _id: currentUserId } = req.user as JwtPayload
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : PAGE
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : LIMIT

    const { data, paging } = await likesServices.getAllLikesByUserId({ page, limit, userId: currentUserId })

    return res.status(HttpStatus.OK).json({ error: 0, data, paging, message: Messages.GET_ALL_LIKES_SUCCESS })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const actionLike = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params
    const { _id: currentUserId } = req.user as JwtPayload
    if (!bookId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.FIELD_ID_REQUIRED })
    }

    const exitsBook = await getBookById(bookId)

    if (!exitsBook) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: Messages.BOOK_NOT_EXIST })
    }

    const status = await likesServices.createLikebyBookId(bookId, currentUserId)

    res.status(HttpStatus.OK).json({
      message: Messages.HTTP_200_OK,
      data: { status, message: getRandomSentence(status ? Messages.LIKE_SUCCESS : Messages.UNLIKE_SUCCESS) }
    })
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}
