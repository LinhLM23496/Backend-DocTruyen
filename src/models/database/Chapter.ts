import { ObjectId, Schema, model } from 'mongoose'

export interface Chapter {
  _id: ObjectId
  title: string
  numberChapter: number
  description?: string
  content: string
  cover?: string
  views?: number
  likes?: number
  bookId: string
  createdBy: string
  updatedAt?: Date
  createdAt?: Date
}

export interface ChapterDocument extends Chapter, Document {}

const ChapterSchema = new Schema(
  {
    title: { type: String, require: true },
    numberChapter: { type: Number, default: 1, require: true },
    description: { type: String },
    content: { type: String, require: true },
    cover: { type: String, trim: true },
    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    bookId: { type: String, require: true },
    createdBy: { type: String, require: true },
    updatedAt: { type: Date, default: new Date() },
    createdAt: { type: Date, default: new Date() }
  },
  { toObject: { useProjection: true } }
)

export const ChapterModel = model<ChapterDocument>('Chapter', ChapterSchema)
