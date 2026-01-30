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
  // السماح فقط بـ POST
  if (event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    const body = await readBody(event)
    const { email } = body

    if (!email) {
      throw createError({
        statusCode: 400,
        message: 'البريد الإلكتروني مطلوب'
      })
    }

    // قراءة المستخدمين
    const fs = await import('fs')
    if (!fs.existsSync(USERS_FILE)) {
      throw createError({
        statusCode: 404,
        message: 'لا يوجد مستخدمين في النظام'
      })
    }

    const data = await readFile(USERS_FILE, 'utf-8')
    const users: User[] = JSON.parse(data)

    // البحث عن المستخدم
    const user = users.find(u => u.email === email)
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'المستخدم غير موجود'
      })
    }

    // تعيين كمدير
    user.role = 'admin'
    user.isActive = true // تفعيل الحساب أيضاً

    // حفظ التغييرات
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')

    // إرجاع المستخدم بدون كلمة المرور
    const { password: _, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'فشل في تعيين المدير: ' + error.message
    })
  }
})
