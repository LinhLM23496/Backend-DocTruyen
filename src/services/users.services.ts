import { Query } from 'mongoose'
import { UserDocument, UserModel } from '~/models/database/User'

export const getUserByEmail = (email: string): Query<UserDocument | null, UserDocument> =>
  UserModel.findOne({ email, status: 'active' })

export const getUserById = (id: string): Promise<UserDocument | null> =>
  UserModel.findOne({ _id: id, status: 'active' }).exec()

export const createUser = (values: any): Promise<UserDocument> =>
  new UserModel({ ...values, status: 'active' }).save().then((user) => user.toObject())

export const updateUserById = (id: string, values: any): Promise<UserDocument | null> =>
  UserModel.findByIdAndUpdate(id, { ...values, status: 'active' }, { new: true }).exec()

export const blockUserById = (id: string): Promise<UserDocument | null> =>
  UserModel.findByIdAndUpdate(id, { $set: { status: 'block' } }, { new: true }).exec()
