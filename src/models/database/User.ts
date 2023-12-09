import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    roles: {
      type: [String],
      enum: ['user', 'admin', 'super_admin'],
      default: ['user']
    },
    password: { type: String, required: true, select: false },
    status: {
      type: String,
      enum: ['active', 'block'],
      default: 'active',
      select: false
    }
  },
  { toObject: { useProjection: true } }
)

export const UserModel = mongoose.model('User', UserSchema)

export const getUserByEmail = (email: string) => UserModel.findOne({ email, status: 'active' })

export const getUserById = (id: string) => UserModel.findOne({ _id: id, status: 'active' })

export const createUser = (values: Record<string, any>) =>
  new UserModel({ ...values, status: 'active' }).save().then((user) => user.toObject())

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, { ...values, status: 'active' }, { new: true })

export const getUsers = () => UserModel.find({ status: 'active' })

export const blockUserById = (id: string) =>
  UserModel.findByIdAndUpdate(id, { $set: { status: 'block' } }, { new: true })
