import crypto from 'crypto'
import bcrypt from 'bcrypt'

const SALT_ROUND = process.env.SALT_ROUND ?? 10

export const random = async () => await bcrypt.genSalt(Number(process.env.SALT))

export const generateHashPassword = async (password: string) => await bcrypt.hash(password, SALT_ROUND)
