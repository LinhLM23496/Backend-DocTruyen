import { Schema } from 'mongoose'
import { BookDocument } from '~/models/database/Book'
import { LikeDocument } from '~/models/database/Like'

export type Paging = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PagingParams = {
  page: number
  limit: number
}

export type GetAllBook = {
  data: BookDocument[]
  paging: Paging
}

export type DataLike = LikeDocument & {
  book: BookDocument
}

export type GetAllLikesByUserId = {
  data: DataLike[] // LikeDocument[]
  paging: Paging
}
