import nodemailer from 'nodemailer'
import { TypeVerifyCode } from '~/models/database/VerifyCode'

type SendMailType = {
  email: string
  code: number
  type: TypeVerifyCode
}

export const sendMail = async ({ email, code, type }: SendMailType) => {
  try {
    const subject = type === 'forgotPassword' ? 'Mã xác thực đổi password' : 'test'
    const USER_EMAIL = process.env.USER_EMAIL ?? ''
    const PASS_APP = process.env.PASS_APP ?? ''
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: USER_EMAIL, pass: PASS_APP }
    })

    await transporter.sendMail({
      from: {
        name: 'LML Group',
        address: USER_EMAIL
      },
      to: [email], // list of receivers
      subject,
      html: `<div>
        <p>Xin chào,</p>
        <p>Bạn đã yêu cầu nhận mã code vào tài khoản <strong>${email}</strong>. 
          Mã xác thực của bạn là <strong>${code}</strong> 
          (Lưu ý: Mã chỉ có hiệu lực trong 30 phút)
        </p>
      </div>`
    })
  } catch (error) {
    return Promise.reject('Sended mail fail')
  }
}
