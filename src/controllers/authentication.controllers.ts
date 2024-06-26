import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { EXPIRED_TIMES, HttpStatus, Messages } from '~/constants'
import {
  generateHashPassword,
  generateRandomNumber,
  generateTokens,
  sendInternalServerError,
  sendMail,
  validateEmail,
  validatePassword
} from '~/utils'
import { usersServices, verifyCodesServices } from '~/services'
import { GetVerifyCodeParams } from '~/services/verifyCodes.services'

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, fcmToken } = req.body

    if (!email || typeof email !== 'string' || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    if (!validateEmail(email)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.INVALID_EMAIL_PASSWORD })
    }

    const user = await usersServices.getUserByEmail(email.toLowerCase().trim()).select('+password')

    if (!user || !user.password) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.INVALID_EMAIL_PASSWORD })
    }

    const verifiedPassword = await bcrypt.compare(req.body.password, user.password)

    if (!verifiedPassword) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.INVALID_EMAIL_PASSWORD })
    }

    const [token, _] = await Promise.all([
      generateTokens(user),
      fcmToken && fcmToken?.length > 0 && usersServices.updateUserById(user._id, { fcmToken })
    ])

    const data = {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt
    }

    return res.status(HttpStatus.OK).json({
      error: 0,
      data: { token, userInfo: data, message: Messages.LOGIN_SUCCESSFUL },
      message: Messages.LOGIN_SUCCESSFUL
    })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body

    if (!email || typeof email !== 'string' || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.INVALID_EMAIL_PASSWORD })
    }

    const existingUser = await usersServices.getUserByEmail(email.toLowerCase().trim())

    if (existingUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.EMAIL_ALREADY_EXIST })
    }

    const hashPassword = await generateHashPassword(password)

    const user = await usersServices.createUser({
      email,
      displayName,
      password: hashPassword,
      updatedAt: new Date(),
      createdAt: new Date()
    })

    return res.status(HttpStatus.CREATED).json({ error: 0, data: user, message: Messages.HTTP_201_CREATED })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email || typeof email !== 'string') {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    if (!validateEmail(email)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.INVALID_EMAIL_PASSWORD })
    }

    const existingUser = await usersServices.getUserByEmail(email.toLowerCase().trim())

    if (!existingUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })
    }

    await verifyCodesServices.deleteVerifyCodeByUserIdType({
      userId: existingUser._id,
      type: 'forgotPassword'
    })

    const numberRandom = generateRandomNumber()
    const data: GetVerifyCodeParams = {
      userId: existingUser._id,
      code: numberRandom,
      type: 'forgotPassword'
    }

    await Promise.all([verifyCodesServices.createVerifyCode(data), sendMail({ email, ...data })])

    return res
      .status(HttpStatus.OK)
      .json({ error: 0, data: Messages.SENDED_CODE_EMAIL, message: Messages.SENDED_CODE_EMAIL })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const changePasswordByCode = async (req: Request, res: Response) => {
  try {
    const { email, password, code } = req.body

    if (!email || !password || !code) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.INVALID_EMAIL_PASSWORD })
    }

    const existingUser = await usersServices.getUserByEmail(email.toLowerCase().trim())

    if (!existingUser) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })
    }

    const data: GetVerifyCodeParams = {
      userId: existingUser._id,
      code,
      type: 'forgotPassword'
    }

    const currentDate = new Date()
    const verifyCode = await verifyCodesServices.getVerifyCodeByData(data)

    if (
      !verifyCode ||
      !verifyCode?.createdAt ||
      currentDate.getTime() - verifyCode?.createdAt.getTime() <= EXPIRED_TIMES
    ) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.INVALID_CODE })
    }

    const hashPassword = await generateHashPassword(password)

    await Promise.all([
      usersServices.updateUserById(existingUser._id, { password: hashPassword, updatedAt: new Date() }),
      verifyCodesServices.deleteVerifyCodeById(verifyCode._id)
    ])

    return res
      .status(HttpStatus.OK)
      .json({ error: 0, data: Messages.UPDATE_PASSWORD_SUCCESS, message: Messages.UPDATE_PASSWORD_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
