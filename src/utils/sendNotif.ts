import { getMessaging } from 'firebase-admin/messaging'
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
      host: 'smtp.zoho.com',
      secure: true,
      port: 465,
      auth: { user: USER_EMAIL, pass: PASS_APP }
    })

    const mailContent = `
    <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="margin-bottom: 20px;">
        <h2>Xin chào,</h2>
        <p>Bạn đã yêu cầu nhận mã code vào tài khoản <strong>${email}</strong>.</p>
        <p>Mã xác thực của bạn là <strong>${code}</strong> (Lưu ý: Mã chỉ có hiệu lực trong 30 phút)</p>
      </div>
  
      <div style="text-align: right; margin-top: 20px;">
        <p>Nơi đắm chìm trong thế giới riêng ta,</p>
        <p style="color: #576B6A"><strong>LML Group</strong></p>
        <img src="link-to-your-signature-image.jpg" alt="LML Group Signature" style="width: 120px; height: auto;">
      </div>
    </div>
  `

    await transporter.sendMail({
      from: {
        name: 'LML Group',
        address: USER_EMAIL
      },
      to: [email], // list of receivers
      subject,
      html: mailContent
    })
  } catch (error) {
    console.log('error', error)
    return Promise.reject('Sended mail fail')
  }
}

type NotifType = {
  title: string
  body: string
}

type DataType = {
  [key: string]: any
}

export const sendNotification = async (fcmToken: string, notif: NotifType, data?: DataType): Promise<boolean> => {
  try {
    const message = {
      token: fcmToken,
      notification: notif,
      data
    }
    await getMessaging().send(message)
    return true
  } catch (error) {
    return false
  }
}
