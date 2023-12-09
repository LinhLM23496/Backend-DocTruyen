import { Chapter, ChapterDocument, ChapterModel } from '~/models/database/Chapter'

export const getChaptersByBookId = async (bookId: string): Promise<ChapterDocument[]> => {
  return ChapterModel.find({ bookId })
}

export const getChapterById = async (id: string): Promise<ChapterDocument | null> => {
  return ChapterModel.findById(id)
}

export const getChapterByBookIdAndNumChapter = async (
  id: string,
  numberChapter: number
): Promise<ChapterDocument | null> => {
  return ChapterModel.findOne({ bookId: id, numberChapter })
}

export const createChapter = async (values: Chapter): Promise<ChapterDocument> => {
  const chapter = new ChapterModel(values)
  return chapter.save().then((savedChapter) => savedChapter.toObject())
}

export const updateChapterById = async (id: string, values: Chapter): Promise<ChapterDocument | null> => {
  return ChapterModel.findByIdAndUpdate(id, values, { new: true })
}

export const deleteChapterById = async (id: string): Promise<ChapterDocument | any> => {
  return ChapterModel.findByIdAndDelete(id)
}

export const deleteMutilChaptersByBookId = async (bookId: string): Promise<void> => {
  try {
    await ChapterModel.deleteMany({ bookId })
  } catch (error) {
    console.error('Error deleting chapters:', error)
    throw error
  }
}
