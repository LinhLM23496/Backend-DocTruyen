import { Document, Schema, model } from 'mongoose'

export interface Book {
  name: string
  author: string
  description?: string
  cover?: string
  banner?: string
  categories?: string[]
  chapters?: number
  views?: number
  likes?: number
  status: number
  url: string
  createdBy?: string
  updatedAt?: Date
  createdAt?: Date
}

export interface BookDocument extends Book, Document {}

const BookSchema = new Schema<BookDocument>(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    cover: { type: String, trim: true },
    banner: { type: String, trim: true },
    categories: { type: [String], default: ['other'] },
    chapters: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    status: { type: Number, default: 0 },
    url: { type: String, default: '' },
    createdBy: { type: String },
    updatedAt: {
      type: Date,
      default: new Date()
    },
    createdAt: {
      type: Date,
      default: new Date()
    }
  },
  { toObject: { useProjection: true } }
)

export const BookModel = model<BookDocument>('Book', BookSchema)
