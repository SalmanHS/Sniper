<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between flex-wrap gap-4">
      <h1 class="text-3xl font-bold">التحليلات المتقدمة</h1>
      <div class="flex items-center gap-3 flex-wrap">
        <!-- Market Type Selector -->
        <div class="flex items-center gap-2 bg-bg-tertiary p-1 rounded-lg">
          <button
            @click="marketType = 'spot'"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-semibold transition-all',
              marketType === 'spot'
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-primary'
            ]"
          >
            Spot
          </button>
          <button
            @click="marketType = 'futures'"
            :class="[
              'px-3 py-1 rounded-lg text-sm font-semibold transition-all',
              marketType === 'futures'
                ? 'bg-warning text-white'
                : 'text-text-secondary hover:text-warning'
            ]"
          >
            Futures
          </button>
        </div>
        
        <button
          @click="showHistoryTable = !showHistoryTable"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all duration-200',
            showHistoryTable
              ? 'bg-primary text-white'
              : 'bg-bg-tertiary hover:bg-border-color'
          ]"
        >
          {{ showHistoryTable ? '🐋 إخفاء السجل' : '📋 عرض سجل الامتصاص' }}
          <span v-if="absorptionHistory.length > 0" class="mr-2 bg-danger text-white text-xs px-2 py-1 rounded-full">
            {{ absorptionHistory.length }}
          </span>
        </button>
        <select
          v-model="selectedSymbol"
          class="px-4 py-2 rounded-lg bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option v-for="symbol in currentSymbols" :key="symbol" :value="symbol">
            {{ symbol }}
          </option>
        </select>
      </div>
    </div>

    <!-- جدول سجل التنبيهات -->
    <div v-if="showHistoryTable" class="bg-bg-secondary rounded-lg p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-2xl font-bold">📊 سجل تنبيهات الامتصاص</h3>
        <button
          v-if="absorptionHistory.length > 0"
          @click="openDeleteConfirmModal"
          class="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/80 transition-colors"
        >
          🗑️ حذف السجل
        </button>
      </div>

      <div v-if="absorptionHistory.length === 0" class="text-center py-8 text-text-secondary">
        لا توجد تنبيهات حتى الآن. سيتم حفظ التنبيهات تلقائياً عند اكتشاف امتصاص.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-bg-tertiary sticky top-0">
            <tr>
              <th class="px-4 py-3 text-right font-bold">التاريخ والوقت</th>
              <th class="px-4 py-3 text-right font-bold">العملة</th>
              <th class="px-4 py-3 text-right font-bold">النوع</th>
              <th class="px-4 py-3 text-right font-bold">السعر</th>
              <th class="px-4 py-3 text-right font-bold">القوة</th>
              <th class="px-4 py-3 text-right font-bold">ضغط الشراء</th>
              <th class="px-4 py-3 text-right font-bold">ضغط البيع</th>
              <th class="px-4 py-3 text-right font-bold">الحجم</th>
              <th class="px-4 py-3 text-right font-bold">الوصف</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="alert in absorptionHistory"
              :key="alert.id"
              :class="[
                'border-b border-border-color hover:bg-bg-tertiary/50 transition-colors',
                alert.type === 'bullish' ? 'bg-success/5' : 'bg-danger/5'
              ]"
            >
              <td class="px-4 py-3 text-text-secondary whitespace-nowrap">
                {{ formatDateTime(alert.timestamp) }}
              </td>
              <td class="px-4 py-3 font-bold">{{ alert.symbol }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-col gap-1">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-xs font-bold',
                      alert.type === 'bullish'
                        ? 'bg-success text-white'
                        : 'bg-danger text-white'
                    ]"
                  >
                    {{ alert.action || (alert.type === 'bullish' ? 'شراء' : 'بيع') }}
                  </span>
                  <span v-if="alert.confidence" class="text-xs text-text-secondary">
                    ثقة {{ alert.confidence }}%
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 font-mono font-bold">
                ${{ alert.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 8 }) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 bg-border-color rounded-full overflow-hidden min-w-[60px]">
                    <div
                      :class="[
                        'h-full transition-all',
                        alert.type === 'bullish' ? 'bg-success' : 'bg-danger'
                      ]"
                      :style="{ width: `${alert.strength}%` }"
                    ></div>
                  </div>
                  <span class="font-bold text-xs">{{ alert.strength }}%</span>
                </div>
              </td>
              <td class="px-4 py-3 text-success font-semibold">
                {{ alert.buyPressure.toFixed(1) }}%
              </td>
              <td class="px-4 py-3 text-danger font-semibold">
                {{ alert.sellPressure.toFixed(1) }}%
              </td>
              <td class="px-4 py-3 font-mono">{{ formatNumber(alert.volume) }}</td>
              <td class="px-4 py-3 text-text-secondary text-xs max-w-xs">
                {{ alert.message }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="absorptionHistory.length > 0" class="mt-4 text-sm text-text-secondary text-center">
        إجمالي التنبيهات: {{ absorptionHistory.length }} | 
        صعودي: {{ absorptionHistory.filter(a => a.type === 'bullish').length }} | 
        هبوطي: {{ absorptionHistory.filter(a => a.type === 'bearish').length }}
      </div>
    </div>

    <div v-if="selectedSymbol" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Absorption Alert -->
      <div 
        v-if="absorptionDetected"
        ref="absorptionAlertRef"
        :class="[
          'lg:col-span-2 rounded-2xl p-8 border-2 shadow-2xl transition-all duration-500',
          absorptionDetected.type === 'bullish' 
            ? 'bg-gradient-to-br from-success/20 to-success/5 border-success animate-pulse-subtle' 
            : 'bg-gradient-to-br from-danger/20 to-danger/5 border-danger animate-pulse-subtle'
        ]"
      >
        <div class="flex items-start gap-6">
          <div 
            :class="[
              'text-6xl animate-bounce',
              absorptionDetected.type === 'bullish' ? 'filter drop-shadow-lg' : ''
            ]"
          >
            {{ absorptionDetected.type === 'bullish' ? '🚀' : '🔴' }}
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between mb-3">
              <h3 
                :class="[
                  'text-3xl font-black',
                  absorptionDetected.type === 'bullish' ? 'text-success' : 'text-danger'
                ]"
              >
                {{ absorptionDetected.action }} - إشارة مؤكدة!
              </h3>
              <div 
                :class="[
                  'px-4 py-2 rounded-full font-bold text-lg shadow-lg',
                  absorptionDetected.confidence >= 85 
                    ? 'bg-success text-white' 
                    : absorptionDetected.confidence >= 75
                    ? 'bg-warning text-white'
                    : 'bg-primary text-white'
                ]"
              >
                ثقة {{ absorptionDetected.confidence }}%
              </div>
            </div>
            
            <p class="text-lg mb-4 font-semibold" :class="absorptionDetected.type === 'bullish' ? 'text-success' : 'text-danger'">
              {{ absorptionDetected.message }}
            </p>
            
            <!-- Confirmations -->
            <div class="bg-bg-secondary/50 rounded-xl p-4 mb-4">
              <h4 class="font-bold mb-3 flex items-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                التأكيدات ({{ absorptionDetected.confirmations.length }})
              </h4>
              <div class="grid grid-cols-2 gap-2">
                <div 
                  v-for="(confirmation, idx) in absorptionDetected.confirmations" 
                  :key="idx"
                  class="flex items-center gap-2 text-sm bg-bg-tertiary px-3 py-2 rounded-lg"
                >
                  <svg class="w-4 h-4 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ confirmation }}</span>
                </div>
              </div>
            </div>
            
            <!-- Strength & Action -->
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-2 flex-1">
                <span class="text-sm text-text-secondary">قوة الإشارة:</span>
                <div class="flex items-center gap-2 flex-1">
                  <div class="flex-1 h-4 bg-border-color rounded-full overflow-hidden">
                    <div
                      :class="[
                        'h-full transition-all',
                        absorptionDetected.type === 'bullish' ? 'bg-success' : 'bg-danger'
                      ]"
                      :style="{ width: `${absorptionDetected.strength}%` }"
                    ></div>
                  </div>
                  <span class="font-bold text-lg">{{ absorptionDetected.strength }}%</span>
                </div>
              </div>
              
              <div 
                :class="[
                  'px-6 py-3 rounded-xl font-black text-xl shadow-lg animate-pulse',
                  absorptionDetected.type === 'bullish' 
                    ? 'bg-success text-white' 
                    : 'bg-danger text-white'
                ]"
              >
                {{ absorptionDetected.type === 'bullish' ? '📈 اشتري الآن' : '📉 بيع الآن' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PriceChart :symbol="selectedSymbol" :key="`chart-${selectedSymbol}`" />
      <OrderBook :symbol="selectedSymbol" :limit="30" :key="`orderbook-${selectedSymbol}`" />
      <TradeFlow :symbol="selectedSymbol" :limit="100" :key="`tradeflow-${selectedSymbol}`" />
      
      <!-- Advanced Analytics -->
      <div class="bg-bg-secondary rounded-lg p-6 shadow-md">
        <h3 class="text-xl font-bold mb-4">تحليلات متقدمة</h3>
        
        <div v-if="error" class="text-center py-4 text-danger text-sm">
          {{ error }}
        </div>

        <div v-else class="space-y-4">
          <!-- Order Book Imbalance -->
          <div v-if="imbalance" class="bg-bg-tertiary rounded-lg p-4">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-semibold">توازن دفتر الأوامر</span>
              <span
                :class="[
                  'text-lg font-bold px-2 py-1 rounded',
                  imbalance.isBullish ? 'text-success bg-success/10' : 'text-danger bg-danger/10'
                ]"
              >
                {{ imbalance.imbalance.toFixed(2) }}%
              </span>
            </div>
            <div class="h-2 bg-border-color rounded-full overflow-hidden">
              <div
                :class="[
                  'h-full transition-all duration-300',
                  imbalance.isBullish ? 'bg-success' : 'bg-danger'
                ]"
                :style="{ 
                  width: `${Math.abs(imbalance.imbalance)}%`,
                  marginRight: imbalance.isBullish ? '0' : 'auto',
                  marginLeft: imbalance.isBullish ? 'auto' : '0'
                }"
              ></div>
            </div>
            <div class="text-xs text-text-secondary mt-2">
              حجم الشراء: {{ formatVolume(imbalance.bidsVolume) }} | 
              حجم البيع: {{ formatVolume(imbalance.asksVolume) }}
            </div>
          </div>

          <!-- Trade Flow Summary -->
          <div v-if="tradeFlow" class="bg-bg-tertiary rounded-lg p-4">
            <div class="text-sm font-semibold mb-3">ملخص تدفق الصفقات</div>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-text-secondary">التدفق الصافي</span>
                <span
                  :class="[
                    'font-bold',
                    tradeFlow.netFlow >= 0 ? 'text-success' : 'text-danger'
                  ]"
                >
                  {{ formatVolume(tradeFlow.netFlow) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-text-secondary">إجمالي الصفقات</span>
                <span class="font-bold">{{ tradeFlow.buyCount + tradeFlow.sellCount }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div class="bg-success/10 rounded p-2">
                  <div class="text-xs text-text-secondary">صفقات الشراء</div>
                  <div class="text-lg font-bold text-success">{{ tradeFlow.buyCount }}</div>
                </div>
                <div class="bg-danger/10 rounded p-2">
                  <div class="text-xs text-text-secondary">صفقات البيع</div>
                  <div class="text-lg font-bold text-danger">{{ tradeFlow.sellCount }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Market Sentiment -->
          <div v-if="imbalance && tradeFlow" class="bg-bg-tertiary rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="text-sm font-semibold">معنويات السوق</div>
              <div 
                :class="[
                  'text-xs px-2 py-1 rounded',
                  confidenceLevel === 'عالي' ? 'bg-success/20 text-success' :
                  confidenceLevel === 'متوسط' ? 'bg-warning/20 text-warning' :
                  'bg-danger/20 text-danger'
                ]"
              >
                ثقة: {{ confidenceLevel }}
              </div>
            </div>
            <div class="flex items-center justify-center py-4">
              <div class="text-center">
                <div 
                  :class="[
                    'text-5xl font-bold transition-all duration-1000 mb-3',
                    sentimentDirection === 'شراء' ? 'text-success' : 
                    sentimentDirection === 'بيع' ? 'text-danger' : 
                    'text-warning'
                  ]"
                >
                  {{ sentimentDirection === 'شراء' ? '🚀' : 
                     sentimentDirection === 'بيع' ? '💥' : 
                     marketSentiment === 'جاري التحليل...' ? '🔄' : '⏸️' }}
                </div>
                <div class="text-xl font-bold mb-2">{{ marketSentiment }}</div>
                <div v-if="priceChange !== 0" 
                  :class="[
                    'text-sm font-semibold',
                    priceChange > 0 ? 'text-success' : 'text-danger'
                  ]"
                >
                  السعر: {{ priceChange > 0 ? '+' : '' }}{{ priceChange.toFixed(2) }}%
                </div>
                <div class="flex items-center justify-center gap-2 text-xs text-text-secondary">
                  <span>{{ sentimentHistory.length }}/{{ MAX_HISTORY_SIZE }} قراءة</span>
                  <span>•</span>
                  <span>آخر {{ Math.round(sentimentHistory.length * 15 / 60) }} دقيقة</span>
                </div>
                <div v-if="sentimentHistory.length < MIN_READINGS_FOR_RELIABLE" class="mt-2 text-xs text-warning">
                  يتم جمع المزيد من البيانات للحصول على تحليل دقيق...
                </div>
              </div>
            </div>
            
            <!-- Progress Indicator -->
            <div class="mt-3">
              <div class="h-1 bg-border-color rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary transition-all duration-300"
                  :style="{ width: `${(sentimentHistory.length / MAX_HISTORY_SIZE) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteConfirmModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      @click.self="cancelDelete"
    >
      <div 
        class="bg-bg-secondary rounded-2xl shadow-2xl max-w-md w-full p-6 border border-border-color animate-scale-in"
      >
        <!-- Icon -->
        <div class="flex justify-center mb-4">
          <div class="w-16 h-16 bg-danger/20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-danger" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-bold text-center mb-3">تأكيد الحذف</h3>
        
        <!-- Message -->
        <p class="text-text-secondary text-center mb-6">
          هل أنت متأكد من حذف جميع تنبيهات الامتصاص؟
          <br>
          <span class="text-danger font-semibold">لا يمكن التراجع عن هذا الإجراء!</span>
        </p>

        <!-- Stats -->
        <div class="bg-bg-tertiary rounded-lg p-3 mb-6">
          <div class="flex items-center justify-between text-sm">
            <span class="text-text-secondary">عدد التنبيهات:</span>
            <span class="font-bold">{{ absorptionHistory.length }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            @click="cancelDelete"
            class="flex-1 px-4 py-3 bg-bg-tertiary hover:bg-border-color text-text-primary rounded-lg font-semibold transition-colors"
          >
            إلغاء
          </button>
          <button
            @click="clearAbsorptionHistory"
            class="flex-1 px-4 py-3 bg-danger hover:bg-danger/80 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            حذف نهائي
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})
const route = useRoute()
const { getOrderBook, getTrades } = useBinanceApi()
const { calculateOrderBookImbalance, calculateTradeFlow } = useMarketAnalytics()

