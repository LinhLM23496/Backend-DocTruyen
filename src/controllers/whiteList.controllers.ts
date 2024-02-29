import { Request, Response } from 'express'
import { HttpStatus, Messages } from '~/constants'
import { booksServices } from '~/services'
import { sendInternalServerError } from '~/utils'

export const getWhiteList = async (req: Request, res: Response) => {
  try {
    const categories = await booksServices.getCategories()

    return res.status(HttpStatus.OK).json({ error: 0, data: { categories }, message: Messages.HTTP_200_OK })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
