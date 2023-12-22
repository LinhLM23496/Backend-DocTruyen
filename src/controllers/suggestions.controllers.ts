import { Request, Response } from 'express'
import { HttpStatus } from '~/constants/httpStatus'
import { Messages } from '~/constants/message'
import { getListSuggestions } from '~/services/suggestions.services'
import { sendInternalServerError } from '~/utils/helpers'

const LIMIT_SUGGESTION = 4
export const getSuggestions = async (req: Request, res: Response) => {
  try {
    const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : LIMIT_SUGGESTION
    const books = await getListSuggestions({ limit })

    return res.status(HttpStatus.OK).json({ error: 0, data: books, message: Messages.GET_SUGGESTION_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
