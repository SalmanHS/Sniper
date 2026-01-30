export type UserRole = 'admin' | 'user' | 'moderator'

export interface User {
  id: string
  email: string
  name?: string
  role?: UserRole
}

export const useAuth = () => {
  const user = useState<User | null>('auth.user', () => null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/users/login', {
        method: 'POST',
        body: { email, password }
      })
      
      user.value = response as User
      
      // حفظ في localStorage
      if (process.client) {
        localStorage.setItem('auth.user', JSON.stringify(user.value))
      }
      
      return { success: true, user: user.value }
    } catch (error: any) {
      return { success: false, error: error.data?.message || error.message || 'فشل تسجيل الدخول' }
    }
  }

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await $fetch('/api/users', {
        method: 'POST',
        body: { email, password, name }
      })
      
      user.value = response as User
      
      // حفظ في localStorage
      if (process.client) {
        localStorage.setItem('auth.user', JSON.stringify(user.value))
      }
      
      return { success: true, user: user.value }
    } catch (error: any) {
      return { success: false, error: error.data?.message || error.message || 'فشل إنشاء الحساب' }
    }
  }

  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.removeItem('auth.user')
    }
  }

  const initAuth = () => {
    if (process.client) {
      const stored = localStorage.getItem('auth.user')
      if (stored) {
        try {
          user.value = JSON.parse(stored)
        } catch (e) {
          console.error('Error loading auth:', e)
        }
      }
    }
  }

  // تهيئة المصادقة عند تحميل الصفحة
  if (process.client) {
    initAuth()
  }

  const isAdmin = computed(() => user.value?.role === 'admin')
  const isModerator = computed(() => user.value?.role === 'admin' || user.value?.role === 'moderator')

  return {
    user: readonly(user),
    isAuthenticated,
    isAdmin,
    isModerator,
    login,
    register,
    logout,
    initAuth
  }
}
