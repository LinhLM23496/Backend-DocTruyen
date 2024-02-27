import { Document, Schema, model } from 'mongoose'

export interface Like {
  user: Schema.Types.ObjectId
  book: Schema.Types.ObjectId
  createdAt?: Date
}

export interface LikeDocument extends Like, Document {}

const LikeSchema = new Schema<LikeDocument>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  book: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Book'
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
})

export const LikeModel = model<LikeDocument>('Like', LikeSchema)
