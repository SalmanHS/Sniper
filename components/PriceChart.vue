<template>
  <div class="bg-bg-secondary rounded-2xl p-6 shadow-lg border border-border-color/30 dark:border-border-color dark:shadow-2xl">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
      <div>
        <h3 class="text-2xl font-bold mb-1 bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
          مخطط الأسعار
        </h3>
        <p class="text-sm text-text-secondary">{{ symbol }}</p>
      </div>
      <div class="flex gap-2 flex-wrap">
        <!-- Indicators Toggle Button -->
        <button
          @click="showIndicatorsMenu = !showIndicatorsMenu"
          class="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-warning to-warning/80 hover:from-warning/90 hover:to-warning/70 text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
          </svg>
          المؤشرات
          <span v-if="activeIndicatorsCount > 0" class="bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-bold">
            {{ activeIndicatorsCount }}
          </span>
        </button>
        
        <div class="flex gap-2 bg-bg-tertiary p-1 rounded-lg border border-border-color/30">
          <button
            v-for="interval in intervals"
            :key="interval"
            @click="selectedInterval = interval"
            :class="[
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300',
              selectedInterval === interval
                ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg transform scale-105'
                : 'bg-transparent hover:bg-bg-secondary text-text-secondary hover:text-text-primary'
            ]"
          >
            {{ interval }}
          </button>
        </div>
      </div>
    </div>

    <!-- Indicators Menu -->
    <div v-if="showIndicatorsMenu" class="mb-6 bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary rounded-xl p-6 border border-border-color/30 shadow-xl">
      <div class="flex items-center justify-between mb-4">
        <h4 class="font-bold text-xl bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
          المؤشرات الفنية
        </h4>
        <button
          @click="showIndicatorsMenu = false"
          class="text-text-secondary hover:text-text-primary transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- EMA -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.ema.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">EMA (المتوسط المتحرك الأسي)</span>
          </label>
          <div v-if="indicators.ema.enabled" class="mt-2 flex gap-2">
            <input
              type="number"
              v-model.number="indicators.ema.period"
              @change="debouncedUpdateChart"
              min="5"
              max="200"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
            />
            <input
              type="color"
              v-model="indicators.ema.color"
              @change="debouncedUpdateChart"
              class="w-12 h-8 rounded cursor-pointer"
            />
          </div>
        </div>

        <!-- SMA -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.sma.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">SMA (المتوسط المتحرك البسيط)</span>
          </label>
          <div v-if="indicators.sma.enabled" class="mt-2 flex gap-2">
            <input
              type="number"
              v-model.number="indicators.sma.period"
              @change="debouncedUpdateChart"
              min="5"
              max="200"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
            />
            <input
              type="color"
              v-model="indicators.sma.color"
              @change="debouncedUpdateChart"
              class="w-12 h-8 rounded cursor-pointer"
            />
          </div>
        </div>

        <!-- Bollinger Bands -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.bollinger.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">Bollinger Bands</span>
          </label>
          <div v-if="indicators.bollinger.enabled" class="mt-2 flex gap-2">
            <input
              type="number"
              v-model.number="indicators.bollinger.period"
              @change="debouncedUpdateChart"
              min="10"
              max="50"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
              placeholder="الفترة"
            />
            <input
              type="number"
              v-model.number="indicators.bollinger.stdDev"
              @change="debouncedUpdateChart"
              min="1"
              max="3"
              step="0.1"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
              placeholder="الانحراف"
            />
          </div>
        </div>

        <!-- RSI -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.rsi.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">RSI (مؤشر القوة النسبية)</span>
          </label>
          <div v-if="indicators.rsi.enabled" class="mt-2 flex gap-2">
            <input
              type="number"
              v-model.number="indicators.rsi.period"
              @change="debouncedUpdateChart"
              min="5"
              max="30"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
            />
          </div>
        </div>

        <!-- MACD -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.macd.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">MACD</span>
          </label>
          <div v-if="indicators.macd.enabled" class="mt-2 text-xs text-text-secondary">
            (12, 26, 9)
          </div>
        </div>

        <!-- Volume -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="showVolume"
              @change="toggleVolume"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">📊 حجم التداول (Volume)</span>
          </label>
          <div v-if="showVolume" class="mt-2 text-xs text-text-secondary">
            يظهر أسفل الشارت
          </div>
        </div>

        <!-- Volume Profile -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.volumeProfile.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">Volume Profile</span>
          </label>
        </div>

        <!-- Stochastic Oscillator -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.stochastic.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">Stochastic (مذبذب ستوكاستيك)</span>
          </label>
          <div v-if="indicators.stochastic.enabled" class="mt-2 flex gap-2">
            <input
              type="number"
              v-model.number="indicators.stochastic.period"
              @change="debouncedUpdateChart"
              min="5"
              max="30"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
              placeholder="الفترة"
            />
            <input
              type="color"
              v-model="indicators.stochastic.color"
              @change="debouncedUpdateChart"
              class="w-12 h-8 rounded cursor-pointer"
            />
          </div>
        </div>

        <!-- ATR (Average True Range) -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.atr.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">ATR (متوسط المدى الحقيقي)</span>
          </label>
          <div v-if="indicators.atr.enabled" class="mt-2 flex gap-2">
            <input
              type="number"
              v-model.number="indicators.atr.period"
              @change="debouncedUpdateChart"
              min="5"
              max="30"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
            />
            <input
              type="color"
              v-model="indicators.atr.color"
              @change="debouncedUpdateChart"
              class="w-12 h-8 rounded cursor-pointer"
            />
          </div>
        </div>

        <!-- Williams %R -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.williamsR.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">Williams %R</span>
          </label>
          <div v-if="indicators.williamsR.enabled" class="mt-2 flex gap-2">
            <input
              type="number"
              v-model.number="indicators.williamsR.period"
              @change="debouncedUpdateChart"
              min="5"
              max="30"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
            />
          </div>
        </div>

        <!-- ADX (Average Directional Index) -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.adx.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">ADX (مؤشر الاتجاه)</span>
          </label>
          <div v-if="indicators.adx.enabled" class="mt-2 flex gap-2">
            <input
              type="number"
              v-model.number="indicators.adx.period"
              @change="debouncedUpdateChart"
              min="5"
              max="30"
              class="w-20 px-2 py-1 rounded bg-bg-tertiary border border-border-color text-sm"
            />
          </div>
        </div>

        <!-- Fibonacci Retracement -->
        <div class="bg-bg-secondary rounded-xl p-4 border border-border-color/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              v-model="indicators.fibonacci.enabled"
              @change="debouncedUpdateChart"
              class="w-4 h-4 cursor-pointer"
            />
            <span class="font-semibold">Fibonacci (خطوط فيبوناتشي)</span>
          </label>
          <div v-if="indicators.fibonacci.enabled" class="mt-2 text-xs text-text-secondary">
            مستويات: 0%, 23.6%, 38.2%, 50%, 61.8%, 100%
          </div>
        </div>
      </div>
    </div>

    <div v-if="error" class="text-center py-8 text-danger">
      {{ error }}
    </div>

    <div v-else class="space-y-4">
      <!-- Price Info Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gradient-to-br from-bg-tertiary to-bg-secondary rounded-xl p-4 border border-border-color/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-text-secondary font-medium">أعلى سعر</div>
            <svg class="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="text-2xl font-bold text-success">{{ highPrice }}</div>
        </div>
        <div class="bg-gradient-to-br from-bg-tertiary to-bg-secondary rounded-xl p-4 border border-border-color/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-text-secondary font-medium">أقل سعر</div>
            <svg class="w-5 h-5 text-danger" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="text-2xl font-bold text-danger">{{ lowPrice }}</div>
        </div>
        <div class="bg-gradient-to-br from-bg-tertiary to-bg-secondary rounded-xl p-4 border border-border-color/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-text-secondary font-medium">الحجم</div>
            <svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
            </svg>
          </div>
          <div class="text-2xl font-bold">{{ volume }}</div>
        </div>
        <div class="bg-gradient-to-br from-bg-tertiary to-bg-secondary rounded-xl p-4 border border-border-color/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs text-text-secondary font-medium">النطاق</div>
            <svg class="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
          </div>
          <div class="text-2xl font-bold">{{ getPriceRange() }}</div>
        </div>
      </div>

      <!-- Volume Spike Alert -->
      <div v-if="volumeSpike?.isSpike" class="bg-warning/20 border-r-4 border-warning p-4 rounded">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-warning" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <div>
            <div class="font-semibold text-warning">تنبيه: زيادة في الحجم</div>
            <div class="text-sm text-text-secondary">
              الحجم الحالي أعلى من المتوسط بـ {{ volumeSpike.ratio.toFixed(2) }}x
            </div>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <ClientOnly>
        <div class="relative bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary rounded-xl overflow-hidden border border-border-color/20 shadow-xl">
          <!-- Chart Header Info -->
          <div v-if="klines && klines.length > 0" class="absolute top-4 left-4 z-10 bg-bg-primary/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-border-color/30 shadow-lg">
            <div class="flex items-center gap-4">
              <div>
                <div class="text-xs text-text-secondary mb-1">السعر الحالي</div>
                <div class="text-2xl font-bold" :class="getPriceDirection() ? 'text-success' : 'text-danger'">
                  {{ currentPrice }}
                </div>
              </div>
              <div class="h-12 w-px bg-border-color"></div>
              <div>
                <div class="text-xs text-text-secondary mb-1">التغيير</div>
                <div class="text-lg font-semibold" :class="getPriceChange() >= 0 ? 'text-success' : 'text-danger'">
                  {{ getPriceChange() >= 0 ? '+' : '' }}{{ getPriceChange().toFixed(2) }}%
                </div>
              </div>
            </div>
          </div>
          
          <!-- Chart Container -->
          <div class="h-[600px] w-full relative">
            <div ref="chartContainer" class="w-full h-full"></div>
            
            <!-- Loading Overlay -->
            <div v-if="!chart && !error" class="absolute inset-0 bg-bg-tertiary/80 backdrop-blur-sm flex items-center justify-center z-20">
              <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
                <div class="text-text-secondary font-medium">جاري تحميل المخطط...</div>
              </div>
            </div>
          </div>
        </div>
        <template #fallback>
          <div class="h-[600px] bg-gradient-to-br from-bg-tertiary via-bg-secondary to-bg-tertiary rounded-xl flex items-center justify-center border border-border-color/20">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
              <div class="text-text-secondary font-medium">جاري تحميل المخطط...</div>
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Kline } from '~/composables/useBinanceApi'

