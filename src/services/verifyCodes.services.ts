import mongoose, { ObjectId, Schema } from 'mongoose'
import { TypeVerifyCode, VerifyCodeDocument, VerifyCodeModel } from '~/models/database/VerifyCode'

export type GetVerifyCodeParams = {
  userId: Schema.Types.ObjectId
  code: number
  type: TypeVerifyCode
}

export const createVerifyCode = async (params: GetVerifyCodeParams): Promise<VerifyCodeDocument> => {
  const verifyCode = new VerifyCodeModel(params)
  return verifyCode.save().then((savedVerifyCode) => savedVerifyCode.toObject())
}

export const getVerifyCodeByData = async (params: GetVerifyCodeParams): Promise<VerifyCodeDocument | null> => {
  return VerifyCodeModel.findOne(params).exec()
}

export const deleteVerifyCodeByUserIdType = async (
  params: Omit<GetVerifyCodeParams, 'code'>
): Promise<VerifyCodeDocument | null> => {
  return VerifyCodeModel.findOneAndDelete(params).exec()
}

export const deleteVerifyCodeById = async (id: ObjectId) => {
  return VerifyCodeModel.findByIdAndDelete(id)
}
