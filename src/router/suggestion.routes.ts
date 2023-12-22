import express from 'express'
import { getSuggestions } from '~/controllers/suggestions.controllers'

export default (router: express.Router) => {
  router.get('/suggestion', getSuggestions)
}
