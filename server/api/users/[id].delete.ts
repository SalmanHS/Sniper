import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

// استخدام /tmp في Vercel أو data/ في التطوير المحلي
const USERS_FILE = process.env.VERCEL 
  ? join('/tmp', 'users.json')
  : join(process.cwd(), 'data', 'users.json')

export default defineEventHandler(async (event) => {
  // السماح فقط بـ DELETE
  if (event.method !== 'DELETE') {
    throw createError({
      statusCode: 405,
      message: 'Method not allowed'
    })
  }

  try {
    const id = getRouterParam(event, 'id')

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
    const users = JSON.parse(data)

    // البحث عن المستخدم وحذفه
    const userIndex = users.findIndex((u: any) => u.id === id)
    if (userIndex === -1) {
      throw createError({
        statusCode: 404,
        message: 'المستخدم غير موجود'
      })
    }

    users.splice(userIndex, 1)

    // حفظ التغييرات
    await writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')

    return { success: true, message: 'تم حذف المستخدم بنجاح' }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'فشل في حذف المستخدم: ' + error.message
    })
  }
})
