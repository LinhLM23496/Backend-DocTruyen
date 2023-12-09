import { Document, Schema, model, Model, Query } from 'mongoose'

export interface User {
  username: string
  email: string
  roles: string[]
  password: string
  status: 'active' | 'block'
}

export interface UserDocument extends User, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    roles: {
      type: [String],
      enum: ['user', 'admin', 'super_admin'],
      default: ['user']
    },
    password: { type: String, required: true, select: false },
    status: {
      type: String,
      enum: ['active', 'block'],
      default: 'active',
      select: false
    }
  },
  { toObject: { useProjection: true } }
)

export const UserModel = model<UserDocument>('User', UserSchema)