const chartContainer = ref<HTMLDivElement | null>(null)
let chart: any = null
let candlestickSeries: any = null
let volumeSeries: any = null
let emaSeries: any = null
let smaSeries: any = null
let bollingerUpperSeries: any = null
let bollingerMiddleSeries: any = null
let bollingerLowerSeries: any = null
let stochasticSeries: any = null
let atrSeries: any = null
let williamsRSeries: any = null
let adxSeries: any = null
let fibonacciSeries: any[] = []

const props = defineProps<{
  symbol: string
}>()

const { getKlines } = useBinanceApi()
const { calculateVolumeSpike } = useMarketAnalytics()

const intervals = ['1m', '5m', '15m', '1h', '4h', '1d']
const selectedInterval = ref('1h')
const klines = ref<Kline[]>([])
const error = ref<string | null>(null)
const historicalVolumes = ref<number[]>([])
const showVolume = ref(true)

// Indicators State
const showIndicatorsMenu = ref(false)
const indicators = ref({
  ema: {
    enabled: false,
    period: 20,
    color: '#2196F3'
  },
  sma: {
    enabled: false,
    period: 50,
    color: '#FF9800'
  },
  bollinger: {
    enabled: false,
    period: 20,
    stdDev: 2,
    color: '#9C27B0'
  },
  rsi: {
    enabled: false,
    period: 14,
    color: '#4CAF50'
  },
  macd: {
    enabled: false,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9
  },
  volumeProfile: {
    enabled: false
  },
  stochastic: {
    enabled: false,
    period: 14,
    color: '#E91E63'
  },
  atr: {
    enabled: false,
    period: 14,
    color: '#FF5722'
  },
  williamsR: {
    enabled: false,
    period: 14
  },
  adx: {
    enabled: false,
    period: 14
  },
  fibonacci: {
    enabled: false
  }
})