interface AbsorptionAlert {
  id: string
  timestamp: number
  symbol: string
  type: 'bullish' | 'bearish'
  strength: number
  price: number
  message: string
  buyPressure: number
  sellPressure: number
  volume: number
  confidence?: number
  action?: 'شراء' | 'بيع' | null
}

const selectedSymbol = ref((route.query.symbol as string) || 'BTCUSDT')
const marketType = ref<'spot' | 'futures'>('spot')
const error = ref<string | null>(null)
const imbalance = ref<any>(null)
const tradeFlow = ref<any>(null)
const priceChange = ref<number>(0)
const currentPrice = ref<number>(0)
const absorptionDetected = ref<{
  type: 'bullish' | 'bearish' | null
  strength: number
  message: string
  confidence: number
  confirmations: string[]
  action: 'شراء' | 'بيع' | null
} | null>(null)
const absorptionAlertRef = ref<HTMLElement | null>(null)
const absorptionHistory = ref<AbsorptionAlert[]>([])
const showHistoryTable = ref(false)
const showDeleteConfirmModal = ref(false)

// نظام التصويت لاستقرار التحليل (آخر 12 قراءة = 3 دقائق تقريباً)
const sentimentHistory = ref<number[]>([])
const priceHistory = ref<number[]>([])
const volumeHistory = ref<number[]>([])
const buyRatioHistory = ref<number[]>([])
const MAX_HISTORY_SIZE = 12
const MIN_READINGS_FOR_RELIABLE = 8 // الحد الأدنى للقراءات الموثوقة
const ABSORPTION_CHECK_PERIODS = 4 // عدد الفترات للتحقق من الامتصاص (60 ثانية)

