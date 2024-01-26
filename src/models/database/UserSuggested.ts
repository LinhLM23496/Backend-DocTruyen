import { Document, Schema, model } from 'mongoose'

export type DataSuggestions = {
  name: string
  description?: string
  author?: string
  url?: string
  status?: 0 | 1 | 2
  createdAt?: Date
}

// 0: pending
// 1: accepted
// 2: rejected

export interface UserSuggested {
  userId: Schema.Types.ObjectId
  type: 'book' | 'function'
  data: DataSuggestions[]
  updatedAt?: Date
  createdAt?: Date
}

export interface UserSuggestedDocument extends UserSuggested, Document {}

const UserSuggestedSchema = new Schema<UserSuggestedDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  data: [
    {
      name: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      author: {
        type: String
      },
      url: {
        type: String
      },
      status: {
        type: Number,
        default: 0
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export const UserSuggestedModel = model<UserSuggestedDocument>('UserSuggested', UserSuggestedSchema)
