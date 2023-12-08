import jwt from 'jsonwebtoken'
import { UserTokenModel, getUserTokenByToken } from '~/models/database/UserToken'

const verifyRefreshToken = (refreshToken: string) => {
  const privateKey = process.env.REFRESH_TOKEN_SECRET ?? ''

  return new Promise((resolve, reject) => {
    getUserTokenByToken(refreshToken)
      .then((userToken) => {
        if (!userToken) return reject({ error: 1, message: 'Invalid refresh token' })
        jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
          if (err) return reject({ error: true, message: 'Invalid refresh token' })
          resolve({
            tokenDetails,
            error: 0,
            message: 'Valid refresh token'
          })
        })
      })
      .catch(() => reject({ error: 1, message: 'Invalid refresh token' }))
  })
}

export default verifyRefreshToken