const spotSymbols = [
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

const futuresSymbols = [
  'BTCUSDT',
  'ETHUSDT',
  'BNBUSDT',
  'SOLUSDT',
  'XRPUSDT',
  'ADAUSDT',
  'DOGEUSDT',
  'DOTUSDT',
  'MATICUSDT',
  'AVAXUSDT',
  '1000PEPEUSDT',
  '1000SHIBUSDT',
  'ARBUSDT',
  'OPUSDT',
  'LINKUSDT'
]

const currentSymbols = computed(() => {
  return marketType.value === 'spot' ? spotSymbols : futuresSymbols
})

// حساب اتجاه السعر (الزخم)
const calculatePriceMomentum = (): number => {
  if (priceHistory.value.length < 3) return 0
  
  // نحسب معدل التغير في السعر
  const recentPrices = priceHistory.value.slice(-5)
  const oldPrice = recentPrices[0]
  const newPrice = recentPrices[recentPrices.length - 1]
  
  const priceChangePercent = ((newPrice - oldPrice) / oldPrice) * 100
  
  // نقاط بناءً على التغير الفعلي في السعر
  if (priceChangePercent > 1) return 3  // صعود قوي
  else if (priceChangePercent > 0.5) return 2
  else if (priceChangePercent > 0.2) return 1
  else if (priceChangePercent > -0.2) return 0
  else if (priceChangePercent > -0.5) return -1
  else if (priceChangePercent > -1) return -2
  else return -3  // هبوط قوي
}

// تشغيل نغمة تنبيه (Notification Sound)
const playNotificationSound = (type: 'bullish' | 'bearish') => {
  if (!import.meta.client) return
  
  try {
    // إنشاء AudioContext
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // تحديد نوع الصوت والتردد
    oscillator.type = 'sine'
    
    if (type === 'bullish') {
      // نغمة صعودية (C -> E -> G)
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.15) // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.3) // G5
    } else {
      // نغمة هبوطية (G -> E -> C)
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime) // G5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.15) // E5
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.3) // C5
    }
    
    // ضبط مستوى الصوت
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    // تشغيل الصوت
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (err) {
    console.error('Error playing notification sound:', err)
  }
}

