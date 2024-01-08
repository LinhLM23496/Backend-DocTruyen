import bcrypt from 'bcrypt'
import { Response } from 'express'
import { HttpStatus, Messages } from '~/constants'

const SALT_ROUND = process.env.SALT_ROUND ?? 10

export const random = async () => await bcrypt.genSalt(Number(process.env.SALT))

export const generateHashPassword = async (password: string) => await bcrypt.hash(password, SALT_ROUND)

export const sendInternalServerError = (res: Response) => {
  return res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
}

export const sendUnauthorized = (res: Response) => {
  return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.HTTP_401_UNAUTHORIZED })
}

export const generateRandomNumber = () => {
  const min = 111111
  const max = 999999
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min

  return randomNumber
}