const activeIndicatorsCount = computed(() => {
  let count = Object.values(indicators.value).filter(ind => ind.enabled).length
  if (showVolume.value) count++
  return count
})

// Toggle Volume Visibility
const toggleVolume = () => {
  if (!volumeSeries || !chart) return
  
  try {
    if (showVolume.value) {
      // Show volume
      volumeSeries.applyOptions({
        visible: true
      })
    } else {
      // Hide volume
      volumeSeries.applyOptions({
        visible: false
      })
    }
  } catch (err) {
    console.error('Error toggling volume:', err)
  }
}

const currentPrice = computed(() => {
  if (!klines.value || klines.value.length === 0) return '0.00'
  const last = klines.value[klines.value.length - 1]
  if (!last || !last.close) return '0.00'
  return parseFloat(last.close).toFixed(2)
})

const highPrice = computed(() => {
  if (!klines.value || klines.value.length === 0) return '0.00'
  return Math.max(...klines.value.map(k => parseFloat(k.high || 0))).toFixed(2)
})

const lowPrice = computed(() => {
  if (!klines.value || klines.value.length === 0) return '0.00'
  return Math.min(...klines.value.map(k => parseFloat(k.low || 0))).toFixed(2)
})

const volume = computed(() => {
  if (!klines.value || klines.value.length === 0) return '0.00'
  const last = klines.value[klines.value.length - 1]
  if (!last || !last.volume) return '0.00'
  const vol = parseFloat(last.volume)
  if (vol >= 1000) return (vol / 1000).toFixed(2) + 'K'
  return vol.toFixed(2)
})

