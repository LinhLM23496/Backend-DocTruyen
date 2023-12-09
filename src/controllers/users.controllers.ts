import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '~/constants/httpStatus'
import { Messages } from '~/constants/message'
import { UserModel } from '~/models/database/User'
import { deleteUserTokenByUserId } from '~/services/userTokens.services'
import { blockUserById, getUserById, updateUserById } from '~/services/users.services'
import { sendInternalServerError } from '~/utils/helpers'
import { paginateResults } from '~/utils/pagination'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const filter = {
      // status: 'active'
    }
    const { paging, results: users } = await paginateResults(UserModel, req, filter)

    return res.status(HttpStatus.OK).json({ error: 0, data: users, paging, message: Messages.GET_ALL_USERS_SUCCESS })
  } catch (error) {
    console.log('error :>> ', error)
    return sendInternalServerError(res)
  }
}

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const { id } = req.query

    if (!id || typeof id !== 'string') {
      const { _id: currentUserId } = req.user as JwtPayload

      const user = await getUserById(currentUserId)

      if (!user) return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })

      return res.status(HttpStatus.OK).json({ error: 0, data: user, message: Messages.GET_USER_INFO_SUCCESS })
    }

    const user = await getUserById(id)

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

    const user = await updateUserById(id, { username })

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

    const userBlocked = await blockUserById(id)

    if (!userBlocked) return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })

    await deleteUserTokenByUserId(id)

    return res.status(HttpStatus.OK).json({ error: 0, message: Messages.DELETE_USER_SUCCESS })
  } catch (error) {
    return sendInternalServerError(res)
  }
}
