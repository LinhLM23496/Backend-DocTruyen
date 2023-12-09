import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '~/constants/httpStatus'
import { Messages } from '~/constants/message'
import { blockUserById, getUserById, getUsers, updateUserById } from '~/models/database/User'
import { deleteUserTokenByUserId } from '~/models/database/UserToken'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers()

    return res.status(HttpStatus.OK).json({ error: 0, data: users, message: Messages.GET_ALL_USERS_SUCCESS })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
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
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { id, username } = req.query

    if (!id || typeof id !== 'string' || !username)
      return res.status(HttpStatus.FORBIDDEN).json({ error: 1, message: Messages.FIELD_ID_REQUIRED })

    const user = await updateUserById(id, { username })

    if (!user) return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })

    return res.status(HttpStatus.OK).json({ error: 0, data: user, message: Messages.UPDATE_USER_SUCCESS })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query

    if (!id || typeof id !== 'string')
      return res.status(HttpStatus.FORBIDDEN).json({ error: 1, message: Messages.FIELD_ID_REQUIRED })

    const userBlocked = await blockUserById(id)

    if (!userBlocked) return res.status(HttpStatus.BAD_REQUEST).json({ error: 1, message: Messages.USER_NOT_EXIST })

    await deleteUserTokenByUserId(id)

    return res.status(HttpStatus.OK).json({ error: 0, data: userBlocked, message: Messages.DELETE_USER_SUCCESS })
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}