const volumeSpike = computed(() => {
  if (!klines.value || klines.value.length === 0 || !historicalVolumes.value || historicalVolumes.value.length === 0) return null
  const last = klines.value[klines.value.length - 1]
  if (!last || !last.volume) return null
  const currentVolume = parseFloat(last.volume)
  return calculateVolumeSpike(currentVolume, historicalVolumes.value)
})

// Calculate price change percentage
const getPriceChange = () => {
  if (!klines.value || klines.value.length < 2) return 0
  const current = parseFloat(klines.value[klines.value.length - 1].close)
  const previous = parseFloat(klines.value[klines.value.length - 2].close)
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

// Get price direction (up or down)
const getPriceDirection = () => {
  if (!klines.value || klines.value.length < 2) return true
  const current = parseFloat(klines.value[klines.value.length - 1].close)
  const previous = parseFloat(klines.value[klines.value.length - 2].close)
  return current >= previous
}

// Calculate price range
const getPriceRange = () => {
  if (!klines.value || klines.value.length === 0) return '0.00'
  const high = parseFloat(highPrice.value)
  const low = parseFloat(lowPrice.value)
  const range = high - low
  return range.toFixed(2)
}

// ========== Technical Indicators Calculations ==========

// Calculate EMA (Exponential Moving Average)
const calculateEMA = (data: number[], period: number) => {
  if (data.length < period) return []
  
  const k = 2 / (period + 1)
  const ema: number[] = []
  let sum = 0
  
  // First EMA is SMA
  for (let i = 0; i < period; i++) {
    sum += data[i]
  }
  ema.push(sum / period)
  
  // Calculate rest of EMA
  for (let i = period; i < data.length; i++) {
    ema.push(data[i] * k + ema[ema.length - 1] * (1 - k))
  }
  
  return ema
}

// Calculate SMA (Simple Moving Average)
const calculateSMA = (data: number[], period: number) => {
  if (data.length < period) return []
  
  const sma: number[] = []
  for (let i = period - 1; i < data.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) {
      sum += data[i - j]
    }
    sma.push(sum / period)
  }
  
  return sma
}

// Calculate Bollinger Bands
const calculateBollingerBands = (data: number[], period: number, stdDev: number) => {
  if (data.length < period) return { upper: [], middle: [], lower: [] }
  
  const middle = calculateSMA(data, period)
  const upper: number[] = []
  const lower: number[] = []
  
  for (let i = 0; i < middle.length; i++) {
    const dataIndex = i + period - 1
    let sum = 0
    
    for (let j = 0; j < period; j++) {
      sum += Math.pow(data[dataIndex - j] - middle[i], 2)
    }
    
    const variance = sum / period
    const std = Math.sqrt(variance)
    
    upper.push(middle[i] + stdDev * std)
    lower.push(middle[i] - stdDev * std)
  }
  
  return { upper, middle, lower }
}

// Calculate RSI (Relative Strength Index)
const calculateRSI = (data: number[], period: number) => {
  if (data.length < period + 1) return []
  
  const rsi: number[] = []
  let gains = 0
  let losses = 0
  
  // First average gain/loss
  for (let i = 1; i <= period; i++) {
    const change = data[i] - data[i - 1]
    if (change > 0) gains += change
    else losses -= change
  }
  
  let avgGain = gains / period
  let avgLoss = losses / period
  
  if (avgLoss === 0) {
    rsi.push(100)
  } else {
    const rs = avgGain / avgLoss
    rsi.push(100 - (100 / (1 + rs)))
  }
  
  // Calculate rest of RSI
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i] - data[i - 1]
    const gain = change > 0 ? change : 0
    const loss = change < 0 ? -change : 0
    
    avgGain = (avgGain * (period - 1) + gain) / period
    avgLoss = (avgLoss * (period - 1) + loss) / period
    
    if (avgLoss === 0) {
      rsi.push(100)
    } else {
      const rs = avgGain / avgLoss
      rsi.push(100 - (100 / (1 + rs)))
    }
  }
  
  return rsi
}

