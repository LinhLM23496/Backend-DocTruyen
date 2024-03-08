import { Book, BookDocument, BookModel } from '~/models/database/Book'
import { GetAllBook, PagingParams } from './types'
import escapeStringRegexp from 'escape-string-regexp'

type GetSuggestionsType = {
  limit: number
}

type GetAllBookPagingParams = PagingParams & {
  filter: {
    search: string
    categories?: string[]
    odir?: string
    order?: string
  }
}

const buildSortOptions = (order: string, odir: string) => {
  const defaultSort = { likes: -1, views: -1 }

  if (order === 'likes') {
    return { likes: odir === 'desc' ? -1 : 1, views: odir === 'desc' ? -1 : 1 }
  }

  if (order === 'views') {
    return { views: odir === 'desc' ? -1 : 1, likes: odir === 'desc' ? -1 : 1 }
  }

  if (order) {
    return { [order]: odir === 'desc' ? -1 : 1, ...defaultSort }
  }

  return { likes: odir === 'desc' ? -1 : 1, views: odir === 'desc' ? -1 : 1 }
}

export const getAllBook = async ({ page, limit, filter }: GetAllBookPagingParams): Promise<GetAllBook> => {
  try {
    const { search, categories, order = '', odir = 'desc' } = filter
    const $regex = new RegExp(escapeStringRegexp(search), 'i')

    const pipelineStages: any[] = [
      {
        $match: {
          name: { $regex }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          cover: 1,
          views: 1,
          updatedAt: 1,
          chapters: 1,
          status: 1
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'book',
          as: 'dataLikes'
        }
      },
      {
        $addFields: {
          likes: { $size: '$dataLikes' } // Đếm số lượng likes
        }
      },
      {
        $project: {
          dataLikes: 0
        }
      }
    ]

    if (categories && categories.length > 0) {
      pipelineStages.unshift({
        $match: {
          categories: { $in: categories }
        }
      })
    }

    pipelineStages.push({
      $sort: buildSortOptions(order, odir)
    })

    // count total records without limit
    const totalCount = await BookModel.aggregate([...pipelineStages, { $count: 'total' }])

    pipelineStages.push(
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    )

    const books = await BookModel.aggregate(pipelineStages)

    const total = totalCount[0]?.total || 0
    const totalPages = Math.ceil(total / limit)
    const paging = {
      page,
      limit,
      total,
      totalPages
    }

    return { data: books, paging }
  } catch (error) {
    console.log('error', error)
    throw 'error getAllBook service'
  }
}

export const getMyBooks = async (createdBy: string): Promise<BookDocument[]> =>
  await BookModel.find({ createdBy }).exec()

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

export const updateBookById = async (id: string, values: any): Promise<BookDocument | null> => {
  return BookModel.findByIdAndUpdate(id, values, { new: true }).exec()
}

export const deleteBookById = async (id: string): Promise<BookDocument | any> => {
  return BookModel.findByIdAndDelete(id).exec()
}

export const getListSuggestions = async ({ limit }: GetSuggestionsType): Promise<BookDocument[]> => {
  try {
    const suggestions = await BookModel.aggregate([
      {
        $project: {
          _id: 1,
          cover: 1,
          views: 1,
          name: 1,
          chapters: 1,
          status: 1
        }
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'book',
          as: 'dataLikes'
        }
      },
      {
        $addFields: {
          likes: { $size: '$dataLikes' } // Đếm số lượng likes
        }
      },
      {
        $project: {
          dataLikes: 0
        }
      },
      {
        $sort: { likes: -1, views: -1 }
      },
      {
        $limit: limit
      }
    ])

    return suggestions
  } catch (error) {
    throw 'error getListSuggestions service'
  }
}

export const getBooksPending = async (): Promise<BookDocument[]> => {
  return BookModel.find({ status: 2 }).select('_id chapters author url').exec()
}

export const getCategories = async (): Promise<string[]> => {
  const categories = await BookModel.distinct('categories').exec()
  return categories.filter((category): category is string => category !== undefined)
}

export const getBookAndUpdateViews = async (bookId: string): Promise<BookDocument | null> => {
  try {
    const book = await BookModel.findByIdAndUpdate(bookId, { $inc: { views: 1 } })
    if (!book) return null
    return book
  } catch (error) {
    return null
  }
}