// التمرير للأعلى وتنبيه المستخدم
const scrollToAbsorptionAlert = () => {
  if (!import.meta.client) return
  
  // انتقال سلس للأعلى
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  
  // بعد ثانية، التمرير إلى التنبيه نفسه
  setTimeout(() => {
    if (absorptionAlertRef.value) {
      absorptionAlertRef.value.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, 300)
}

// حساب RSI للتأكيد
const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50
  
  const changes = []
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1])
  }
  
  const recentChanges = changes.slice(-period)
  const gains = recentChanges.filter(c => c > 0)
  const losses = recentChanges.filter(c => c < 0).map(c => Math.abs(c))
  
  const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / period : 0
  const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / period : 0
  
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return 100 - (100 / (1 + rs))
}

// كشف Absorption (الامتصاص) - إشارة قوية للتلاعب بشروط صارمة جداً
const detectAbsorption = () => {
  // نحتاج على الأقل 8 قراءات (دقيقتين) للتأكد
  const MIN_READINGS = 8
  if (priceHistory.value.length < MIN_READINGS ||
      volumeHistory.value.length < MIN_READINGS ||
      buyRatioHistory.value.length < MIN_READINGS ||
      !imbalance.value ||
      !tradeFlow.value) {
    return
  }

  const recentPrices = priceHistory.value.slice(-MIN_READINGS)
  const recentVolumes = volumeHistory.value.slice(-MIN_READINGS)
  const recentBuyRatios = buyRatioHistory.value.slice(-MIN_READINGS)
  
  // حساب المتوسطات
  const avgVolume = recentVolumes.reduce((a, b) => a + b, 0) / recentVolumes.length
  const currentVolume = recentVolumes[recentVolumes.length - 1]
  const currentBuyRatio = recentBuyRatios[recentBuyRatios.length - 1]
  
  // حساب أعلى وأدنى سعر
  const highestPrice = Math.max(...recentPrices)
  const lowestPrice = Math.min(...recentPrices)
  const currentPriceVal = recentPrices[recentPrices.length - 1]
  const startPrice = recentPrices[0]
  const priceRange = ((highestPrice - lowestPrice) / lowestPrice) * 100
  
  // حساب التغير في السعر
  const priceChangePercent = ((currentPriceVal - startPrice) / startPrice) * 100
  
  // حساب RSI
  const rsi = calculateRSI(priceHistory.value, 14)
  
  // حساب Order Book Imbalance
  const orderBookImbalance = imbalance.value.imbalance
  
  // المتغيرات للتحقق
  let confirmations: string[] = []
  let absorptionType: 'bullish' | 'bearish' | null = null
  let strength = 0
  let confidence = 0
  
  // ====== BULLISH ABSORPTION (إشارة شراء قوية) ======
  // الشروط الصارمة جداً:
  // 1. ضغط شراء قوي جداً (> 70%)
  // 2. حجم تداول مرتفع (1.5x من المتوسط)
  // 3. Order Book يميل للشراء بقوة (> +15%)
  // 4. السعر مستقر أو يرتفع قليلاً (حتى لا يكون صعد كثيراً)
  // 5. RSI ليس في منطقة التشبع الشرائي (< 75)
  
  if (currentBuyRatio > 70 &&
      currentVolume > avgVolume * 1.5 &&
      orderBookImbalance > 15 &&
      priceChangePercent > -1 && priceChangePercent < 3 &&
      rsi < 75 &&
      priceRange < 2) {
    
    absorptionType = 'bullish'
    confirmations.push('✅ ضغط شراء هائل (> 70%)')
    confirmations.push('✅ حجم تداول مرتفع جداً (1.5x)')
    confirmations.push('✅ Order Book يميل للشراء بقوة')
    confirmations.push('✅ السعر مستقر - جاهز للانطلاق')
    
    // حساب القوة
    strength = Math.min(100, (currentBuyRatio - 50) * 2)
    
    // حساب الثقة
    confidence = 70
    if (currentBuyRatio > 75) confidence += 10
    if (orderBookImbalance > 20) confidence += 10
    if (currentVolume > avgVolume * 2) confidence += 10
    
    // تأكيدات إضافية ترفع الثقة
    if (rsi < 50) {
      confirmations.push('✅ RSI منخفض - مساحة كبيرة للصعود')
      confidence += 5
    }
    if (priceChangePercent < 0.5) {
      confirmations.push('✅ لم يصعد بعد - فرصة مبكرة')
      confidence += 5
    }
    
  }
  // ====== BEARISH ABSORPTION (إشارة بيع قوية) ======
  else if (currentBuyRatio < 30 &&
           currentVolume > avgVolume * 1.5 &&
           orderBookImbalance < -15 &&
           priceChangePercent < 1 && priceChangePercent > -3 &&
           rsi > 25 &&
           priceRange < 2) {
    
    absorptionType = 'bearish'
    confirmations.push('✅ ضغط بيع هائل (< 30%)')
    confirmations.push('✅ حجم تداول مرتفع جداً (1.5x)')
    confirmations.push('✅ Order Book يميل للبيع بقوة')
    confirmations.push('✅ السعر مستقر - جاهز للهبوط')
    
    // حساب القوة
    strength = Math.min(100, (50 - currentBuyRatio) * 2)
    
    // حساب الثقة
    confidence = 70
    if (currentBuyRatio < 25) confidence += 10
    if (orderBookImbalance < -20) confidence += 10
    if (currentVolume > avgVolume * 2) confidence += 10
    
    // تأكيدات إضافية
    if (rsi > 50) {
      confirmations.push('✅ RSI مرتفع - مساحة كبيرة للهبوط')
      confidence += 5
    }
    if (priceChangePercent > -0.5) {
      confirmations.push('✅ لم يهبط بعد - فرصة مبكرة')
      confidence += 5
    }
  }
  
  // إذا تم كشف امتصاص
  if (absorptionType && confirmations.length >= 4 && confidence >= 80) {
    absorptionDetected.value = {
      type: absorptionType,
      strength: Math.round(strength),
      confidence: Math.round(confidence),
      confirmations,
      action: absorptionType === 'bullish' ? 'شراء' : 'بيع',
      message: absorptionType === 'bullish' 
        ? `🚀 كشف امتصاص صعودي قوي! الحيتان تجمع - توقع صعود قوي قريباً`
        : `🔴 كشف امتصاص هبوطي قوي! الحيتان تبيع - توقع هبوط قريباً`
    }
  } else {
    // لا يوجد امتصاص مؤكد بنسبة 80%+
    absorptionDetected.value = null
  }
}

