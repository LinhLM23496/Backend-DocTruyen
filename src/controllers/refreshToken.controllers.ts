import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { HttpStatus, Messages } from '~/constants'
import { sendInternalServerError, verifyRefreshToken } from '~/utils'

export const refreshToken = async (req: Request, res: Response) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? ''
  const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE ?? ''

  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }: any) => {
      const payload = { _id: tokenDetails._id, roles: tokenDetails.roles }
      const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE })

      res.status(HttpStatus.OK).json({
        error: 0,
        data: { accessToken },
        message: Messages.ACCESS_TOKEN_CREATED
      })
    })
    .catch(() => {
      return sendInternalServerError(res)
    })
}
