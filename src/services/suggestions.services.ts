import { Book, BookDocument, BookModel } from '~/models/database/Book'

type GetSuggestionsType = {
  limit: number
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
