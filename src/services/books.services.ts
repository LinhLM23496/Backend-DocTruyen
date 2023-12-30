import { Book, BookDocument, BookModel } from '~/models/database/Book'

type GetSuggestionsType = {
  limit: number
}

export const getBooks = async (): Promise<BookDocument[]> => {
  return BookModel.find().exec()
}

export const getMyBooks = async (createdBy: string): Promise<BookDocument[]> => {
  return BookModel.find({ createdBy }).exec()
}

export const getBookById = async (id: string): Promise<BookDocument | null> => {
  return BookModel.findById(id).exec()
}

export const getBooksByCreatedBy = async (createdById: string): Promise<BookDocument[]> => {
  return BookModel.find({ createdBy: createdById }).exec()
}

export const createBook = async (values: Book): Promise<BookDocument> => {
  const book = new BookModel(values)
  return book.save().then((savedBook) => savedBook.toObject())
}

export const updateBookById = async (id: string, values: Book): Promise<BookDocument | null> => {
  return BookModel.findByIdAndUpdate(id, values, { new: true }).exec()
}

export const deleteBookById = async (id: string): Promise<BookDocument | any> => {
  return BookModel.findByIdAndDelete(id).exec()
}

export const getListSuggestions = async ({ limit }: GetSuggestionsType): Promise<BookDocument[]> => {
  try {
    const listSuggsetion = await BookModel.find()
      .select('_id cover chapters likes views name')
      .limit(limit)
      .sort({ likes: -1 })
      .exec()
    return listSuggsetion
  } catch (error) {
    throw 'error'
  }
}
