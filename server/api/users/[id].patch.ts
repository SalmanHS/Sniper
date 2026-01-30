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
  // السماح فقط بـ PATCH
  if (event.method !== 'PATCH') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'معرف المستخدم مطلوب'
      })
    }

    // قراءة المستخدمين
    const fs = await import('fs')
    if (!fs.existsSync(USERS_FILE)) {
      throw createError({
        statusCode: 404,
        message: 'المستخدم غير موجود'
      })
    }

    const data = await readFile(USERS_FILE, 'utf-8')
    const users: User[] = JSON.parse(data)

    // إضافة role افتراضي للمستخدمين القدامى
    users.forEach(u => {
      if (!u.role) {
        u.role = 'user'
      }
    })

    // البحث عن المستخدم
    const userIndex = users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      throw createError({
        statusCode: 404,
        message: 'المستخدم غير موجود'
      })
    }

    const user = users[userIndex]

    // تحديث البيانات
    if (body.name !== undefined) {
      user.name = body.name
    }
    if (body.email !== undefined && body.email !== user.email) {
      // التحقق من عدم وجود مستخدم آخر بنفس البريد
      if (users.some(u => u.id !== id && u.email === body.email)) {
        throw createError({
          statusCode: 409,
          message: 'البريد الإلكتروني مستخدم بالفعل'
        })
      }
      user.email = body.email
    }
    if (body.password !== undefined && body.password.length > 0) {
      if (body.password.length < 6) {
        throw createError({
          statusCode: 400,
          message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
        })
      }
      user.password = hashPassword(body.password)
    }
    if (body.isActive !== undefined) {
      user.isActive = body.isActive
    }
    if (body.role !== undefined) {
      const validRoles: UserRole[] = ['admin', 'user', 'moderator']
      if (!validRoles.includes(body.role)) {
        throw createError({
          statusCode: 400,
          message: 'الدور غير صحيح'
        })
      }
      user.role = body.role
    }

    // حفظ التغييرات
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')

    // إرجاع المستخدم بدون كلمة المرور
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'فشل في تحديث المستخدم: ' + error.message
    })
  }
})