// حفظ تنبيه في السجل
const saveAbsorptionToHistory = (absorption: typeof absorptionDetected.value) => {
  if (!absorption || !absorption.type) return
  
  const alert: AbsorptionAlert = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    symbol: selectedSymbol.value,
    type: absorption.type,
    strength: absorption.strength,
    price: currentPrice.value,
    message: absorption.message,
    buyPressure: tradeFlow.value?.buyPressure || 0,
    sellPressure: tradeFlow.value?.sellPressure || 0,
    volume: volumeHistory.value[volumeHistory.value.length - 1] || 0,
    confidence: absorption.confidence || 0,
    action: absorption.action || null
  }
  
  // إضافة للبداية (الأحدث أولاً)
  absorptionHistory.value.unshift(alert)
  
  // الاحتفاظ بآخر 50 تنبيه فقط
  if (absorptionHistory.value.length > 50) {
    absorptionHistory.value = absorptionHistory.value.slice(0, 50)
  }
  
  // حفظ في localStorage
  if (import.meta.client) {
    try {
      localStorage.setItem('absorption_history', JSON.stringify(absorptionHistory.value))
    } catch (err) {
      console.error('Error saving to localStorage:', err)
    }
  }
}

// تحميل السجل من localStorage
const loadAbsorptionHistory = () => {
  if (import.meta.client) {
    try {
      const saved = localStorage.getItem('absorption_history')
      if (saved) {
        absorptionHistory.value = JSON.parse(saved)
      }
    } catch (err) {
      console.error('Error loading from localStorage:', err)
    }
  }
}

