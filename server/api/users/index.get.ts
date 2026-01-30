import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

// استخدام /tmp في Vercel أو data/ في التطوير المحلي
const USERS_FILE = process.env.VERCEL 
  ? join('/tmp', 'users.json')
  : join(process.cwd(), 'data', 'users.json')

type UserRole = 'admin' | 'user' | 'moderator'

interface User {
  id: string
  email: string
  name?: string
  password: string
  createdAt: string
  lastLogin?: string
  isActive: boolean
  role: UserRole
}

export default defineEventHandler(async (event) => {
  // السماح فقط بـ GET
  if (event.method !== 'GET') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    // إنشاء مجلد data أو /tmp إذا لم يكن موجوداً
    const fs = await import('fs')
    const dataDir = process.env.VERCEL ? '/tmp' : join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // قراءة ملف المستخدمين
    let users: User[] = []
    if (fs.existsSync(USERS_FILE)) {
      const data = await readFile(USERS_FILE, 'utf-8')
      users = JSON.parse(data)
    }

    // إرجاع المستخدمين بدون كلمات المرور مع إضافة role افتراضي
    return users.map(({ password, ...user }) => ({
      ...user,
      role: user.role || 'user' // role افتراضي للمستخدمين القدامى
    }))
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: 'فشل في قراءة بيانات المستخدمين: ' + error.message
    })
  }
})
