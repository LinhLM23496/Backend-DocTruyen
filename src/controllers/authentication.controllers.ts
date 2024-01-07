import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { HttpStatus, Messages } from '~/constants'
import {
  checkExistEmoji,
  generateHashPassword,
  generateTokens,
  sendInternalServerError,
  validatePassword,
  validateSpace,
  validateSpecialCharacter,
  validateTextMaxLength,
  validateTextMinLength,
  validateUserName
} from '~/utils'
import { usersServices } from '~/services'

export const login = async (req: Request, res: Response) => {
  try {
    const { userName, password } = req.body

    if (!userName || typeof userName !== 'string' || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    if (!validateUserName(userName)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.INVALID_USERNAME_PASSWORD })
    }

    const user = await usersServices.getUserByUserName(userName.toLowerCase().trim()).select('+password')

    if (!user || !user.password) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.INVALID_USERNAME_PASSWORD })
    }

    const verifiedPassword = await bcrypt.compare(req.body.password, user.password)

    if (!verifiedPassword) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.INVALID_USERNAME_PASSWORD })
    }

    const { accessToken, refreshToken } = await generateTokens(user)

    return res.status(HttpStatus.OK).json({
      error: 0,
      data: { accessToken, refreshToken },
      message: Messages.LOGIN_SUCCESSFUL
    })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { userName, password, displayName } = req.body

    if (!userName || typeof userName !== 'string' || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    if (!validateUserName(userName) || !validatePassword(password)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.INVALID_USERNAME_PASSWORD })
    }

    const existingUser = await usersServices.getUserByUserName(userName.toLowerCase().trim())

    if (existingUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.EMAIL_ALREADY_EXIST })
    }

    const hashPassword = await generateHashPassword(password)

    const user = await usersServices.createUser({
      userName,
      displayName,
      password: hashPassword
    })

    return res.status(HttpStatus.CREATED).json({ error: 0, data: user, message: Messages.HTTP_201_CREATED })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
