import mongoose from 'mongoose'

const Schema = mongoose.Schema

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

export const ChapterModel = mongoose.model('Chapter', ChapterSchema)

export const getChaptersByBookId = (bookId: string) => ChapterModel.find({ bookId })

export const getChapterById = (id: string) => ChapterModel.findById({ _id: id })

export const getChapterByBookIdAndNumChapter = (id: string, numberChapter: number) =>
  ChapterModel.findOne({ bookId: id, numberChapter })

export const createChapter = (values: Record<string, any>) =>
  new ChapterModel(values).save().then((book) => book.toObject())

export const updateChapterById = (id: string, values: Record<string, any>) =>
  ChapterModel.findByIdAndUpdate(id, values, { new: true })

export const deleteChapterById = (id: string) => ChapterModel.findByIdAndDelete({ _id: id })

export const deleteMutilChaptersByBookId = async (bookId: string) => {
  try {
    await ChapterModel.deleteMany({ bookId })
  } catch (error) {
    console.error('Error deleting chapters:', error)
    throw error
  }
}
