<template>
  <header class="bg-bg-secondary border-b border-border-color shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <!-- Eye/Sniper Icon -->
            <div class="relative">
              <div class="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all"></div>
              <div class="relative bg-gradient-to-br from-primary to-success p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div class="flex flex-col">
              <span class="text-2xl font-black bg-gradient-to-l from-primary to-success bg-clip-text text-transparent group-hover:from-success group-hover:to-primary transition-all">
                SniperFlow
              </span>
              <span class="text-[10px] text-text-secondary font-medium">تحليلات احترافية</span>
            </div>
          </NuxtLink>
          
          <!-- Navigation -->
          <nav class="hidden lg:flex items-center gap-2">
            <NuxtLink 
              to="/" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-tertiary transition-all group"
              active-class="text-primary bg-primary/10 font-semibold"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>الرئيسية</span>
            </NuxtLink>
            
            <NuxtLink 
              v-if="isAdmin"
              to="/dashboard" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-tertiary transition-all group"
              active-class="text-primary bg-primary/10 font-semibold"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>لوحة التحكم</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/analytics" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-tertiary transition-all group"
              active-class="text-primary bg-primary/10 font-semibold"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>التحليلات</span>
            </NuxtLink>
            
            <NuxtLink 
              to="/guide" 
              class="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-tertiary transition-all group"
              active-class="text-primary bg-primary/10 font-semibold"
            >
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>دليل الاستخدام</span>
            </NuxtLink>
          </nav>
        </div>

        <!-- Right Actions -->
        <div class="flex items-center gap-3">
          <!-- User Menu (if authenticated) -->
          <div v-if="isAuthenticated" class="flex items-center gap-3">
            <div class="hidden md:flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-lg">
              <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="text-sm">
                <div class="font-semibold">{{ user?.name || user?.email?.split('@')[0] || 'مستخدم' }}</div>
                <div class="text-xs text-text-secondary">مسجل دخول</div>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="px-4 py-2 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg font-semibold transition-all text-sm flex items-center gap-2"
              title="تسجيل الخروج"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="hidden md:inline">خروج</span>
            </button>
          </div>
          
          <!-- Login Button (if not authenticated) -->
          <NuxtLink
            v-else
            to="/login"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all font-semibold text-sm flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span class="hidden md:inline">تسجيل الدخول</span>
            <span class="md:hidden">دخول</span>
          </NuxtLink>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2.5 rounded-lg bg-bg-tertiary hover:bg-border-color transition-all hover:scale-105 group"
            :aria-label="isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'"
          >
            <svg v-if="isDark" class="w-5 h-5 text-warning group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="w-5 h-5 text-primary group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </button>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="lg:hidden p-2.5 rounded-lg bg-bg-tertiary hover:bg-border-color transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="lg:hidden mt-4 pt-4 border-t border-border-color space-y-2">
        <NuxtLink 
          to="/" 
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-tertiary transition-all"
          active-class="text-primary bg-primary/10 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>الرئيسية</span>
        </NuxtLink>
        
        <NuxtLink 
          v-if="isAdmin"
          to="/dashboard"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-tertiary transition-all"
          active-class="text-primary bg-primary/10 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>لوحة التحكم</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/analytics"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-tertiary transition-all"
          active-class="text-primary bg-primary/10 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>التحليلات</span>
        </NuxtLink>
        
        <NuxtLink 
          to="/guide"
          @click="mobileMenuOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-primary hover:bg-bg-tertiary transition-all"
          active-class="text-primary bg-primary/10 font-semibold"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>دليل الاستخدام</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const { isDark, toggle: toggleDarkMode } = useDarkMode()
const { user, isAuthenticated, isAdmin, logout } = useAuth()
const router = useRouter()
const mobileMenuOpen = ref(false)

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>
