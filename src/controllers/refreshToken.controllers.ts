import express from 'express'
import jwt from 'jsonwebtoken'
import { HttpStatus } from '~/constants/httpStatus'
import { Messages } from '~/constants/message'
import { sendInternalServerError } from '~/utils/helpers'
import verifyRefreshToken from '~/utils/verifyRefreshToken'

export const refreshToken = async (req: express.Request, res: express.Response) => {
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
