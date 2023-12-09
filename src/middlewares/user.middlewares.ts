import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { HttpStatus } from '~/constants/httpStatus'
import { Messages } from '~/constants/message'

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers.authorization

  if (!bearerToken) {
    return res.status(HttpStatus.FORBIDDEN).json({ error: 1, message: Messages.HTTP_403_FORBIDDEN })
  }

  const accessTokenHeader = bearerToken.split(' ')[1]

  try {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? ''
    const tokenDetails = jwt.verify(accessTokenHeader, ACCESS_TOKEN_SECRET)

    if (!tokenDetails) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.HTTP_401_UNAUTHORIZED })
    }

    req.user = tokenDetails
    return next()
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ error: 1, message: Messages.HTTP_401_UNAUTHORIZED })
  }
}

export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { _id: currentUserId } = req.user as JwtPayload
    const { id } = req.body

    if (!currentUserId || currentUserId.toString() !== id) {
      return res.status(HttpStatus.FORBIDDEN).send({ error: 1, message: Messages.HTTP_403_FORBIDDEN })
    }

    return next()
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({ error: 1, message: Messages.HTTP_500_INTERNAL_SERVER_ERROR })
  }
}

type RoleType = 'user' | 'admin' | 'super_admin'

export const roleCheck = (roles: RoleType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload

    roles.push('user')
    if (user && user.roles && user.roles.includes(...roles)) {
      next()
    } else {
      res.status(HttpStatus.FORBIDDEN).json({ error: 1, message: Messages.HTTP_403_FORBIDDEN })
    }
  }
}
