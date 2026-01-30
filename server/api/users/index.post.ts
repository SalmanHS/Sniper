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
    const { email, password, name } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'البريد الإلكتروني وكلمة المرور مطلوبان'
      })
    }

    if (password.length < 6) {
      throw createError({
        statusCode: 400,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      })
    }

    // إنشاء مجلد data أو /tmp إذا لم يكن موجوداً
    const fs = await import('fs')
    const dataDir = process.env.VERCEL ? '/tmp' : join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // قراءة المستخدمين الحاليين
    let users: User[] = []
    if (fs.existsSync(USERS_FILE)) {
      const data = await readFile(USERS_FILE, 'utf-8')
      users = JSON.parse(data)
    }

    // التحقق من عدم وجود مستخدم بنفس البريد
    if (users.some(u => u.email === email)) {
      throw createError({
        statusCode: 409,
        message: 'البريد الإلكتروني مستخدم بالفعل'
      })
    }

    // إنشاء مستخدم جديد (معطل افتراضياً حتى يفعل المدير)
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: name || email.split('@')[0],
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
      isActive: false, // الحساب معطل افتراضياً
      role: 'user' // الدور الافتراضي هو عضو عادي
    }

    users.push(newUser)

    // حفظ المستخدمين
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')

    // إرجاع المستخدم بدون كلمة المرور
    const { password: _, ...userWithoutPassword } = newUser
    return userWithoutPassword
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'فشل في إنشاء المستخدم: ' + error.message
    })
  }
})