// Calculate MACD
const calculateMACD = (data: number[], fastPeriod: number, slowPeriod: number, signalPeriod: number) => {
  const fastEMA = calculateEMA(data, fastPeriod)
  const slowEMA = calculateEMA(data, slowPeriod)
  
  if (fastEMA.length === 0 || slowEMA.length === 0) {
    return { macd: [], signal: [], histogram: [] }
  }
  
  const offset = slowPeriod - fastPeriod
  const macdLine: number[] = []
  
  for (let i = 0; i < slowEMA.length; i++) {
    macdLine.push(fastEMA[i + offset] - slowEMA[i])
  }
  
  const signalLine = calculateEMA(macdLine, signalPeriod)
  const histogram: number[] = []
  
  const signalOffset = signalPeriod - 1
  for (let i = 0; i < signalLine.length; i++) {
    histogram.push(macdLine[i + signalOffset] - signalLine[i])
  }
  
  return { macd: macdLine, signal: signalLine, histogram }
}

// Calculate Stochastic Oscillator
const calculateStochastic = (highs: number[], lows: number[], closes: number[], period: number) => {
  if (highs.length < period || lows.length < period || closes.length < period) return []
  
  const stochastic: number[] = []
  
  for (let i = period - 1; i < closes.length; i++) {
    const periodHighs = highs.slice(i - period + 1, i + 1)
    const periodLows = lows.slice(i - period + 1, i + 1)
    const highestHigh = Math.max(...periodHighs)
    const lowestLow = Math.min(...periodLows)
    const currentClose = closes[i]
    
    if (highestHigh === lowestLow) {
      stochastic.push(50)
    } else {
      const k = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100
      stochastic.push(k)
    }
  }
  
  return stochastic
}

// Calculate ATR (Average True Range)
const calculateATR = (highs: number[], lows: number[], closes: number[], period: number) => {
  if (highs.length < period + 1 || lows.length < period + 1 || closes.length < period + 1) return []
  
  const trueRanges: number[] = []
  
  for (let i = 1; i < highs.length; i++) {
    const tr1 = highs[i] - lows[i]
    const tr2 = Math.abs(highs[i] - closes[i - 1])
    const tr3 = Math.abs(lows[i] - closes[i - 1])
    trueRanges.push(Math.max(tr1, tr2, tr3))
  }
  
  const atr: number[] = []
  let sum = 0
  
  // First ATR is average of first period TRs
  for (let i = 0; i < period; i++) {
    sum += trueRanges[i]
  }
  atr.push(sum / period)
  
  // Calculate rest using Wilder's smoothing
  for (let i = period; i < trueRanges.length; i++) {
    atr.push((atr[atr.length - 1] * (period - 1) + trueRanges[i]) / period)
  }
  
  return atr
}

// Calculate Williams %R
const calculateWilliamsR = (highs: number[], lows: number[], closes: number[], period: number) => {
  if (highs.length < period || lows.length < period || closes.length < period) return []
  
  const williamsR: number[] = []
  
  for (let i = period - 1; i < closes.length; i++) {
    const periodHighs = highs.slice(i - period + 1, i + 1)
    const periodLows = lows.slice(i - period + 1, i + 1)
    const highestHigh = Math.max(...periodHighs)
    const lowestLow = Math.min(...periodLows)
    const currentClose = closes[i]
    
    if (highestHigh === lowestLow) {
      williamsR.push(-50)
    } else {
      const wr = ((highestHigh - currentClose) / (highestHigh - lowestLow)) * -100
      williamsR.push(wr)
    }
  }
  
  return williamsR
}

// Calculate ADX (Average Directional Index)
const calculateADX = (highs: number[], lows: number[], closes: number[], period: number) => {
  if (highs.length < period * 2 || lows.length < period * 2 || closes.length < period * 2) return []
  
  const plusDM: number[] = []
  const minusDM: number[] = []
  const tr: number[] = []
  
  // Calculate +DM, -DM, and TR
  for (let i = 1; i < highs.length; i++) {
    const upMove = highs[i] - highs[i - 1]
    const downMove = lows[i - 1] - lows[i]
    
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0)
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0)
    
    const tr1 = highs[i] - lows[i]
    const tr2 = Math.abs(highs[i] - closes[i - 1])
    const tr3 = Math.abs(lows[i] - closes[i - 1])
    tr.push(Math.max(tr1, tr2, tr3))
  }
  
  // Smooth +DM, -DM, and TR
  const smoothedPlusDM = calculateEMA(plusDM, period)
  const smoothedMinusDM = calculateEMA(minusDM, period)
  const smoothedTR = calculateEMA(tr, period)
  
  const adx: number[] = []
  const dx: number[] = []
  
  // Calculate DX
  for (let i = 0; i < smoothedTR.length; i++) {
    if (smoothedTR[i] === 0) {
      dx.push(0)
    } else {
      const diPlus = (smoothedPlusDM[i] / smoothedTR[i]) * 100
      const diMinus = (smoothedMinusDM[i] / smoothedTR[i]) * 100
      const diDiff = Math.abs(diPlus - diMinus)
      const diSum = diPlus + diMinus
      dx.push(diSum === 0 ? 0 : (diDiff / diSum) * 100)
    }
  }
  
  // Calculate ADX (smoothed DX)
  if (dx.length >= period) {
    const adxValues = calculateEMA(dx, period)
    adx.push(...adxValues)
  }
  
  return adx
}

