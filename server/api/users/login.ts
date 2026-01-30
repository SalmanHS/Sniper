import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { createHash } from 'crypto'

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

function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export default defineEventHandler(async (event) => {
  // السماح فقط بـ POST
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      })
    }

    // قراءة المستخدمين
    const fs = await import('fs')
    if (!fs.existsSync(USERS_FILE)) {
      throw createError({
        statusCode: 401,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      })
    }

    const data = await readFile(USERS_FILE, 'utf-8')
    const users: User[] = JSON.parse(data)

    // البحث عن المستخدم
    const hashedPassword = hashPassword(password)
    const user = users.find(u => u.email === email && u.password === hashedPassword)

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      })
    }

    // التحقق من تفعيل الحساب
    if (!user.isActive) {
      throw createError({
        statusCode: 403,
        message: 'حسابك غير مفعل. يرجى الانتظار حتى يقوم المدير بتفعيل حسابك'
      })
    }

    // تحديث آخر تسجيل دخول
    user.lastLogin = new Date().toISOString()
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')

    // إرجاع المستخدم بدون كلمة المرور مع إضافة role افتراضي
    const { password: _, ...userWithoutPassword } = user
    return {
      ...userWithoutPassword,
      role: user.role || 'user' // role افتراضي للمستخدمين القدامى
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'فشل في تسجيل الدخول: ' + error.message
    })
  }
})
