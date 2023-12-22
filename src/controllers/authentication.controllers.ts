import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { HttpStatus, Messages } from '~/constants'
import { generateHashPassword, generateTokens, sendInternalServerError } from '~/utils'
import { usersServices } from '~/services'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    const user = await usersServices.getUserByEmail(email).select('+password')

    if (!user || !user.password) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.INVALID_EMAIL_PASSWORD })
    }

    const verifiedPassword = await bcrypt.compare(req.body.password, user.password)

    if (!verifiedPassword) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.INVALID_EMAIL_PASSWORD })
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
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    const existingUser = await usersServices.getUserByEmail(email)

    if (existingUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.EMAIL_ALREADY_EXIST })
    }

    const hashPassword = await generateHashPassword(password)

    const user = await usersServices.createUser({
      email,
      username,
      password: hashPassword
    })

    return res.status(HttpStatus.CREATED).json({ error: 0, data: user, message: Messages.HTTP_201_CREATED })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
