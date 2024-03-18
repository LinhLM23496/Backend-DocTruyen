import { UserToken, UserTokenDocument, UserTokenModel } from '~/models/database/UserToken'

export const createUserToken = async (values: UserToken): Promise<UserTokenDocument> => {
  const userToken = new UserTokenModel({ ...values, createdAt: new Date() })
  return userToken.save().then((savedUserToken) => savedUserToken.toObject())
}

export const getUserTokenByUserId = async (userId: string): Promise<UserTokenDocument | null> => {
  return UserTokenModel.findOne({ userId }).exec()
}

export const getUserTokenByToken = async (token: string): Promise<UserTokenDocument | null> => {
  return UserTokenModel.findOne({ token }).exec()
}

export const deleteUserTokenByUserId = async (userId: string): Promise<UserTokenDocument | null> => {
  return UserTokenModel.findOneAndDelete({ userId }).exec()
}