// Calculate Fibonacci Retracement Levels
const calculateFibonacci = (high: number, low: number) => {
  const diff = high - low
  return {
    level0: high,
    level236: high - (diff * 0.236),
    level382: high - (diff * 0.382),
    level50: high - (diff * 0.5),
    level618: high - (diff * 0.618),
    level100: low
  }
}

const initChart = async () => {
  if (!chartContainer.value) return

  try {
    const { createChart, ColorType } = await import('lightweight-charts')

    // Detect dark mode
    const isDark = document.documentElement.classList.contains('dark')
    
    chart = createChart(chartContainer.value, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#cbd5e1' : '#475569',
        fontFamily: 'Cairo, sans-serif',
      },
      grid: {
        vertLines: { 
          color: isDark ? '#1e293b' : '#e2e8f0',
          style: 1,
          visible: true,
        },
        horzLines: { 
          color: isDark ? '#1e293b' : '#e2e8f0',
          style: 1,
          visible: true,
        },
      },
      width: chartContainer.value.clientWidth,
      height: chartContainer.value.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: isDark ? '#334155' : '#cbd5e1',
        rightOffset: 5,
        barSpacing: 3,
      },
      rightPriceScale: {
        borderColor: isDark ? '#334155' : '#cbd5e1',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isDark ? '#64748b' : '#94a3b8',
          width: 1,
          style: 3,
          labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        },
        horzLine: {
          color: isDark ? '#64748b' : '#94a3b8',
          width: 1,
          style: 3,
          labelBackgroundColor: isDark ? '#1e293b' : '#f1f5f9',
        },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    })

    candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#059669',
      borderDownColor: '#dc2626',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
      priceLineVisible: false,
      lastValueVisible: true,
    })

    volumeSeries = chart.addHistogramSeries({
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.75,
        bottom: 0,
      },
      visible: showVolume.value,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    if (klines.value.length > 0) {
      updateChart()
    }
  } catch (err) {
    console.error('Error initializing chart:', err)
    error.value = 'فشل في تحميل المخطط'
  }
}

