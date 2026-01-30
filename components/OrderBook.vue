<template>
  <div class="bg-bg-secondary rounded-2xl p-6 shadow-lg border border-border-color/30 dark:border-border-color dark:shadow-2xl">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold">دفتر الأوامر</h3>
          <p class="text-xs text-text-secondary">{{ symbol }}</p>
        </div>
      </div>
      
      <!-- Iceberg Indicator Button -->
      <button
        v-if="getIcebergSummary().total > 0"
        @click="showIcebergPanel = !showIcebergPanel"
        :class="[
          'px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg border-2',
          getIcebergSummary().strongBids > 0 || getIcebergSummary().strongAsks > 0
            ? 'bg-warning text-white border-warning animate-pulse'
            : 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30'
        ]"
      >
        <span class="text-lg">🧊</span>
        <div class="flex items-center gap-2">
          <div v-if="getIcebergSummary().bids > 0" class="flex items-center gap-1 bg-success/20 px-2 py-0.5 rounded">
            <svg class="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-success">{{ getIcebergSummary().bids }}</span>
          </div>
          <div v-if="getIcebergSummary().asks > 0" class="flex items-center gap-1 bg-danger/20 px-2 py-0.5 rounded">
            <svg class="w-3 h-3 text-danger" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span class="text-danger">{{ getIcebergSummary().asks }}</span>
          </div>
        </div>
      </button>
    </div>

    <div v-if="error" class="text-center py-8 text-danger">
      {{ error }}
    </div>

    <!-- Empty State when no Icebergs detected yet -->
    <div v-if="getIcebergSummary().total === 0" class="mb-6 bg-bg-tertiary/30 rounded-xl p-6 border border-border-color/30 dark:border-border-color text-center">
      <div class="text-4xl mb-3">🧊</div>
      <div class="text-sm font-bold text-text-secondary mb-2">جاري البحث عن أوامر Iceberg المخفية...</div>
      <div class="text-xs text-text-secondary">
        يتم تحليل دفتر الأوامر بشكل مستمر لكشف أوامر الحيتان المخفية
      </div>
    </div>

    <!-- Iceberg Orders Panel -->
    <div v-if="showIcebergPanel && getIcebergSummary().total > 0" class="mb-6 bg-gradient-to-br from-warning/10 to-primary/5 dark:from-warning/5 dark:to-primary/5 rounded-xl p-5 border border-warning/20 dark:border-warning shadow-lg dark:shadow-2xl">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🧊</span>
          <div>
            <h4 class="text-lg font-bold text-warning">أوامر Iceberg المكتشفة</h4>
            <p class="text-xs text-text-secondary">أوامر مخفية ضخمة من الحيتان</p>
          </div>
        </div>
        <button
          @click="showIcebergPanel = false"
          class="p-2 rounded-lg hover:bg-bg-tertiary transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="bg-success/10 dark:bg-success/5 rounded-lg p-3 border border-success/20 dark:border-success">
          <div class="text-xs text-text-secondary mb-1">أوامر شراء</div>
          <div class="text-xl font-bold text-success">{{ getIcebergSummary().bids }}</div>
          <div v-if="getIcebergSummary().strongBids > 0" class="text-xs text-success mt-1">
            🔥 {{ getIcebergSummary().strongBids }} قوي
          </div>
        </div>
        <div class="bg-danger/10 dark:bg-danger/5 rounded-lg p-3 border border-danger/20 dark:border-danger">
          <div class="text-xs text-text-secondary mb-1">أوامر بيع</div>
          <div class="text-xl font-bold text-danger">{{ getIcebergSummary().asks }}</div>
          <div v-if="getIcebergSummary().strongAsks > 0" class="text-xs text-danger mt-1">
            🔥 {{ getIcebergSummary().strongAsks }} قوي
          </div>
        </div>
        <div class="bg-warning/10 dark:bg-warning/5 rounded-lg p-3 border border-warning/20 dark:border-warning">
          <div class="text-xs text-text-secondary mb-1">إجمالي</div>
          <div class="text-xl font-bold text-warning">{{ getIcebergSummary().total }}</div>
          <div class="text-xs text-text-secondary mt-1">أمر مخفي</div>
        </div>
      </div>

      <!-- Recent Icebergs -->
      <div class="space-y-2">
        <h5 class="text-sm font-bold text-text-secondary mb-2 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
          </svg>
          آخر الأوامر المكتشفة ({{ detectedIcebergs.length > 5 ? '5 من ' + detectedIcebergs.length : detectedIcebergs.length }})
        </h5>
        <div v-for="iceberg in detectedIcebergs.slice(0, 5)" :key="`${iceberg.price}-${iceberg.timestamp}`"
          :class="[
            'p-3 rounded-lg border transition-all hover:shadow-lg cursor-pointer',
            iceberg.side === 'bid' 
              ? 'bg-success/5 dark:bg-success/5 border-success/30 dark:border-success hover:border-success' 
              : 'bg-danger/5 dark:bg-danger/5 border-danger/30 dark:border-danger hover:border-danger'
          ]"
          :title="`كُشف منذ ${Math.round((Date.now() - iceberg.timestamp) / 1000)} ثانية`"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="[
                'w-10 h-10 rounded-full flex items-center justify-center shadow-lg',
                iceberg.side === 'bid' ? 'bg-success' : 'bg-danger'
              ]">
                <svg v-if="iceberg.side === 'bid'" class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                </svg>
                <svg v-else class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <div class="font-mono font-bold text-sm">{{ iceberg.price }}</div>
                  <span :class="[
                    'text-xs font-bold px-2 py-0.5 rounded',
                    iceberg.side === 'bid' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                  ]">
                    {{ iceberg.side === 'bid' ? 'شراء' : 'بيع' }}
                  </span>
                </div>
                <div class="text-xs text-text-secondary flex items-center gap-2 mt-1">
                  <span>🔄 {{ iceberg.refillCount }}x</span>
                  <span>•</span>
                  <span>{{ iceberg.strength }}</span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div :class="[
                'text-xs px-2 py-1 rounded font-bold',
                iceberg.confidence >= 90 ? 'bg-success text-white' :
                iceberg.confidence >= 75 ? 'bg-warning text-white' :
                'bg-primary text-white'
              ]">
                ثقة {{ iceberg.confidence }}%
              </div>
              <div class="text-xs text-text-secondary mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd"/>
                </svg>
                {{ formatNumber(iceberg.detectedQty) }}
              </div>
              <div class="text-xs text-warning/70 mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                {{ getTimeAgo(iceberg.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- توازن دفتر الأوامر - Visual Balance Bars -->
    <div v-if="orderBook && imbalance" class="mb-6 bg-bg-tertiary/50 dark:bg-bg-tertiary/20 rounded-xl p-5 border border-border-color/30 dark:border-border-color">
      <div class="text-sm font-bold text-center mb-4 flex items-center justify-center gap-2">
        <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        توازن دفتر الأوامر
      </div>
      
      <!-- Sell Pressure Bar -->
      <div class="mb-4">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-bold text-danger flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            ضغط البيع
          </span>
          <span class="text-text-secondary">{{ sellPressurePercent }}%</span>
        </div>
        <div class="relative h-8 bg-bg-primary/50 dark:bg-bg-primary/20 rounded-lg overflow-hidden border border-danger/30 dark:border-danger">
          <div 
            class="absolute top-0 right-0 h-full bg-gradient-to-l from-danger to-red-700 transition-all duration-500 ease-out flex items-center justify-center"
            :style="{ width: `${sellPressurePercent}%` }"
          >
            <span v-if="sellPressurePercent > 15" class="text-xs font-bold text-white px-2">{{ totalAsks }}</span>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span v-if="sellPressurePercent <= 15" class="text-xs font-bold text-text-primary">{{ totalAsks }}</span>
          </div>
        </div>
      </div>
      
      <!-- Buy Pressure Bar -->
      <div>
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-bold text-success flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            ضغط الشراء
          </span>
          <span class="text-text-secondary">{{ buyPressurePercent }}%</span>
        </div>
        <div class="relative h-8 bg-bg-primary/50 dark:bg-bg-primary/20 rounded-lg overflow-hidden border border-success/30 dark:border-success">
          <div 
            class="absolute top-0 right-0 h-full bg-gradient-to-l from-success to-green-700 transition-all duration-500 ease-out flex items-center justify-center"
            :style="{ width: `${buyPressurePercent}%` }"
          >
            <span v-if="buyPressurePercent > 15" class="text-xs font-bold text-white px-2">{{ totalBids }}</span>
          </div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span v-if="buyPressurePercent <= 15" class="text-xs font-bold text-text-primary">{{ totalBids }}</span>
          </div>
        </div>
      </div>

      <!-- Advanced Balance Analysis - تحليل متقدم على فريم دقيقة واحدة -->
      <div class="mt-4 pt-4 border-t border-border-color">
        <!-- Progress Bar (عند جمع البيانات) -->
        <div v-if="advancedImbalance.status !== 'جاهز'" class="mb-3">
          <div class="flex items-center justify-between text-xs text-text-secondary mb-2">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"/>
              </svg>
              {{ advancedImbalance.status }}
            </span>
            <span>{{ advancedImbalance.progress }}%</span>
          </div>
          <div class="h-2 bg-bg-primary rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-primary to-accent-primary transition-all duration-500"
              :style="{ width: `${advancedImbalance.progress}%` }"
            ></div>
          </div>
        </div>

        <!-- النتيجة النهائية المتقدمة -->
        <div v-else>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-text-secondary flex items-center gap-1">
              <svg class="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              تحليل دقيقة واحدة:
            </span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-text-secondary">مستوى الثقة:</span>
              <div class="flex items-center gap-1">
                <div class="h-2 w-16 bg-bg-primary rounded-full overflow-hidden">
                  <div 
                    class="h-full transition-all duration-500"
                    :class="advancedImbalance.confidence > 70 ? 'bg-success' : advancedImbalance.confidence > 40 ? 'bg-warning' : 'bg-danger'"
                    :style="{ width: `${advancedImbalance.confidence}%` }"
                  ></div>
                </div>
                <span class="text-xs font-bold" :class="advancedImbalance.confidence > 70 ? 'text-success' : advancedImbalance.confidence > 40 ? 'text-warning' : 'text-danger'">
                  {{ Math.round(advancedImbalance.confidence) }}%
                </span>
              </div>
            </div>
          </div>

          <div 
            :class="[
              'p-4 rounded-xl border transition-all duration-300 shadow-md dark:shadow-lg',
              advancedImbalance.bgColor,
              advancedImbalance.borderColor
            ]"
          >
            <div class="flex flex-col gap-3">
              <!-- الصف الأول: الاتجاه -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="text-3xl">{{ advancedImbalance.icon }}</span>
                  <div>
                    <div :class="['text-lg font-extrabold', advancedImbalance.color]">
                      {{ advancedImbalance.trend }}
                    </div>
                    <div class="text-xs text-text-secondary mt-1">
                      متوسط التوازن: {{ advancedImbalance.avgValue.toFixed(2) }}%
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-text-secondary mb-1">قوة الاتجاه</div>
                  <div :class="['text-2xl font-bold', advancedImbalance.color]">
                    {{ advancedImbalance.strength.toFixed(1) }}%
                  </div>
                </div>
              </div>

              <!-- الصف الثاني: التوصية واحتمال الربح -->
              <div class="flex items-center justify-between pt-3 border-t border-border-color">
                <div>
                  <div class="text-xs text-text-secondary mb-1">التوصية:</div>
                  <div :class="['text-base font-bold', advancedImbalance.color]">
                    {{ advancedImbalance.recommendation }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-text-secondary mb-1">احتمال الربح:</div>
                  <div :class="[
                    'text-2xl font-black',
                    advancedImbalance.profitPotential >= 30 ? 'text-success' :
                    advancedImbalance.profitPotential >= 20 ? 'text-warning' :
                    'text-text-secondary'
                  ]">
                    +{{ advancedImbalance.profitPotential }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- تفاصيل إضافية -->
          <div class="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div class="bg-bg-primary rounded-lg p-2">
              <span class="text-text-secondary">عدد القراءات:</span>
              <span class="font-bold text-primary mr-1">{{ imbalanceHistory.length }}/{{ MAX_HISTORY }}</span>
            </div>
            <div class="bg-bg-primary rounded-lg p-2">
              <span class="text-text-secondary">الاستقرار:</span>
              <span class="font-bold text-primary mr-1">
                {{ (advancedImbalance.stdDev || 0) < 5 ? 'مستقر جداً' : (advancedImbalance.stdDev || 0) < 10 ? 'مستقر' : 'متقلب' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div v-if="orderBook" class="grid grid-cols-3 gap-3 mb-6">
      <div class="bg-bg-tertiary/50 dark:bg-bg-tertiary/20 rounded-lg p-3 border border-border-color/30 dark:border-border-color">
        <div class="text-xs text-text-secondary mb-1">إجمالي عروض البيع</div>
        <div class="text-lg font-bold text-danger">{{ totalAsks }}</div>
      </div>
      <div class="bg-bg-tertiary/50 dark:bg-bg-tertiary/20 rounded-lg p-3 border border-border-color/30 dark:border-border-color">
        <div class="text-xs text-text-secondary mb-1">إجمالي عروض الشراء</div>
        <div class="text-lg font-bold text-success">{{ totalBids }}</div>
      </div>
      <div class="bg-bg-tertiary/50 dark:bg-bg-tertiary/20 rounded-lg p-3 border border-border-color/30 dark:border-border-color">
        <div class="text-xs text-text-secondary mb-1">نسبة السيولة</div>
        <div class="text-lg font-bold text-primary">{{ liquidityRatio }}</div>
      </div>
    </div>

    <div v-else class="grid grid-cols-2 gap-6">
      <!-- Asks (Sell Orders) -->
      <div class="relative bg-bg-tertiary/30 dark:bg-bg-tertiary/10 rounded-xl p-4 border border-danger/20 dark:border-danger">
        <div class="sticky top-0 bg-gradient-to-b from-bg-secondary via-bg-secondary to-transparent z-10 pb-3 mb-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-danger rounded-full animate-pulse"></div>
              <span class="text-sm font-bold text-danger">عروض البيع</span>
            </div>
            <div class="text-xs text-text-secondary font-mono">
              السعر • الكمية • الإجمالي
            </div>
          </div>
        </div>
        <div class="space-y-0.5 max-h-[500px] overflow-y-auto custom-scrollbar">
          <div
            v-for="(ask, index) in asks"
            :key="`ask-${ask.price}-${ask.qty}-${index}`"
            class="group relative flex items-center justify-between text-xs py-2 px-3 rounded-lg hover:bg-danger/10 dark:hover:bg-danger/20 transition-all cursor-pointer border border-transparent hover:border-danger/40 dark:hover:border-danger/30"
          >
            <!-- Background bar showing depth -->
            <div 
              class="absolute inset-0 rounded-lg transition-all"
              :style="{ 
                background: `linear-gradient(to left, rgba(239, 68, 68, ${getDepthIntensity(ask.qty, asks)}), transparent)`
              }"
            ></div>
            
            <div class="relative z-10 flex items-center justify-between w-full">
              <div class="flex items-center gap-1 w-32">
                <span class="text-danger font-mono font-bold text-left">{{ formatPrice(ask.price) }}</span>
                <span v-if="hasIcebergAtPrice(ask.price, 'ask')" 
                  class="text-xs animate-pulse"
                  :title="`Iceberg مكتشف - ثقة ${hasIcebergAtPrice(ask.price, 'ask')?.confidence}%`"
                >
                  🧊
                </span>
              </div>
              <span class="text-text-secondary font-mono w-24 text-center">{{ formatQty(ask.qty) }}</span>
              <span class="text-text-primary font-mono font-semibold w-28 text-right">{{ formatTotal(ask.price, ask.qty) }}</span>
            </div>
            
            <!-- Hover indicator -->
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-full bg-danger transition-all rounded-r-lg"></div>
          </div>
        </div>
      </div>

      <!-- Bids (Buy Orders) -->
      <div class="relative bg-bg-tertiary/30 dark:bg-bg-tertiary/10 rounded-xl p-4 border border-success/20 dark:border-success">
        <div class="sticky top-0 bg-gradient-to-b from-bg-secondary via-bg-secondary to-transparent z-10 pb-3 mb-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span class="text-sm font-bold text-success">عروض الشراء</span>
            </div>
            <div class="text-xs text-text-secondary font-mono">
              السعر • الكمية • الإجمالي
            </div>
          </div>
        </div>
        <div class="space-y-0.5 max-h-[500px] overflow-y-auto custom-scrollbar">
          <div
            v-for="(bid, index) in bids"
            :key="`bid-${bid.price}-${bid.qty}-${index}`"
            class="group relative flex items-center justify-between text-xs py-2 px-3 rounded-lg hover:bg-success/10 dark:hover:bg-success/20 transition-all cursor-pointer border border-transparent hover:border-success/40 dark:hover:border-success/30"
          >
            <!-- Background bar showing depth -->
            <div 
              class="absolute inset-0 rounded-lg transition-all"
              :style="{ 
                background: `linear-gradient(to left, rgba(34, 197, 94, ${getDepthIntensity(bid.qty, bids)}), transparent)`
              }"
            ></div>
            
            <div class="relative z-10 flex items-center justify-between w-full">
              <div class="flex items-center gap-1 w-32">
                <span class="text-success font-mono font-bold text-left">{{ formatPrice(bid.price) }}</span>
                <span v-if="hasIcebergAtPrice(bid.price, 'bid')" 
                  class="text-xs animate-pulse"
                  :title="`Iceberg مكتشف - ثقة ${hasIcebergAtPrice(bid.price, 'bid')?.confidence}%`"
                >
                  🧊
                </span>
              </div>
              <span class="text-text-secondary font-mono w-24 text-center">{{ formatQty(bid.qty) }}</span>
              <span class="text-text-primary font-mono font-semibold w-28 text-right">{{ formatTotal(bid.price, bid.qty) }}</span>
            </div>
            
            <!-- Hover indicator -->
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-full bg-success transition-all rounded-r-lg"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Spread Info -->
    <div v-if="spread" class="mt-6 p-4 bg-bg-tertiary/50 dark:bg-bg-tertiary/20 rounded-xl border border-border-color/30 dark:border-border-color">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <div class="text-xs text-text-secondary mb-1">أفضل سعر بيع</div>
          <div class="text-sm font-bold text-danger">{{ bestAskPrice }}</div>
        </div>
        <div>
          <div class="text-xs text-text-secondary mb-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
              <path fill-rule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V7a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            الفرق (Spread)
          </div>
          <div class="text-sm font-bold" :class="spread.percentage > 0.1 ? 'text-warning' : 'text-primary'">
            {{ spread.value }} ({{ spread.percentage.toFixed(4) }}%)
          </div>
        </div>
        <div>
          <div class="text-xs text-text-secondary mb-1">أفضل سعر شراء</div>
          <div class="text-sm font-bold text-success">{{ bestBidPrice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderBook } from '~/composables/useBinanceApi'

interface Props {
  symbol: string
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 50
})

const { getOrderBook } = useBinanceApi()
const { calculateOrderBookImbalance } = useMarketAnalytics()
const { detectIcebergs, detectedIcebergs, getIcebergSummary, hasIcebergAtPrice } = useIcebergDetector()

const orderBook = ref<OrderBook | null>(null)
const error = ref<string | null>(null)
let updateInterval: NodeJS.Timeout | null = null
const showIcebergPanel = ref(false)
const lastIcebergCount = ref(0)

// نظام التحليل المتقدم للتوازن - تحليل على فريم دقيقة واحدة
interface ImbalanceReading {
  value: number // قيمة التوازن
  isBullish: boolean // صعودي أم هبوطي
  timestamp: number // الوقت
}

const imbalanceHistory = ref<ImbalanceReading[]>([])
const MAX_HISTORY = 12 // 12 قراءة × 5 ثواني = دقيقة واحدة
const MIN_READINGS = 6 // الحد الأدنى للقراءات لنتيجة موثوقة (30 ثانية)

const bids = computed(() => {
  if (!orderBook.value) return []
  return orderBook.value.bids.slice(0, props.limit).reverse()
})

const asks = computed(() => {
  if (!orderBook.value) return []
  return orderBook.value.asks.slice(0, props.limit)
})

const imbalance = computed(() => {
  if (!orderBook.value) return null
  return calculateOrderBookImbalance(orderBook.value)
})

const spread = computed(() => {
  if (!orderBook.value || asks.value.length === 0 || bids.value.length === 0) return null
  
  const bestAsk = parseFloat(asks.value[0].price)
  const bestBid = parseFloat(bids.value[0].price)
  const spreadValue = bestAsk - bestBid
  const spreadPercentage = (spreadValue / bestBid) * 100
  
  return {
    value: spreadValue.toFixed(8),
    percentage: spreadPercentage
  }
})

const getIntensity = (index: number, total: number) => {
  // شفافية متدرجة حسب القرب من أفضل سعر
  return Math.max(0.05, 0.3 - (index / total) * 0.25)
}

const getDepthIntensity = (qty: string, orders: any[]) => {
  // حساب عمق السيولة نسبة إلى أكبر أمر
  const qtyNum = parseFloat(qty)
  const maxQty = Math.max(...orders.map(o => parseFloat(o.qty)))
  return Math.max(0.1, (qtyNum / maxQty) * 0.4)
}

const totalAsks = computed(() => {
  if (!orderBook.value) return '0'
  const total = orderBook.value.asks
    .slice(0, props.limit)
    .reduce((sum, ask) => sum + parseFloat(ask.qty), 0)
  return formatQty(total.toString())
})

const totalBids = computed(() => {
  if (!orderBook.value) return '0'
  const total = orderBook.value.bids
    .slice(0, props.limit)
    .reduce((sum, bid) => sum + parseFloat(bid.qty), 0)
  return formatQty(total.toString())
})

const liquidityRatio = computed(() => {
  if (!orderBook.value) return '1:1'
  const asksTotal = orderBook.value.asks
    .slice(0, props.limit)
    .reduce((sum, ask) => sum + parseFloat(ask.qty), 0)
  const bidsTotal = orderBook.value.bids
    .slice(0, props.limit)
    .reduce((sum, bid) => sum + parseFloat(bid.qty), 0)
  
  if (bidsTotal === 0) return '∞:1'
  const ratio = asksTotal / bidsTotal
  return `${ratio.toFixed(2)}:1`
})

const bestAskPrice = computed(() => {
  if (!orderBook.value || asks.value.length === 0) return '0.00'
  return formatPrice(asks.value[0].price)
})

const bestBidPrice = computed(() => {
  if (!orderBook.value || bids.value.length === 0) return '0.00'
  return formatPrice(bids.value[0].price)
})

// حساب نسب ضغط البيع والشراء للشريطين
const sellPressurePercent = computed(() => {
  if (!orderBook.value) return 0
  const asksTotal = orderBook.value.asks
    .slice(0, props.limit)
    .reduce((sum, ask) => sum + parseFloat(ask.qty), 0)
  const bidsTotal = orderBook.value.bids
    .slice(0, props.limit)
    .reduce((sum, bid) => sum + parseFloat(bid.qty), 0)
  
  const total = asksTotal + bidsTotal
  if (total === 0) return 50
  
  return Math.round((asksTotal / total) * 100)
})

const buyPressurePercent = computed(() => {
  if (!orderBook.value) return 0
  const asksTotal = orderBook.value.asks
    .slice(0, props.limit)
    .reduce((sum, ask) => sum + parseFloat(ask.qty), 0)
  const bidsTotal = orderBook.value.bids
    .slice(0, props.limit)
    .reduce((sum, bid) => sum + parseFloat(bid.qty), 0)
  
  const total = asksTotal + bidsTotal
  if (total === 0) return 50
  
  return Math.round((bidsTotal / total) * 100)
})

// التحليل المتقدم للتوازن - نتيجة مستقرة على فريم دقيقة واحدة
const advancedImbalance = computed(() => {
  if (imbalanceHistory.value.length < MIN_READINGS) {
    return {
      status: 'جاري جمع البيانات...',
      progress: Math.round((imbalanceHistory.value.length / MIN_READINGS) * 100),
      avgValue: 0,
      confidence: 0,
      trend: 'محايد',
      strength: 0,
      color: 'text-text-secondary',
      bgColor: 'bg-bg-tertiary',
      icon: '⏳',
      recommendation: 'انتظر',
      profitPotential: 0
    }
  }

  // حساب متوسط التوازن من آخر 12 قراءة
  const avgImbalance = imbalanceHistory.value.reduce((sum, r) => sum + r.value, 0) / imbalanceHistory.value.length
  
  // حساب الانحراف المعياري لقياس الاستقرار
  const variance = imbalanceHistory.value.reduce((sum, r) => sum + Math.pow(r.value - avgImbalance, 2), 0) / imbalanceHistory.value.length
  const stdDev = Math.sqrt(variance)
  
  // مستوى الثقة: أقل انحراف = ثقة أعلى
  const confidence = Math.max(0, Math.min(100, 100 - (stdDev * 2)))
  
  // حساب الاتجاه في آخر قراءات (هل يزداد أم ينقص؟)
  const last3 = imbalanceHistory.value.slice(-3)
  const isIncreasing = last3.length >= 3 && last3[2].value > last3[0].value
  const isDecreasing = last3.length >= 3 && last3[2].value < last3[0].value
  
  // تحديد الاتجاه والقوة والتوصية
  let trend = 'محايد'
  let strength = Math.abs(avgImbalance)
  let color = 'text-text-secondary'
  let bgColor = 'bg-bg-tertiary/50'
  let borderColor = 'border-border-color'
  let icon = '⚖️'
  let recommendation = 'انتظر'
  let profitPotential = 0
  
  // شروط صارمة جداً للإشارات القوية
  if (avgImbalance > 20 && confidence > 70 && isIncreasing) {
    trend = 'صعودي قوي جداً - فرصة استثنائية'
    color = 'text-success'
    bgColor = 'bg-success/20'
    borderColor = 'border-success'
    icon = '🚀'
    recommendation = 'شراء قوي'
    profitPotential = 40
  } else if (avgImbalance > 15 && confidence > 60) {
    trend = 'صعودي قوي - فرصة ممتازة'
    color = 'text-success'
    bgColor = 'bg-success/15'
    borderColor = 'border-success/70'
    icon = '📈'
    recommendation = 'شراء'
    profitPotential = 30
  } else if (avgImbalance > 10 && confidence > 50) {
    trend = 'صعودي - فرصة جيدة'
    color = 'text-success'
    bgColor = 'bg-success/10'
    borderColor = 'border-success/50'
    icon = '↗️'
    recommendation = 'شراء حذر'
    profitPotential = 20
  } else if (avgImbalance > 5) {
    trend = 'صعودي خفيف'
    color = 'text-success'
    bgColor = 'bg-success/5'
    borderColor = 'border-success/30'
    icon = '↗️'
    recommendation = 'مراقبة'
    profitPotential = 10
  } else if (avgImbalance < -20 && confidence > 70 && isDecreasing) {
    trend = 'هبوطي قوي جداً - تحذير شديد'
    color = 'text-danger'
    bgColor = 'bg-danger/20'
    borderColor = 'border-danger'
    icon = '🔻'
    recommendation = 'بيع قوي'
    profitPotential = 40
  } else if (avgImbalance < -15 && confidence > 60) {
    trend = 'هبوطي قوي - تحذير'
    color = 'text-danger'
    bgColor = 'bg-danger/15'
    borderColor = 'border-danger/70'
    icon = '📉'
    recommendation = 'بيع'
    profitPotential = 30
  } else if (avgImbalance < -10 && confidence > 50) {
    trend = 'هبوطي - حذر'
    color = 'text-danger'
    bgColor = 'bg-danger/10'
    borderColor = 'border-danger/50'
    icon = '↘️'
    recommendation = 'بيع حذر'
    profitPotential = 20
  } else if (avgImbalance < -5) {
    trend = 'هبوطي خفيف'
    color = 'text-danger'
    bgColor = 'bg-danger/5'
    borderColor = 'border-danger/30'
    icon = '↘️'
    recommendation = 'مراقبة'
    profitPotential = 10
  }
  
  return {
    status: 'جاهز',
    progress: 100,
    avgValue: avgImbalance,
    confidence,
    trend,
    strength,
    color,
    bgColor,
    borderColor,
    icon,
    stdDev,
    recommendation,
    profitPotential
  }
})

const formatPrice = (price: string) => {
  const num = parseFloat(price)
  if (isNaN(num)) return '0.00'
  if (num >= 1) return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (num >= 0.01) return num.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
  return num.toLocaleString('en-US', { minimumFractionDigits: 8, maximumFractionDigits: 8 })
}

const formatQty = (qty: string) => {
  const num = parseFloat(qty)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })
}

