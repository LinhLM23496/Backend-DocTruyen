import express from 'express'
import {
  createChapterByBookId,
  deleteChapterByBookId,
  getAllChaptersByBookId,
  getChapter,
  getChapter2,
  getChapterLastUpdate,
  updateChapterByBookId
} from '~/controllers/chapters.controllers'
import { isOwnerBook } from '~/middlewares/book.middlewares'
import { isHaveNumberChapter, isOwnerChapter } from '~/middlewares/chapter.middlewares'
import { isAuthenticated } from '~/middlewares/user.middlewares'

export default (router: express.Router) => {
  router.get('/chapters', getAllChaptersByBookId)
  router.get('/chapter/:id', getChapter)
  router.get('/chapter', getChapter2)
  router.post('/chapter', isAuthenticated, isOwnerBook, isHaveNumberChapter, createChapterByBookId)
  router.put('/chapter', isAuthenticated, isOwnerChapter, updateChapterByBookId)
  router.delete('/chapter', isAuthenticated, isOwnerChapter, deleteChapterByBookId)
  router.get('/chapters/last-update', getChapterLastUpdate)
}
