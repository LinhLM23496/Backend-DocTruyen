import { Document, Schema, model } from 'mongoose'

export interface User {
  email: string
  displayName: string
  roles: string[]
  password: string
  status: 'active' | 'block'
  updatedAt?: Date
  createdAt?: Date
  fcmToken?: string
}

export interface UserDocument extends User, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true },
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
    },
    updatedAt: { type: Date, default: new Date() },
    createdAt: { type: Date, default: new Date() },
    fcmToken: { type: String }
  },
  { toObject: { useProjection: true } }
)

export const UserModel = model<UserDocument>('User', UserSchema)
