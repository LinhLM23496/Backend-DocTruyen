import { Document, ObjectId, Schema, model } from 'mongoose'

export interface Notification {
  user: Schema.Types.ObjectId
  createdBy: Schema.Types.ObjectId
  title: string
  body: string
  data?: object
  isRead?: boolean
  updatedAt?: Date
  createdAt?: Date
}

export interface NotificationDocument extends Notification, Document {}

const NotificationSchema = new Schema<NotificationDocument>({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: Object },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  isRead: { type: Boolean, default: false },
  updatedAt: { type: Date, default: new Date() },
  createdAt: { type: Date, default: new Date() }
})

export const NotificationModel = model<NotificationDocument>('Notification', NotificationSchema)
