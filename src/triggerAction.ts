import { Agenda } from '@hokify/agenda'
import updateChapter from './crawl'

const triggerAction = () => {
  const MONGO_URL = process.env.MONGO_URL ?? ''
  const agenda = new Agenda({ db: { address: MONGO_URL } })

  agenda.define('updateChapterJob', async (job) => {
    updateChapter()
  })

  const startAgenda = async () => {
    await agenda.start()

    // Đăng ký công việc lên lịch để chạy mỗi 6 tiếng
    agenda.every('6 hours', 'updateChapterJob')

    console.log('Agenda đã bắt đầu. Công việc gọi API sẽ được chạy mỗi 6 tiếng.')
  }

  startAgenda()
}

export default triggerAction