// حذف السجل
const clearAbsorptionHistory = () => {
  absorptionHistory.value = []
  if (import.meta.client) {
    localStorage.removeItem('absorption_history')
  }
  showDeleteConfirmModal.value = false
}

// فتح مودل التأكيد
const openDeleteConfirmModal = () => {
  showDeleteConfirmModal.value = true
}

// إلغاء الحذف
const cancelDelete = () => {
  showDeleteConfirmModal.value = false
}

// تنسيق التاريخ والوقت
const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleString('ar-SA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// تنسيق الأرقام الكبيرة
const formatNumber = (num: number) => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

// مراقبة تغييرات الامتصاص وتشغيل التنبيهات
watch(absorptionDetected, (newValue, oldValue) => {
  // إذا تم كشف امتصاص جديد (لم يكن موجوداً من قبل)
  if (newValue && !oldValue) {
    // حفظ في السجل
    saveAbsorptionToHistory(newValue)
    
    // تشغيل النغمة
    playNotificationSound(newValue.type!)
    
    // الانتقال للأعلى
    scrollToAbsorptionAlert()
    
    // إشعار المتصفح (إذا كان مسموحاً)
    if (import.meta.client && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🐋 كشف امتصاص!', {
        body: newValue.message,
        icon: '/favicon.ico',
        tag: 'absorption-alert'
      })
    }
  }
}, { deep: true })

