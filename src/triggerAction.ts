import { Agenda } from '@hokify/agenda'
import axios from 'axios'

const triggerAction = () => {
  const MONGO_URL = process.env.MONGO_URL ?? ''
  const agenda = new Agenda({ db: { address: MONGO_URL } })

  agenda.define('callApiJob', async (job) => {
    try {
      const url = 'https://doctruyen-lmlgroup.onrender.com/api/books/suggestion'
      // Gọi API ở đây
      await axios.get(url)
      console.log(`Call API completed`)
    } catch (error: any) {
      console.log('Call API error')
    }
  })

  const startAgenda = async () => {
    await agenda.start()

    // Đăng ký công việc lên lịch để chạy mỗi 30 phút
    agenda.every('30 minutes', 'callApiJob')

    console.log('Agenda đã bắt đầu. Công việc gọi API sẽ được chạy mỗi 30 phút.')
  }

  startAgenda()
}

export default triggerAction
