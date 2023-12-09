import express from 'express'
import {
  createBookDetail,
  deleteBookDetail,
  getAllBooks,
  getAllMyBooks,
  getBook,
  updateBookDetail
} from '~/controllers/books.controllers'
import { isOwnerBook } from '~/middlewares/book.middlewares'
import { isAuthenticated, roleCheck } from '~/middlewares/user.middlewares'

export default (router: express.Router) => {
  router.get('/books', getAllBooks)
  router.get('/my-books', isAuthenticated, getAllMyBooks)
  router.get('/book', getBook)
  router.post('/book', isAuthenticated, roleCheck(['user']), createBookDetail)
  router.put('/book', isAuthenticated, isOwnerBook, updateBookDetail)
  router.delete('/book', isAuthenticated, isOwnerBook, deleteBookDetail)
}
