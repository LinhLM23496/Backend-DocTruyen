import express from 'express'
import { createUser, getUserByEmail, getUserById } from '~/models/database/User'
import { generateHashPassword } from '~/utils/helpers'
import bcrypt from 'bcrypt'
import generateTokens from '~/utils/generateTokens'
import { Messages } from '~/constants/message'
import { HttpStatus } from '~/constants/httpStatus'

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    const user = await getUserByEmail(email).select('+password')

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
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body

    if (!email || !password || !username) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.EMAIL_ALREADY_EXIST })
    }

    const hashPassword = await generateHashPassword(password)

    const user = await createUser({
      email,
      username,
      password: hashPassword
    })

    return res.status(HttpStatus.CREATED).json({ error: 0, data: user, message: Messages.HTTP_201_CREATED })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}