const formatTotal = (price: string, qty: string) => {
  const priceNum = parseFloat(price)
  const qtyNum = parseFloat(qty)
  if (isNaN(priceNum) || isNaN(qtyNum)) return '0.00'
  return (priceNum * qtyNum).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatNumber = (num: number) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

const getTimeAgo = (timestamp: number) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return `منذ ${seconds}ث`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `منذ ${minutes}د`
  const hours = Math.floor(minutes / 60)
  return `منذ ${hours}س`
}

// تشغيل نغمة تنبيه Iceberg
const playIcebergAlert = (type: 'bid' | 'ask') => {
  if (!import.meta.client) return
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.type = 'sine'
    
    if (type === 'bid') {
      // نغمة خاصة لأوامر الشراء المخفية (صعودية قوية)
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4
      oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1) // C#5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2) // E5
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.3) // A5
    } else {
      // نغمة خاصة لأوامر البيع المخفية (هبوطية قوية)
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime) // A5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
      oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.2) // C#5
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.3) // A4
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (err) {
    console.error('Error playing Iceberg alert sound:', err)
  }
}

// إرسال إشعار Iceberg
const sendIcebergNotification = (iceberg: any) => {
  if (!import.meta.client) return
  
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`🧊 كشف أمر Iceberg ${iceberg.side === 'bid' ? 'شراء' : 'بيع'}`, {
      body: `السعر: ${iceberg.price} | القوة: ${iceberg.strength} | الثقة: ${iceberg.confidence}%`,
      icon: '/favicon.ico',
      tag: 'iceberg-alert'
    })
  }
}