const updateChart = () => {
  if (!candlestickSeries || !volumeSeries || !klines.value || klines.value.length === 0 || !chart) return

  try {
    const candlestickData = klines.value.map(k => ({
      time: Math.floor((k.openTime || 0) / 1000) as any,
      open: parseFloat(k.open || 0),
      high: parseFloat(k.high || 0),
      low: parseFloat(k.low || 0),
      close: parseFloat(k.close || 0),
    }))

    const volumeData = klines.value.map(k => ({
      time: Math.floor((k.openTime || 0) / 1000) as any,
      value: parseFloat(k.volume || 0),
      color: parseFloat(k.close || 0) >= parseFloat(k.open || 0) ? '#22c55e' : '#ef4444',
    }))

    candlestickSeries.setData(candlestickData)
    volumeSeries.setData(volumeData)

    // Update Indicators
    const closePrices = klines.value.map(k => parseFloat(k.close || 0))
    const times = klines.value.map(k => Math.floor((k.openTime || 0) / 1000))

    // EMA
    if (indicators.value.ema.enabled) {
      const emaData = calculateEMA(closePrices, indicators.value.ema.period)
      if (!emaSeries) {
        emaSeries = chart.addLineSeries({
          color: indicators.value.ema.color,
          lineWidth: 2,
          title: `EMA ${indicators.value.ema.period}`,
          priceLineVisible: false,
          lastValueVisible: false,
        })
      } else {
        // Update color if changed
        emaSeries.applyOptions({
          color: indicators.value.ema.color,
          title: `EMA ${indicators.value.ema.period}`,
        })
      }
      if (emaData.length > 0) {
        const offset = indicators.value.ema.period - 1
        emaSeries.setData(emaData.map((value, i) => ({
          time: times[i + offset] as any,
          value
        })))
      }
    } else if (emaSeries) {
      chart.removeSeries(emaSeries)
      emaSeries = null
    }

    // SMA
    if (indicators.value.sma.enabled) {
      const smaData = calculateSMA(closePrices, indicators.value.sma.period)
      if (!smaSeries) {
        smaSeries = chart.addLineSeries({
          color: indicators.value.sma.color,
          lineWidth: 2,
          title: `SMA ${indicators.value.sma.period}`,
          priceLineVisible: false,
          lastValueVisible: false,
        })
      } else {
        // Update color if changed
        smaSeries.applyOptions({
          color: indicators.value.sma.color,
          title: `SMA ${indicators.value.sma.period}`,
        })
      }
      if (smaData.length > 0) {
        const offset = indicators.value.sma.period - 1
        smaSeries.setData(smaData.map((value, i) => ({
          time: times[i + offset] as any,
          value
        })))
      }
    } else if (smaSeries) {
      chart.removeSeries(smaSeries)
      smaSeries = null
    }

    // Bollinger Bands
    if (indicators.value.bollinger.enabled) {
      const bb = calculateBollingerBands(closePrices, indicators.value.bollinger.period, indicators.value.bollinger.stdDev)
      const offset = indicators.value.bollinger.period - 1
      
      if (!bollingerUpperSeries) {
        bollingerUpperSeries = chart.addLineSeries({
          color: indicators.value.bollinger.color,
          lineWidth: 1,
          lineStyle: 2,
          title: 'BB Upper',
          priceLineVisible: false,
          lastValueVisible: false,
        })
      } else {
        bollingerUpperSeries.applyOptions({
          color: indicators.value.bollinger.color,
        })
      }
      if (!bollingerMiddleSeries) {
        bollingerMiddleSeries = chart.addLineSeries({
          color: indicators.value.bollinger.color,
          lineWidth: 1,
          title: 'BB Middle',
          priceLineVisible: false,
          lastValueVisible: false,
        })
      } else {
        bollingerMiddleSeries.applyOptions({
          color: indicators.value.bollinger.color,
        })
      }
      if (!bollingerLowerSeries) {
        bollingerLowerSeries = chart.addLineSeries({
          color: indicators.value.bollinger.color,
          lineWidth: 1,
          lineStyle: 2,
          title: 'BB Lower',
          priceLineVisible: false,
          lastValueVisible: false,
        })
      } else {
        bollingerLowerSeries.applyOptions({
          color: indicators.value.bollinger.color,
        })
      }
      
      if (bb.upper.length > 0) {
        bollingerUpperSeries.setData(bb.upper.map((value, i) => ({
          time: times[i + offset] as any,
          value
        })))
        bollingerMiddleSeries.setData(bb.middle.map((value, i) => ({
          time: times[i + offset] as any,
          value
        })))
        bollingerLowerSeries.setData(bb.lower.map((value, i) => ({
          time: times[i + offset] as any,
          value
        })))
      }
    } else {
      if (bollingerUpperSeries) {
        chart.removeSeries(bollingerUpperSeries)
        bollingerUpperSeries = null
      }
      if (bollingerMiddleSeries) {
        chart.removeSeries(bollingerMiddleSeries)
        bollingerMiddleSeries = null
      }
      if (bollingerLowerSeries) {
        chart.removeSeries(bollingerLowerSeries)
        bollingerLowerSeries = null
      }
    }

    // ATR (Average True Range) - displayed as line above/below price
    const highs = klines.value.map(k => parseFloat(k.high || 0))
    const lows = klines.value.map(k => parseFloat(k.low || 0))
    
    if (indicators.value.atr.enabled) {
      const atrData = calculateATR(highs, lows, closePrices, indicators.value.atr.period)
      if (!atrSeries) {
        atrSeries = chart.addLineSeries({
          color: indicators.value.atr.color,
          lineWidth: 1,
          lineStyle: 1, // Dashed
          title: `ATR ${indicators.value.atr.period}`,
          priceLineVisible: false,
          lastValueVisible: false,
        })
      } else {
        atrSeries.applyOptions({
          color: indicators.value.atr.color,
          title: `ATR ${indicators.value.atr.period}`,
        })
      }
      if (atrData.length > 0) {
        const offset = indicators.value.atr.period
        // Display ATR as bands around price (current price ± ATR)
        const currentPrice = closePrices[closePrices.length - 1]
        const currentATR = atrData[atrData.length - 1]
        atrSeries.setData([
          { time: times[times.length - 1] as any, value: currentPrice + currentATR },
          { time: times[times.length - 1] as any, value: currentPrice - currentATR }
        ])
      }
    } else if (atrSeries) {
      chart.removeSeries(atrSeries)
      atrSeries = null
    }

    // Fibonacci Retracement Levels
    if (indicators.value.fibonacci.enabled) {
      // Clear previous Fibonacci lines
      fibonacciSeries.forEach(series => {
        if (series) chart.removeSeries(series)
      })
      fibonacciSeries = []
      
      if (closePrices.length > 0) {
        const high = Math.max(...highs)
        const low = Math.min(...lows)
        const fib = calculateFibonacci(high, low)
        
        const fibLevels = [
          { value: fib.level0, label: '0%' },
          { value: fib.level236, label: '23.6%' },
          { value: fib.level382, label: '38.2%' },
          { value: fib.level50, label: '50%' },
          { value: fib.level618, label: '61.8%' },
          { value: fib.level100, label: '100%' }
        ]
        
        fibLevels.forEach((level, index) => {
          const series = chart.addLineSeries({
            color: index === 0 || index === fibLevels.length - 1 ? '#f59e0b' : '#f59e0b80',
            lineWidth: index === 0 || index === fibLevels.length - 1 ? 2 : 1,
            lineStyle: 2, // Dashed
            title: `Fib ${level.label}`,
            priceLineVisible: true,
            lastValueVisible: true,
          })
          
          // Draw line across all times
          series.setData(times.map(t => ({
            time: t as any,
            value: level.value
          })))
          
          fibonacciSeries.push(series)
        })
      }
    } else {
      // Remove all Fibonacci lines
      fibonacciSeries.forEach(series => {
        if (series) chart.removeSeries(series)
      })
      fibonacciSeries = []
    }

    // Stochastic, Williams %R, and ADX need separate panes (0-100 scale)
    // These will be added in a future update as they require additional chart panes

    // Fit content smoothly
    if (chart) {
      setTimeout(() => {
        chart.timeScale().fitContent()
      }, 100)
    }
  } catch (err) {
    console.error('Error updating chart:', err)
  }
}

