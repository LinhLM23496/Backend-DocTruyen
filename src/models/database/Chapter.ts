import { Schema, model } from 'mongoose'

export interface Chapter {
  title: string
  numberChapter: number
  description?: string
  cover?: string
  views?: number
  likes?: number
  bookId: Schema.Types.ObjectId
  createdBy: Schema.Types.ObjectId
  updatedAt?: Date
  createdAt?: Date
}

export interface ChapterDocument extends Chapter, Document {}

const ChapterSchema = new Schema(
  {
    title: { type: String, require: true },
    numberChapter: { type: Number, default: 1, require: true },
    description: { type: String },
    cover: { type: String, trim: true },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    bookId: {
      type: Schema.Types.ObjectId,
      require: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      require: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { toObject: { useProjection: true } }
)

export const ChapterModel = model<ChapterDocument>('Chapter', ChapterSchema)
