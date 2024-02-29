import express from 'express'
import { getWhiteList } from '~/controllers/whiteList.controllers'

export default (router: express.Router) => {
  router.get('/white-list', getWhiteList)
}
