import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import moment from 'moment'
import { HttpStatus, Messages, TWELVE_HOURS, TYPE_SUGGESTED_OF_USER } from '~/constants'
import { UserModel } from '~/models/database/User'
import { UserSuggested } from '~/models/database/UserSuggested'
import { userSuggestedsServices, userTokensServices, usersServices } from '~/services'
import { paginateResults, sendInternalServerError } from '~/utils'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const filter = {
      // status: 'active'
    }
    const { paging, results: users } = await paginateResults(UserModel, req, filter)

    return res.status(HttpStatus.OK).json({ error: 0, data: users, paging, message: Messages.GET_ALL_USERS_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    let userId = req.query?.id

    if (!userId?.length || typeof userId !== 'string') {
      const { _id } = req.user as JwtPayload
      userId = _id as string
    }

    const user = await usersServices.getUserById(userId)

    if (!user) return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })

    return res.status(HttpStatus.OK).json({ error: 0, data: user, message: Messages.GET_USER_INFO_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { id, username } = req.body

    if (!id || typeof id !== 'string' || !username || typeof username !== 'string')
      return res.status(HttpStatus.FORBIDDEN).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })

    const user = await usersServices.updateUserById(id, { username, updatedAt: new Date() })

    if (!user) return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })

    return res.status(HttpStatus.OK).json({ error: 0, data: user, message: Messages.UPDATE_USER_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.body

    if (!id || typeof id !== 'string')
      return res.status(HttpStatus.FORBIDDEN).json({ error: 1, message: Messages.FIELD_ID_REQUIRED })

    const [userBlocked, _] = await Promise.all([
      usersServices.blockUserById(id),
      userTokensServices.deleteUserTokenByUserId(id)
    ])

    if (!userBlocked) return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })

    return res.status(HttpStatus.OK).json({ error: 0, message: Messages.DELETE_USER_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}

export const createSuggestedOfUser = async (req: Request, res: Response) => {
  try {
    const { type, name = '', description = '', author = '', url = '' } = req.body
    const { _id: currentUserId } = req.user as JwtPayload

    if (typeof type !== 'string' || !TYPE_SUGGESTED_OF_USER.includes(type) || typeof name !== 'string' || !name)
      return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.ALL_FIELDS_REQUIRED })

    const suggestedLast = await userSuggestedsServices.getSuggestedByUserId({ userId: currentUserId, type })

    const waitingTime = TWELVE_HOURS - (Date.now() - Number(suggestedLast?.createdAt) || 0)

    if (suggestedLast && waitingTime > 0) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 1,
        message: `Hãy chờ thêm ${moment.utc(waitingTime).format('HH:mm:ss')} để gợi ý cho chúng tôi nhé!`
      })
    }

    const data: UserSuggested = {
      userId: currentUserId.toString(),
      type: type as 'book' | 'function',
      data: [{ name, description, author, url }]
    }

    await userSuggestedsServices.createUserSuggested(data)

    return res
      .status(HttpStatus.OK)
      .json({ error: 0, message: Messages.HTTP_201_CREATED, data: Messages.CREATED_SUGGESTIONED })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
