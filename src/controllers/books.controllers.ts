import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus, LIMIT, Messages, PAGE } from '~/constants'
import { booksServices, chaptersServices } from '~/services'
import { sendInternalServerError } from '~/utils'

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : PAGE
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : LIMIT
    const categories = Array.isArray(req.query.categories) ? (req.query.categories as string[]) : []
    const filter = {
      search: req.query.search?.toString() || '',
      categories,
      order: req.query.order?.toString(),
      odir: req.query.odir?.toString()
    }

    const { data, paging } = await booksServices.getAllBook({ page, limit, filter })

    return res.status(HttpStatus.OK).json({ error: 0, data, paging, message: Messages.GET_ALL_BOOKS_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const getAllMyBooks = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user as JwtPayload
    const books = await booksServices.getMyBooks(_id)

    return res.status(HttpStatus.OK).json({ error: 0, data: books, message: Messages.GET_ALL_BOOKS_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const getBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.query

    if (!bookId || typeof bookId !== 'string') {
      return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.FIELD_BOOKID_REQUIRED })
    }

    const book = await booksServices.getBookById(bookId)

    if (!book) return res.status(HttpStatus.BAD_REQUEST).send({ error: 1, message: Messages.BOOK_NOT_EXIST })

    const chapters = await chaptersServices.countChaptersByBookId(bookId)

    const chapterId = await chaptersServices.getFirstLastChapterIdByBookId(bookId)

    const data = { ...book.toJSON(), chapters, ...chapterId }

    return res.status(HttpStatus.OK).json({
      error: 0,
      data,
      message: Messages.GET_BOOK_SUCCESS
    })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const createBookDetail = async (req: Request, res: Response) => {
  try {
    const { name, author, description, cover, banner, categories } = req.body
    const { _id } = req.user as JwtPayload

    if (!name || !author || !cover) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    const data: any = { name, author, cover, createdBy: _id }

    if (description) data['description'] = description
    if (banner) data['banner'] = banner
    if (categories) data['categories'] = categories

    const book = await booksServices.createBook(data)

    if (!book)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 1, message: Messages.ERROR_OCCURRED_RETRY_LATER })

    return res.status(HttpStatus.CREATED).json({ error: 0, data: book, message: Messages.HTTP_201_CREATED })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const updateBookDetail = async (req: Request, res: Response) => {
  try {
    const { bookId, name, author, description, cover, banner, categories } = req.body
    const data: any = {}

    if (name) data['name'] = name
    if (author) data['author'] = author
    if (description) data['description'] = description
    if (cover) data['cover'] = cover
    if (banner) data['banner'] = banner
    if (categories) data['categories'] = categories

    if (Object.keys(data).length === 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    data['updatedAt'] = new Date()

    const updatedBook = await booksServices.updateBookById(bookId, data)

    if (!updatedBook)
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 1, message: Messages.ERROR_OCCURRED_RETRY_LATER })

    return res.status(HttpStatus.OK).json({ error: 0, data: updatedBook, message: Messages.UPDATE_BOOK_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const deleteBookDetail = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.body

    await booksServices.deleteBookById(bookId)

    await chaptersServices.deleteMutilChaptersByBookId(bookId)

    return res.status(HttpStatus.OK).json({ error: 0, message: Messages.DELETE_BOOK_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const getSuggestions = async (req: Request, res: Response) => {
  const LIMIT_SUGGESTION = 4
  try {
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : LIMIT_SUGGESTION
    const books = await booksServices.getListSuggestions({ limit })

    return res.status(HttpStatus.OK).json({ error: 0, data: books, message: Messages.GET_SUGGESTION_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
