import { Request } from 'express'
import { Document, Model, Query } from 'mongoose'
import { LIMIT, PAGE } from '~/constants/enum'

interface Paging {
  page: number
  limit: number
  total: number
  totalPage: number
}

export const paginateResults = async <T extends Document>(
  model: Model<T>,
  req: Request,
  filter: any = {}
): Promise<{ paging: Paging; results: T[] }> => {
  const page = typeof req.query.page === 'string' ? parseInt(req.query.page) : PAGE
  const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : LIMIT

  // Clone the original query before modifying it for countDocuments
  const query: Query<T[], T> = model.find({ ...filter })
  const countQuery = query.clone()

  const total = await countQuery.countDocuments()
  const totalPage = Math.ceil(total / limit)

  const paging: Paging = {
    page,
    limit,
    total,
    totalPage
  }

  const results = await query
    .skip((page - 1) * limit)
    .limit(limit)
    .exec()

  return { paging, results }
}
