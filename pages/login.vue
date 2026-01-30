<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="relative">
            <div class="absolute inset-0 bg-primary/20 blur-lg rounded-full"></div>
            <div class="relative bg-gradient-to-br from-primary to-success p-3 rounded-xl shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <h1 class="text-4xl font-black bg-gradient-to-l from-primary to-success bg-clip-text text-transparent">
            SniperFlow
          </h1>
        </div>
        <h2 class="text-3xl font-bold mb-2">تسجيل الدخول</h2>
        <p class="text-text-secondary">الوصول إلى التحليلات المتقدمة</p>
      </div>

      <!-- Login Form -->
      <div class="bg-bg-secondary rounded-2xl p-8 shadow-2xl border border-border-color/30">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-semibold mb-2 text-right">
              البريد الإلكتروني
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                class="block w-full pr-10 pl-4 py-3 border border-border-color rounded-lg bg-bg-tertiary text-right focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label for="password" class="block text-sm font-semibold mb-2 text-right">
              كلمة المرور
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                autocomplete="current-password"
                class="block w-full pr-10 pl-12 py-3 border border-border-color rounded-lg bg-bg-tertiary text-right focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary hover:text-primary transition-colors"
              >
                <svg v-if="showPassword" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 3m3.29 3.29L12 12m-5.71-5.71L12 12" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-danger/20 border-r-4 border-danger p-4 rounded-lg">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-danger" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <p class="text-sm text-danger font-semibold">{{ error }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-white bg-gradient-to-r from-primary to-success hover:from-primary/90 hover:to-success/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            <svg v-if="isLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="!isLoading">تسجيل الدخول</span>
            <span v-else>جاري التحقق...</span>
          </button>
        </form>

        <!-- Register Link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-text-secondary">
            ليس لديك حساب؟
            <NuxtLink to="/register" class="font-semibold text-primary hover:text-primary/80 transition-colors">
              سجل الآن
            </NuxtLink>
          </p>
        </div>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-warning/10 border border-warning/30 rounded-lg">
          <p class="text-xs text-warning font-semibold mb-2">💡 بيانات تجريبية:</p>
          <p class="text-xs text-text-secondary">البريد: أي بريد صحيح</p>
          <p class="text-xs text-text-secondary">كلمة المرور: 6 أحرف على الأقل</p>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-text-secondary hover:text-primary transition-colors flex items-center justify-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
          </svg>
          العودة للصفحة الرئيسية
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: []
})

const { login } = useAuth()
const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true

  try {
    const result = await login(email.value, password.value)
    
    if (result.success) {
      // إعادة التوجيه إلى الصفحة المطلوبة أو الصفحة الرئيسية
      const redirect = route.query.redirect as string || '/analytics'
      await router.push(redirect)
    } else {
      error.value = result.error || 'فشل تسجيل الدخول'
    }
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ أثناء تسجيل الدخول'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated.value) {
    router.push('/analytics')
  }
})
</script>