// حساب النقاط للتحليل الحالي (أكثر دقة وصرامة)
const calculateSentimentScore = (imb: any, flow: any, momentum: number): number => {
  if (!imb || !flow) return 0
  
  let score = 0
  
  // 1. اتجاه السعر الفعلي (وزن 45% - الأهم!)
  // نستخدم momentum مباشرة (-3 إلى +3)
  score += momentum * 0.45
  
  // 2. ضغط الشراء/البيع من Trade Flow (وزن 35%)
  const flowDiff = flow.buyPressure - flow.sellPressure
  let flowScore = 0
  if (flowDiff > 30) flowScore = 3
  else if (flowDiff > 15) flowScore = 2
  else if (flowDiff > 5) flowScore = 1
  else if (flowDiff > -5) flowScore = 0
  else if (flowDiff > -15) flowScore = -1
  else if (flowDiff > -30) flowScore = -2
  else flowScore = -3
  score += flowScore * 0.35
  
  // 3. Order Book Imbalance (وزن 20%)
  const orderBookScore = imb.imbalance
  let obScore = 0
  if (orderBookScore > 20) obScore = 3
  else if (orderBookScore > 10) obScore = 2
  else if (orderBookScore > 5) obScore = 1
  else if (orderBookScore > -5) obScore = 0
  else if (orderBookScore > -10) obScore = -1
  else if (orderBookScore > -20) obScore = -2
  else obScore = -3
  score += obScore * 0.2
  
  return score
}

// حساب مستوى الثقة
const confidenceLevel = computed(() => {
  if (sentimentHistory.value.length < MIN_READINGS_FOR_RELIABLE) {
    return 'منخفض'
  }
  
  // حساب الانحراف المعياري للقراءات
  const avg = sentimentHistory.value.reduce((a, b) => a + b, 0) / sentimentHistory.value.length
  const variance = sentimentHistory.value.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / sentimentHistory.value.length
  const stdDev = Math.sqrt(variance)
  
  // إذا كان الانحراف المعياري منخفض = استقرار عالي = ثقة عالية
  if (stdDev < 0.5) return 'عالي'
  else if (stdDev < 1.5) return 'متوسط'
  else return 'منخفض'
})

const marketSentiment = computed(() => {
  if (sentimentHistory.value.length < MIN_READINGS_FOR_RELIABLE) return 'جاري التحليل...'
  
  // حساب متوسط النقاط من آخر N قراءة
  const avgScore = sentimentHistory.value.reduce((a, b) => a + b, 0) / sentimentHistory.value.length
  
  // حساب الانحراف المعياري للاستقرار
  const variance = sentimentHistory.value.reduce((sum, val) => sum + Math.pow(val - avgScore, 2), 0) / sentimentHistory.value.length
  const stdDev = Math.sqrt(variance)
  
  // تصنيف صارم جداً - فقط الإشارات القوية المؤكدة
  if (avgScore >= 2.0 && stdDev < 0.8) return 'صعودي قوي جداً - شراء مؤكد 🚀'
  else if (avgScore >= 1.3 && stdDev < 1.0) return 'صعودي قوي - فرصة شراء ممتازة 📈'
  else if (avgScore >= 0.7 && stdDev < 1.2) return 'صعودي - فرصة شراء جيدة ↗️'
  else if (avgScore > -0.7) return 'محايد - انتظر الإشارة الواضحة ⏸️'
  else if (avgScore > -1.3 && stdDev < 1.2) return 'هبوطي - فرصة بيع جيدة ↘️'
  else if (avgScore > -2.0 && stdDev < 1.0) return 'هبوطي قوي - فرصة بيع ممتازة 📉'
  else if (stdDev < 0.8) return 'هبوطي قوي جداً - بيع مؤكد 🔻'
  else return 'محايد - انتظر ⏸️'
})

