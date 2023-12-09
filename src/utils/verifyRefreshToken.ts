import jwt from 'jsonwebtoken'
import { Messages } from '~/constants/message'
import { getUserTokenByToken } from '~/models/database/UserToken'

const verifyRefreshToken = (refreshToken: string) => {
  const privateKey = process.env.REFRESH_TOKEN_SECRET ?? ''

  return new Promise((resolve, reject) => {
    getUserTokenByToken(refreshToken)
      .then((userToken) => {
        if (!userToken) return reject({ error: 1, message: Messages.INVALID_REFRESH_TOKEN })
        jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
          if (err) return reject({ error: 1, message: Messages.INVALID_REFRESH_TOKEN })
          resolve({
            tokenDetails,
            error: 0,
            message: Messages.VALID_REFRESH_TOKEN
          })
        })
      })
      .catch(() => reject({ error: 1, message: Messages.INVALID_REFRESH_TOKEN }))
  })
}

export default verifyRefreshToken
