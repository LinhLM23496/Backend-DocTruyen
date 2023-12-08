import mongoose from 'mongoose'

const Schema = mongoose.Schema

const UserTokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400 // 30 days
  }
})

export const UserTokenModel = mongoose.model('UserToken', UserTokenSchema)

export const createUserToken = (values: Record<string, any>) =>
  new UserTokenModel(values).save().then((userToken) => userToken.toObject())

export const getUserTokenByUserId = (userId: string) => UserTokenModel.findOne({ userId })

export const getUserTokenByToken = (token: string) => UserTokenModel.findOne({ token })
