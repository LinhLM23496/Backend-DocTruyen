import { UserSuggested, UserSuggestedDocument, UserSuggestedModel } from '~/models/database/UserSuggested'

type TypeLastSuggestedByUserId = {
  userId: string
  type: string
}

export const createUserSuggested = async (params: UserSuggested): Promise<UserSuggestedDocument> => {
  const exitsSuggestions = await UserSuggestedModel.findOne({ userId: params.userId, type: params.type }).exec()

  if (exitsSuggestions) {
    const dataNew = {
      ...exitsSuggestions.toObject(),
      data: [...params.data, ...exitsSuggestions.data],
      updatedAt: Date.now()
    }

    const updateSuggested = (await UserSuggestedModel.findByIdAndUpdate(exitsSuggestions._id, dataNew, {
      new: true
    }).exec()) as UserSuggestedDocument

    return updateSuggested.toObject()
  }

  const userSuggested = new UserSuggestedModel(params)

  return userSuggested.save().then((savedUserSuggested) => savedUserSuggested.toObject())
}

export const getSuggestedByUserId = async ({
  userId,
  type
}: TypeLastSuggestedByUserId): Promise<UserSuggestedDocument | null> => {
  return UserSuggestedModel.findOne({ userId, type }).exec()
}