const loadOrderBook = async () => {
  try {
    error.value = null
    const data = await getOrderBook(props.symbol, 100)
    
    // تحديث سلس بدون re-render كامل
    if (orderBook.value) {
      orderBook.value.bids = data.bids
      orderBook.value.asks = data.asks
      orderBook.value.lastUpdateId = data.lastUpdateId
    } else {
      orderBook.value = data
    }

    // كشف أوامر Iceberg
    detectIcebergs(data)

    // إضافة القراءة الحالية إلى تاريخ التوازن
    if (imbalance.value) {
      imbalanceHistory.value.push({
        value: imbalance.value.imbalance,
        isBullish: imbalance.value.isBullish,
        timestamp: Date.now()
      })

      // الاحتفاظ بآخر 12 قراءة فقط (دقيقة واحدة)
      if (imbalanceHistory.value.length > MAX_HISTORY) {
        imbalanceHistory.value.shift()
      }
    }
  } catch (err: any) {
    console.error('Order Book Error:', err)
    error.value = err.message || 'حدث خطأ في تحميل Order Book'
  }
}

onMounted(() => {
  loadOrderBook()
  // تحديث كل 5 ثواني بدلاً من 2 ثانية لتجنب التغييرات السريعة المزعجة
  updateInterval = setInterval(loadOrderBook, 5000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

watch(() => props.symbol, () => {
  orderBook.value = null
  imbalanceHistory.value = [] // إعادة تعيين تاريخ التوازن
  lastIcebergCount.value = 0
  loadOrderBook()
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  // تحديث كل 5 ثواني
  updateInterval = setInterval(loadOrderBook, 5000)
})

// مراقبة أوامر Iceberg الجديدة
watch(detectedIcebergs, (newIcebergs, oldIcebergs) => {
  // التحقق من وجود أوامر Iceberg قوية جديدة
  if (newIcebergs.length > lastIcebergCount.value) {
    const latestIceberg = newIcebergs[0]
    
    // فقط للأوامر القوية جداً أو القوية
    if ((latestIceberg.strength === 'قوي جداً' || latestIceberg.strength === 'قوي') && 
        latestIceberg.confidence >= 80) {
      // تشغيل النغمة
      playIcebergAlert(latestIceberg.side)
      
      // إرسال الإشعار
      sendIcebergNotification(latestIceberg)
      
      // عرض البانل تلقائياً
      showIcebergPanel.value = true
    }
  }
  
  lastIcebergCount.value = newIcebergs.length
}, { deep: true })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: var(--bg-tertiary);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}
</style>
