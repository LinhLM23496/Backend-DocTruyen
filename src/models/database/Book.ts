import mongoose from 'mongoose'

const Schema = mongoose.Schema

const BookSchema = new Schema(
  {
    name: { type: String, require: true },
    author: { type: String, require: true },
    description: { type: String },
    cover: { type: String, trim: true },
    banner: { type: String, trim: true },
    category: { type: [String], default: ['other'] },
    chapters: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
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

export const BookModel = mongoose.model('Book', BookSchema)

export const getBooks = () => BookModel.find()

export const getMyBooks = (createdBy: string) => BookModel.find({ createdBy })

export const getBookById = (id: string) => BookModel.findById({ _id: id })

export const getBooksByCreatedBy = (createdById: string) => BookModel.find({ createdBy: createdById })

export const createBook = (values: Record<string, any>) => new BookModel(values).save().then((book) => book.toObject())

export const updateBookById = (id: string, values: Record<string, any>) =>
  BookModel.findByIdAndUpdate(id, values, { new: true })

export const deleteBookById = (id: string) => BookModel.findByIdAndDelete({ _id: id })