const sentimentDirection = computed(() => {
  const sentiment = marketSentiment.value
  if (sentiment.includes('شراء')) return 'شراء'
  else if (sentiment.includes('بيع')) return 'بيع'
  else return 'انتظار'
})

const formatVolume = (volume: number) => {
  if (Math.abs(volume) >= 1e9) return (volume / 1e9).toFixed(2) + 'B'
  if (Math.abs(volume) >= 1e6) return (volume / 1e6).toFixed(2) + 'M'
  if (Math.abs(volume) >= 1e3) return (volume / 1e3).toFixed(2) + 'K'
  return volume.toFixed(2)
}

const loadAnalytics = async () => {
  if (!selectedSymbol.value) return
  
  try {
    error.value = null
    
    const [orderBook, trades, klines] = await Promise.all([
      getOrderBook(selectedSymbol.value, 100),
      getTrades(selectedSymbol.value, 100),
      useBinanceApi().getKlines(selectedSymbol.value, '5m', 10)
    ])
    
    const newImbalance = calculateOrderBookImbalance(orderBook)
    const newTradeFlow = calculateTradeFlow(trades)
    
    // حساب السعر الحالي
    if (klines.length > 0) {
      const latestKline = klines[klines.length - 1]
      const price = parseFloat(latestKline.close)
      const volume = parseFloat(latestKline.volume)
      currentPrice.value = price
      
      // حفظ السعر في التاريخ
      priceHistory.value.push(price)
      if (priceHistory.value.length > MAX_HISTORY_SIZE) {
        priceHistory.value.shift()
      }
      
      // حفظ الحجم في التاريخ
      volumeHistory.value.push(volume)
      if (volumeHistory.value.length > MAX_HISTORY_SIZE) {
        volumeHistory.value.shift()
      }
      
      // حساب التغير في السعر
      if (priceHistory.value.length >= 2) {
        const oldPrice = priceHistory.value[0]
        priceChange.value = ((price - oldPrice) / oldPrice) * 100
      }
    }
    
    // حفظ نسبة الشراء في التاريخ
    if (newTradeFlow) {
      buyRatioHistory.value.push(newTradeFlow.buyPressure)
      if (buyRatioHistory.value.length > MAX_HISTORY_SIZE) {
        buyRatioHistory.value.shift()
      }
    }
    
    // حساب الزخم (Momentum)
    const momentum = calculatePriceMomentum()
    
    // كشف Absorption
    detectAbsorption()
    
    // حساب النقاط للقراءة الحالية
    const currentScore = calculateSentimentScore(newImbalance, newTradeFlow, momentum)
    
    // إضافة للتاريخ
    sentimentHistory.value.push(currentScore)
    
    // الاحتفاظ بآخر N قراءة فقط
    if (sentimentHistory.value.length > MAX_HISTORY_SIZE) {
      sentimentHistory.value.shift()
    }
    
    // تحديث القيم
    imbalance.value = newImbalance
    tradeFlow.value = newTradeFlow
  } catch (err: any) {
    console.error('Error loading analytics:', err)
    error.value = 'حدث خطأ في تحميل التحليلات'
  }
}

let analyticsInterval: NodeJS.Timeout | null = null

onMounted(() => {
  loadAbsorptionHistory()
  loadAnalytics()
  analyticsInterval = setInterval(loadAnalytics, 15000) // كل 15 ثانية لمزيد من الاستقرار
  
  // طلب إذن الإشعارات
  if (import.meta.client && 'Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
})

onUnmounted(() => {
  if (analyticsInterval) {
    clearInterval(analyticsInterval)
  }
})

watch(selectedSymbol, () => {
  // إعادة تعيين التاريخ عند تغيير العملة
  sentimentHistory.value = []
  priceHistory.value = []
  volumeHistory.value = []
  buyRatioHistory.value = []
  imbalance.value = null
  tradeFlow.value = null
  priceChange.value = 0
  absorptionDetected.value = null
  loadAnalytics()
  if (analyticsInterval) {
    clearInterval(analyticsInterval)
  }
  analyticsInterval = setInterval(loadAnalytics, 15000) // كل 15 ثانية
})
</script>
