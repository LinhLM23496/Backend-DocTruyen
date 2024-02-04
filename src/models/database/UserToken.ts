import { Document, Schema, model, Model } from 'mongoose'

export interface UserToken {
  userId: Schema.Types.ObjectId
  token: string
  createdAt?: Date
}

export interface UserTokenDocument extends UserToken, Document {}

const UserTokenSchema = new Schema<UserTokenDocument>({
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
    default: new Date(),
    expires: 30 * 86400 // 30 days
  }
})

export const UserTokenModel = model<UserTokenDocument>('UserToken', UserTokenSchema)
