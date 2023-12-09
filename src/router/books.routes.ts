import express from 'express'
import { createBookDetail, deleteBookDetail, getAllBooks, updateBookDetail } from '~/controllers/books.controllers'
import { isAuthenticated, isOwner } from '~/middlewares'

export default (router: express.Router) => {
  router.get('/books', getAllBooks)
  router.post('/books/information', isAuthenticated, createBookDetail)
  router.put('/books/information', isAuthenticated, updateBookDetail)
  router.delete('/books/information', isAuthenticated, deleteBookDetail)
}
