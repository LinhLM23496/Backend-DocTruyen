import { Document, Schema, model, Model, Query } from 'mongoose'

export interface User {
  userName: string
  displayName: string
  roles: string[]
  password: string
  status: 'active' | 'block'
}

export interface UserDocument extends User, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    userName: { type: String, required: true },
    displayName: { type: String },
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