// Debounced update for smoother performance
let updateTimeout: NodeJS.Timeout | null = null
const debouncedUpdateChart = () => {
  if (updateTimeout) clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    if (chart && candlestickSeries && volumeSeries && klines.value.length > 0) {
      updateChart()
    }
  }, 100)
}

const loadKlines = async () => {
  try {
    error.value = null
    const newKlines = await getKlines(props.symbol, selectedInterval.value, 100)
    
    klines.value = newKlines
    
    if (klines.value.length > 10) {
      historicalVolumes.value = klines.value
        .slice(0, -1)
        .map(k => parseFloat(k.volume))
    }

    if (chart && candlestickSeries && volumeSeries) {
      updateChart()
    }
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ في تحميل البيانات'
  }
}

const resizeChart = () => {
  if (chart && chartContainer.value) {
    chart.applyOptions({
      width: chartContainer.value.clientWidth,
      height: chartContainer.value.clientHeight,
    })
  }
}

let updateInterval: NodeJS.Timeout | null = null

onMounted(async () => {
  await loadKlines()
  await nextTick()
  if (chartContainer.value) {
    await initChart()
    // Ensure chart is ready before first update
    await nextTick()
    if (chart && klines.value.length > 0) {
      updateChart()
    }
  }
  updateInterval = setInterval(() => loadKlines(), 60000)
  window.addEventListener('resize', resizeChart)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  if (chart) {
    chart.remove()
    chart = null
  }
  window.removeEventListener('resize', resizeChart)
})

watch([() => props.symbol, selectedInterval], async () => {
  klines.value = []
  
  // Clear all indicator series when changing symbol
  if (emaSeries) {
    chart?.removeSeries(emaSeries)
    emaSeries = null
  }
  if (smaSeries) {
    chart?.removeSeries(smaSeries)
    smaSeries = null
  }
  if (bollingerUpperSeries) {
    chart?.removeSeries(bollingerUpperSeries)
    bollingerUpperSeries = null
  }
  if (bollingerMiddleSeries) {
    chart?.removeSeries(bollingerMiddleSeries)
    bollingerMiddleSeries = null
  }
  if (bollingerLowerSeries) {
    chart?.removeSeries(bollingerLowerSeries)
    bollingerLowerSeries = null
  }
  
  await loadKlines()
  await nextTick()
  if (chart && klines.value.length > 0) {
    updateChart()
  }
  
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  updateInterval = setInterval(() => loadKlines(), 60000)
})
</script>
