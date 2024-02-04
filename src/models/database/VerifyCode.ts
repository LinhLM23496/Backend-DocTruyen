import { Document, Schema, model, Model } from 'mongoose'

export type TypeVerifyCode = 'forgotPassword' | 'test'

export interface VerifyCode {
  userId: Schema.Types.ObjectId
  code: number
  type: TypeVerifyCode
  createdAt?: Date
}

export interface VerifyCodeDocument extends VerifyCode, Document {}

const VerifyCodeSchema = new Schema<VerifyCodeDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  code: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: new Date(),
    expires: 1800 // 30 minutes
  }
})

export const VerifyCodeModel = model<VerifyCodeDocument>('VerifyCode', VerifyCodeSchema)
