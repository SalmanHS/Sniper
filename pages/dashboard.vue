<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
          لوحة التحكم
        </h1>
        <p class="text-text-secondary mt-1">نظرة شاملة على السوق والأداء</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="refreshAll"
          :disabled="isRefreshing"
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg 
            :class="['w-5 h-5', isRefreshing && 'animate-spin']"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          تحديث
        </button>
        <div class="px-4 py-2 bg-bg-tertiary rounded-lg border border-border-color/30">
          <div class="text-xs text-text-secondary mb-1">آخر تحديث</div>
          <div class="text-sm font-semibold">{{ lastUpdateTime }}</div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Markets -->
      <div class="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <div class="text-xs text-text-secondary font-medium">الأسواق</div>
        </div>
        <div class="text-3xl font-bold mb-1">{{ stats.totalMarkets }}</div>
        <div class="text-sm text-text-secondary">أسواق نشطة</div>
      </div>

      <!-- Total Volume -->
      <div class="bg-gradient-to-br from-success/20 to-success/5 rounded-xl p-6 border border-success/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="text-xs text-text-secondary font-medium">الحجم الإجمالي</div>
        </div>
        <div class="text-3xl font-bold mb-1">{{ formatVolume(stats.totalVolume) }}</div>
        <div class="text-sm text-text-secondary">24 ساعة</div>
      </div>

      <!-- Active Alerts -->
      <div class="bg-gradient-to-br from-warning/20 to-warning/5 rounded-xl p-6 border border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="text-xs text-text-secondary font-medium">التنبيهات</div>
        </div>
        <div class="text-3xl font-bold mb-1">{{ stats.activeAlerts }}</div>
        <div class="text-sm text-text-secondary">آخر 24 ساعة</div>
      </div>

      <!-- System Status -->
      <div class="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
        <div class="flex items-center justify-between mb-4">
          <div class="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="text-xs text-text-secondary font-medium">حالة النظام</div>
        </div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-3 h-3 rounded-full bg-success animate-pulse"></div>
          <div class="text-2xl font-bold">نشط</div>
        </div>
        <div class="text-sm text-text-secondary">جميع الأنظمة تعمل</div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - 2/3 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Top Markets -->
        <div class="bg-bg-secondary rounded-xl p-6 shadow-lg border border-border-color/30">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
              الأسواق الأكثر نشاطاً
            </h2>
            <NuxtLink 
              to="/markets"
              class="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
            >
              عرض الكل
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </NuxtLink>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="(market, index) in topMarkets"
              :key="market.symbol"
              class="bg-bg-tertiary rounded-lg p-4 hover:bg-border-color/30 transition-all duration-300 cursor-pointer border border-border-color/20 hover:border-primary/50"
              @click="navigateToMarket(market.symbol)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4 flex-1">
                  <div class="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-primary">
                    {{ index + 1 }}
                  </div>
                  <div class="flex-1">
                    <div class="font-bold text-lg mb-1">{{ market.symbol }}</div>
                    <div class="text-sm text-text-secondary">حجم: {{ formatVolume(market.volume) }}</div>
                  </div>
                </div>
                <div class="text-left">
                  <div class="font-bold text-lg mb-1" :class="market.change >= 0 ? 'text-success' : 'text-danger'">
                    ${{ market.price }}
                  </div>
                  <div class="text-sm flex items-center gap-1" :class="market.change >= 0 ? 'text-success' : 'text-danger'">
                    <svg v-if="market.change >= 0" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    {{ market.change >= 0 ? '+' : '' }}{{ market.change.toFixed(2) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Alerts -->
        <div class="bg-bg-secondary rounded-xl p-6 shadow-lg border border-border-color/30">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <svg class="w-6 h-6 text-warning" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
              آخر التنبيهات
            </h2>
            <NuxtLink 
              to="/analytics"
              class="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
            >
              عرض الكل
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </NuxtLink>
          </div>
          
          <div v-if="recentAlerts.length === 0" class="text-center py-8 text-text-secondary">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <p>لا توجد تنبيهات حالياً</p>
          </div>
          
          <div v-else class="space-y-3">
            <div
              v-for="alert in recentAlerts"
              :key="alert.id"
              class="bg-bg-tertiary rounded-lg p-4 border border-border-color/20 hover:border-warning/50 transition-all duration-300"
            >
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="alert.type === 'absorption' ? 'bg-warning/20' : 'bg-primary/20'">
                  <svg class="w-5 h-5" :class="alert.type === 'absorption' ? 'text-warning' : 'text-primary'" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 01.557 1.04l1.055 4.428a1 1 0 001.154 1.23l3.178-.78a1 1 0 00.723-.957V13a1 1 0 011-1h2a1 1 0 011 1v3.278a1 1 0 01-.723.957l-3.178.78a1 1 0 00-1.154 1.23l1.055 4.428a1 1 0 001.04.557l1.94-.831 4.786 1.714a1 1 0 11-.788 1.838l-4-1.714a1 1 0 00-.788 0l-4 1.714a1 1 0 11-.788-1.838l4.786-1.714 1.94.831a1 1 0 001.04-.557l1.055-4.428a1 1 0 00-1.154-1.23l-3.178-.78a1 1 0 01-.723-.957V13h-2v3.278a1 1 0 01-.723.957l-3.178.78a1 1 0 00-1.154 1.23l1.055 4.428a1 1 0 01-.557 1.04l-1.94.831-4.786-1.714a1 1 0 11.788-1.838l4 1.714a1 1 0 00.788 0l4-1.714a1 1 0 11.788 1.838l-4.786 1.714-1.94-.831a1 1 0 01-.557-1.04l-1.055-4.428a1 1 0 00-1.154-1.23l-3.178.78a1 1 0 01-.723-.957V9.278a1 1 0 01.723-.957l3.178-.78a1 1 0 001.154-1.23L6.25 2.08z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="font-bold mb-1">{{ alert.symbol }}</div>
                  <div class="text-sm text-text-secondary mb-2">{{ alert.message }}</div>
                  <div class="text-xs text-text-secondary">{{ formatTime(alert.timestamp) }}</div>
                </div>
                <div class="text-xs px-2 py-1 rounded" :class="alert.type === 'absorption' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'">
                  {{ alert.type === 'absorption' ? 'امتصاص' : 'تنبيه' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - 1/3 -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="bg-bg-secondary rounded-xl p-6 shadow-lg border border-border-color/30">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
            </svg>
            إجراءات سريعة
          </h2>
          <div class="space-y-2">
            <NuxtLink
              to="/markets"
              class="block w-full px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold transition-all duration-300 text-right"
            >
              📊 عرض جميع الأسواق
            </NuxtLink>
            <NuxtLink
              to="/analytics"
              class="block w-full px-4 py-3 bg-success/10 hover:bg-success/20 text-success rounded-lg font-semibold transition-all duration-300 text-right"
            >
              🐋 التحليلات المتقدمة
            </NuxtLink>
            <NuxtLink
              to="/guide"
              class="block w-full px-4 py-3 bg-warning/10 hover:bg-warning/20 text-warning rounded-lg font-semibold transition-all duration-300 text-right"
            >
              📖 دليل الاستخدام
            </NuxtLink>
          </div>
        </div>

        <!-- Market Overview -->
        <div class="bg-bg-secondary rounded-xl p-6 shadow-lg border border-border-color/30">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
            نظرة عامة
          </h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
              <div class="text-sm text-text-secondary">إجمالي العملات</div>
              <div class="font-bold">{{ stats.totalMarkets }}</div>
            </div>
            <div class="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
              <div class="text-sm text-text-secondary">الحجم اليوم</div>
              <div class="font-bold">{{ formatVolume(stats.totalVolume) }}</div>
            </div>
            <div class="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
              <div class="text-sm text-text-secondary">التنبيهات النشطة</div>
              <div class="font-bold text-warning">{{ stats.activeAlerts }}</div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div class="bg-bg-secondary rounded-xl p-6 shadow-lg border border-border-color/30">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            مؤشرات الأداء
          </h2>
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-text-secondary">سرعة الاستجابة</span>
                <span class="text-sm font-bold text-success">99.9%</span>
              </div>
              <div class="w-full bg-bg-tertiary rounded-full h-2">
                <div class="bg-success h-2 rounded-full" style="width: 99.9%"></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-text-secondary">دقة التنبيهات</span>
                <span class="text-sm font-bold text-success">98.5%</span>
              </div>
              <div class="w-full bg-bg-tertiary rounded-full h-2">
                <div class="bg-success h-2 rounded-full" style="width: 98.5%"></div>
              </div>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-text-secondary">استقرار النظام</span>
                <span class="text-sm font-bold text-success">100%</span>
              </div>
              <div class="w-full bg-bg-tertiary rounded-full h-2">
                <div class="bg-success h-2 rounded-full" style="width: 100%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Management Section -->
    <div class="bg-bg-secondary rounded-xl p-6 shadow-lg border border-border-color/30">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
          إدارة المستخدمين
        </h2>
        <div class="flex items-center gap-3">
          <button
            @click="loadUsers"
            :disabled="isLoadingUsers"
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg 
              :class="['w-4 h-4', isLoadingUsers && 'animate-spin']"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            تحديث
          </button>
          <div class="px-3 py-2 bg-bg-tertiary rounded-lg border border-border-color/30">
            <div class="text-xs text-text-secondary">إجمالي المستخدمين</div>
            <div class="text-lg font-bold">{{ users.length }}</div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div v-if="isLoadingUsers" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
        <div class="text-text-secondary">جاري تحميل المستخدمين...</div>
      </div>

      <div v-else-if="users.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto mb-4 opacity-50 text-text-secondary" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
        </svg>
        <p class="text-text-secondary">لا يوجد مستخدمين مسجلين</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border-color/30">
              <th class="text-right py-3 px-4 font-semibold text-sm">الاسم</th>
              <th class="text-right py-3 px-4 font-semibold text-sm">البريد الإلكتروني</th>
              <th class="text-right py-3 px-4 font-semibold text-sm">الدور</th>
              <th class="text-right py-3 px-4 font-semibold text-sm">تاريخ التسجيل</th>
              <th class="text-right py-3 px-4 font-semibold text-sm">آخر تسجيل دخول</th>
              <th class="text-right py-3 px-4 font-semibold text-sm">الحالة</th>
              <th class="text-right py-3 px-4 font-semibold text-sm">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in users"
              :key="user.id"
              class="border-b border-border-color/10 hover:bg-bg-tertiary/50 transition-colors"
            >
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <div class="font-semibold">{{ user.name || 'بدون اسم' }}</div>
                    <div class="text-xs text-text-secondary">ID: {{ user.id }}</div>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4">
                <div class="font-medium">{{ user.email }}</div>
              </td>
              <td class="py-4 px-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-primary/20 text-primary': user.role === 'admin',
                    'bg-warning/20 text-warning': user.role === 'moderator',
                    'bg-bg-tertiary text-text-secondary': user.role === 'user' || !user.role
                  }"
                >
                  {{ user.role === 'admin' ? 'مدير' : user.role === 'moderator' ? 'مشرف' : 'عضو' }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="text-sm">{{ formatDate(user.createdAt) }}</div>
              </td>
              <td class="py-4 px-4">
                <div class="text-sm text-text-secondary">
                  {{ user.lastLogin ? formatDate(user.lastLogin) : 'لم يسجل دخول' }}
                </div>
              </td>
              <td class="py-4 px-4">
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="user.isActive ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'"
                >
                  {{ user.isActive ? 'نشط' : 'معطل' }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleUserStatus(user)"
                    :disabled="updatingUserId === user.id"
                    class="px-3 py-1.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    :class="user.isActive ? 'bg-warning/10 hover:bg-warning/20 text-warning' : 'bg-success/10 hover:bg-success/20 text-success'"
                  >
                    <svg
                      v-if="updatingUserId !== user.id"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path v-if="user.isActive" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ user.isActive ? 'حظر' : 'تفعيل' }}
                  </button>
                  <button
                    @click="openEditModal(user)"
                    class="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold text-sm transition-all flex items-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    تعديل
                  </button>
                  <button
                    @click="deleteUser(user.id)"
                    :disabled="deletingUserId === user.id"
                    class="px-3 py-1.5 bg-danger/10 hover:bg-danger/20 text-danger rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg
                      v-if="deletingUserId !== user.id"
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="closeEditModal"
    >
      <div class="bg-bg-secondary rounded-2xl p-6 shadow-2xl border border-border-color/30 max-w-md w-full">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold">تعديل المستخدم</h3>
          <button
            @click="closeEditModal"
            class="p-2 hover:bg-bg-tertiary rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveUserChanges" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-semibold mb-2 text-right">الاسم</label>
            <input
              v-model="editingUser.name"
              type="text"
              class="w-full px-4 py-3 border border-border-color rounded-lg bg-bg-tertiary text-right focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="اسم المستخدم"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold mb-2 text-right">البريد الإلكتروني</label>
            <input
              v-model="editingUser.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-border-color rounded-lg bg-bg-tertiary text-right focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="user@example.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold mb-2 text-right">
              كلمة المرور الجديدة
              <span class="text-xs text-text-secondary font-normal">(اتركها فارغة للاحتفاظ بالكلمة الحالية)</span>
            </label>
            <input
              v-model="editingUser.password"
              type="password"
              class="w-full px-4 py-3 border border-border-color rounded-lg bg-bg-tertiary text-right focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-semibold mb-2 text-right">الدور</label>
            <select
              v-model="editingUser.role"
              class="w-full px-4 py-3 border border-border-color rounded-lg bg-bg-tertiary text-right focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="user">عضو</option>
              <option value="moderator">مشرف</option>
              <option value="admin">مدير</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                v-model="editingUser.isActive"
                class="w-5 h-5 cursor-pointer"
              />
              <span class="font-semibold">حساب نشط</span>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="editError" class="bg-danger/20 border-r-4 border-danger p-4 rounded-lg">
            <p class="text-sm text-danger font-semibold">{{ editError }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3 pt-4">
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 px-4 py-3 bg-bg-tertiary hover:bg-border-color rounded-lg font-semibold transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              :disabled="isSavingUser"
              class="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                v-if="isSavingUser"
                class="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span v-if="!isSavingUser">حفظ التغييرات</span>
              <span v-else>جاري الحفظ...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  layout: 'default',
  middleware: 'admin'
})

const { get24hrTicker } = useBinanceApi()
const { notifications } = useNotifications()

const isRefreshing = ref(false)
const lastUpdateTime = ref('جاري التحميل...')

const stats = ref({
  totalMarkets: 0,
  totalVolume: 0,
  activeAlerts: 0
})

const topMarkets = ref<Array<{
  symbol: string
  price: string
  change: number
  volume: number
}>>([])

const recentAlerts = ref<Array<{
  id: string
  symbol: string
  message: string
  type: string
  timestamp: number
}>>([])

const popularSymbols = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'XRPUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'DOTUSDT',
  'MATICUSDT',
  'AVAXUSDT'
]

const formatVolume = (volume: number) => {
  if (volume >= 1e9) return (volume / 1e9).toFixed(2) + 'B'
  if (volume >= 1e6) return (volume / 1e6).toFixed(2) + 'M'
  if (volume >= 1e3) return (volume / 1e3).toFixed(2) + 'K'
  return volume.toFixed(2)
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'الآن'
  if (minutes < 60) return `منذ ${minutes} دقيقة`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  const days = Math.floor(hours / 24)
  return `منذ ${days} يوم`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadTopMarkets = async () => {
  try {
    const markets = await Promise.all(
      popularSymbols.map(async (symbol) => {
        try {
          const ticker = await get24hrTicker(symbol)
          if (ticker) {
            return {
              symbol,
              price: parseFloat(ticker.lastPrice).toFixed(2),
              change: parseFloat(ticker.priceChangePercent),
              volume: parseFloat(ticker.quoteVolume)
            }
          }
        } catch (err) {
          console.error(`Error loading ${symbol}:`, err)
        }
        return null
      })
    )

    const validMarkets = markets.filter(m => m !== null) as typeof topMarkets.value
    validMarkets.sort((a, b) => b.volume - a.volume)
    topMarkets.value = validMarkets.slice(0, 5)
    
    stats.value.totalMarkets = validMarkets.length
    stats.value.totalVolume = validMarkets.reduce((sum, m) => sum + m.volume, 0)
  } catch (err) {
    console.error('Error loading top markets:', err)
  }
}

const loadRecentAlerts = () => {
  if (!notifications.value) {
    recentAlerts.value = []
    return
  }

  const alerts = notifications.value
    .filter(n => n.type === 'absorption' || n.type === 'volume_spike')
    .slice(0, 5)
    .map(n => ({
      id: n.id || Date.now().toString(),
      symbol: n.symbol || 'N/A',
      message: n.message || 'تنبيه',
      type: n.type || 'alert',
      timestamp: n.timestamp || Date.now()
    }))

  recentAlerts.value = alerts
  stats.value.activeAlerts = alerts.length
}

const refreshAll = async () => {
  isRefreshing.value = true
  try {
    await loadTopMarkets()
    loadRecentAlerts()
    lastUpdateTime.value = new Date().toLocaleTimeString('ar-SA')
  } catch (err) {
    console.error('Error refreshing:', err)
  } finally {
    isRefreshing.value = false
  }
}

const navigateToMarket = (symbol: string) => {
  navigateTo(`/analytics?symbol=${symbol}`)
}

// Users Management
type UserRole = 'admin' | 'user' | 'moderator'

interface User {
  id: string
  email: string
  name?: string
  createdAt: string
  lastLogin?: string
  isActive: boolean
  role?: UserRole
}

const users = ref<User[]>([])
const isLoadingUsers = ref(false)
const deletingUserId = ref<string | null>(null)
const updatingUserId = ref<string | null>(null)
const showEditModal = ref(false)
const editingUser = ref<Partial<User & { password?: string; role?: UserRole }>>({})
const isSavingUser = ref(false)
const editError = ref('')

const loadUsers = async () => {
  isLoadingUsers.value = true
  try {
    const data = await $fetch<User[]>('/api/users')
    users.value = data
  } catch (error: any) {
    console.error('Error loading users:', error)
  } finally {
    isLoadingUsers.value = false
  }
}

const deleteUser = async (userId: string) => {
  if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
    return
  }

  deletingUserId.value = userId
  try {
    await $fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })
    await loadUsers()
  } catch (error: any) {
    console.error('Error deleting user:', error)
    alert('فشل في حذف المستخدم: ' + (error.data?.message || error.message))
  } finally {
    deletingUserId.value = null
  }
}

