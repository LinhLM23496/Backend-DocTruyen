import { sign } from 'jsonwebtoken'
import { userTokensServices } from '~/services'

export const generateTokens = async (user: any) => {
  try {
    const payload = { _id: user._id, roles: user.roles }
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? ''
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? ''
    const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE ?? '10m'
    const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE ?? '30d'
    const accessToken = sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE })
    const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFE })

    await userTokensServices.deleteUserTokenByUserId(user._id)

    await userTokensServices.createUserToken({ userId: user._id, token: refreshToken })
    return Promise.resolve({ accessToken, refreshToken })
  } catch (error) {
    return Promise.reject(error)
  }
}
