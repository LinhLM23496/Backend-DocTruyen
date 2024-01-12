import { BookDocument } from '~/models/database/Book'

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