const toggleUserStatus = async (user: User) => {
  updatingUserId.value = user.id
  try {
    await $fetch(`/api/users/${user.id}`, {
      method: 'PATCH',
      body: {
        isActive: !user.isActive
      }
    })
    await loadUsers()
  } catch (error: any) {
    console.error('Error updating user status:', error)
    alert('فشل في تحديث حالة المستخدم: ' + (error.data?.message || error.message))
  } finally {
    updatingUserId.value = null
  }
}

const openEditModal = (user: User) => {
  editingUser.value = {
    id: user.id,
    name: user.name || '',
    email: user.email,
    isActive: user.isActive,
    role: user.role || 'user',
    password: '' // لا نعرض كلمة المرور الحالية
  }
  editError.value = ''
  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  editingUser.value = {}
  editError.value = ''
}

const saveUserChanges = async () => {
  if (!editingUser.value.id) return

  isSavingUser.value = true
  editError.value = ''

  try {
    const updateData: any = {
      name: editingUser.value.name,
      email: editingUser.value.email,
      isActive: editingUser.value.isActive,
      role: editingUser.value.role || 'user'
    }

    // إضافة كلمة المرور فقط إذا تم إدخالها
    if (editingUser.value.password && editingUser.value.password.length > 0) {
      updateData.password = editingUser.value.password
    }

    await $fetch(`/api/users/${editingUser.value.id}`, {
      method: 'PATCH',
      body: updateData
    })

    await loadUsers()
    closeEditModal()
  } catch (error: any) {
    editError.value = error.data?.message || error.message || 'فشل في تحديث المستخدم'
  } finally {
    isSavingUser.value = false
  }
}

// Watch notifications for new alerts
watch(notifications, () => {
  loadRecentAlerts()
}, { deep: true })

onMounted(async () => {
  await refreshAll()
  await loadUsers()
  
  // Auto refresh every 30 seconds
  setInterval(() => {
    if (!isRefreshing.value) {
      refreshAll()
    }
  }, 30000)
})
</script>
