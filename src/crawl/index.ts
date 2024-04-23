import * as cheerio from 'cheerio'
import axios from 'axios'
import path from 'path'
import fs from 'fs/promises'
import { booksServices, chaptersServices } from '~/services'
import { CONTENT_TO_REPLACE } from '~/constants'
import moment from 'moment'

const getMaxChapter = async (url: string) => {
  try {
    const res = await axios.get(url)
    if (res.status === 200) {
      const $ = cheerio.load(res.data)
      const numberChapter = Number($('div.info span.source span')?.text()?.trim())
      return numberChapter
    } else {
      return 0
    }
  } catch (error) {
    console.log('error :>> ', error)
    return 0
  }
}

type BookData = {
  bookId: string
  author: string
}

async function getChapter(bookData: BookData, url: string, i: number) {
  try {
    const urlChapter = `${url}/chuong-${i}`
    const res = await axios.get(urlChapter)
    if (res.status === 200) {
      const $ = cheerio.load(res.data)
      const title = $('a.chapter-title')?.text()?.trim()
      let content = $('article.chapter-content')?.text()?.trim()

      for (const str of CONTENT_TO_REPLACE) {
        content = content.replace(new RegExp(str, 'gi'), '')
      }

      const chapter = {
        title,
        numberChapter: i,
        description: '',
        cover: '',
        views: 0,
        content,
        bookId: bookData?.bookId,
        createdBy: bookData?.author,
        updatedAt: new Date(),
        createdAt: new Date()
      }

      return chapter
    } else {
      return false
    }
  } catch (error) {
    console.log('chapter error :>> ', error)
  }
}

async function saveContentToFile(bookId: string, chapterId: string, content: string) {
  try {
    const filePath = path.join('db', 'chapters', bookId)
    await fs.mkdir(filePath, { recursive: true })

    const chapter_file = path.join(filePath, `${chapterId}.txt`)

    await fs.writeFile(chapter_file, content, { encoding: 'utf-8' })
  } catch (error) {
    console.log('Lỗi khi ghi file:', error)
  }
}

async function saveFailedChapter(failed: number[], url: string) {
  const failed_file = 'db/crawl-failed.txt'
  const content = `\n${url}\nChap lỗi: ${failed}`

  const existingContent = await fs.readFile(failed_file, 'utf-8')
  const combinedContent = existingContent + content

  await fs.writeFile(failed_file, combinedContent, { encoding: 'utf-8' })
}

export default async function updateChapter() {
  try {
    console.log('Update start')
    const bookFull = await booksServices.getBooksPending()
    for (const book of bookFull) {
      const DATE_NOW = moment().utcOffset('+0700').format('DD-MM-YYYY HH:mm:ss')
      const failed: number[] = []
      const bookId = book._id.toString()
      const author = book.author
      const maxChapter = book.chapters
      const url = book.url

      // log status crawl data
      console.log(DATE_NOW, 'crawl book', url)

      const currentMaxChapter = await getMaxChapter(url)

      if (maxChapter && currentMaxChapter && currentMaxChapter > maxChapter) {
        for (let i = maxChapter + 1; i <= currentMaxChapter; i++) {
          const chapter = await getChapter({ bookId, author }, url, i)

          if (!chapter || !chapter?.content?.length) {
            console.log('chapter lỗi :>> ', i)
            failed.push(i)
            continue
          } else {
            const newChapter = await chaptersServices.createChapterByBookId(bookId, { ...chapter, content: '' })
            newChapter?._id && (await saveContentToFile(bookId, newChapter?._id?.toString(), chapter.content))
          }
        }

        failed.length && saveFailedChapter(failed, url)
        await booksServices.updateBookById(bookId, { chapters: currentMaxChapter, updatedAt: new Date() })
      }
    }

    console.log('update chapter finished :>> ')
  } catch (error) {
    console.log('updateChapter error :>> ', error)
  }
}
