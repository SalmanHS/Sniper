<template>
  <div class="space-y-8">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-l from-primary/20 via-primary/10 to-transparent rounded-2xl p-10 shadow-lg">
      <div class="relative z-10">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="text-5xl animate-pulse">📈</div>
          <h1 class="text-5xl font-black bg-gradient-to-l from-primary to-success bg-clip-text text-transparent">
            SniperFlow
          </h1>
        </div>
        <p class="text-2xl font-bold text-center mb-3">
          منصة تحليل احترافية لسوق بينانس
        </p>
        <p class="text-text-secondary text-lg text-center max-w-2xl mx-auto mb-6">
          تحليلات فورية متقدمة • كشف الامتصاص • مؤشرات فنية • تنبيهات ذكية
        </p>
        
        <!-- Quick Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div class="bg-bg-secondary/50 backdrop-blur rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-primary">∞</div>
            <div class="text-xs text-text-secondary mt-1">تحديث فوري</div>
          </div>
          <div class="bg-bg-secondary/50 backdrop-blur rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-success">10+</div>
            <div class="text-xs text-text-secondary mt-1">عملات مشهورة</div>
          </div>
          <div class="bg-bg-secondary/50 backdrop-blur rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-warning">6+</div>
            <div class="text-xs text-text-secondary mt-1">مؤشرات فنية</div>
          </div>
          <div class="bg-bg-secondary/50 backdrop-blur rounded-lg p-4 text-center">
            <div class="text-2xl font-bold text-danger">🐋</div>
            <div class="text-xs text-text-secondary mt-1">كشف الحيتان</div>
          </div>
        </div>
      </div>
      
      <!-- Background Decoration -->
      <div class="absolute top-0 left-0 w-full h-full opacity-5">
        <div class="absolute top-10 right-10 text-8xl">📊</div>
        <div class="absolute bottom-10 left-10 text-8xl">💹</div>
      </div>
    </div>

    <!-- Market Type Selector -->
    <div class="bg-bg-secondary rounded-2xl p-6 shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <span>💹</span>
          اختر نوع السوق
        </h2>
        <div class="flex items-center gap-2 bg-bg-tertiary p-1 rounded-lg">
          <button
            @click="marketType = 'spot'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-all',
              marketType === 'spot'
                ? 'bg-primary text-white shadow-lg'
                : 'text-text-secondary hover:text-primary'
            ]"
          >
            السوق الفوري (Spot)
          </button>
          <button
            @click="marketType = 'futures'"
            :class="[
              'px-4 py-2 rounded-lg font-semibold transition-all',
              marketType === 'futures'
                ? 'bg-warning text-white shadow-lg'
                : 'text-text-secondary hover:text-warning'
            ]"
          >
            العقود الآجلة (Futures)
          </button>
        </div>
      </div>
      <div v-if="marketType === 'futures'" class="mb-4 p-3 bg-warning/10 border-r-4 border-warning rounded-lg">
        <p class="text-sm text-text-secondary">
          <strong class="text-warning">تحذير:</strong> 
          العقود الآجلة تحمل مخاطر أعلى بسبب الرافعة المالية. تداول بحذر!
        </p>
      </div>
    </div>

    <!-- Popular Coins with Live Prices -->
    <div class="bg-bg-secondary rounded-2xl p-6 shadow-lg">
      <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
        <span>🔥</span>
        {{ marketType === 'spot' ? 'العملات الأكثر شعبية' : 'عقود العملات الأكثر تداولاً' }}
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <button
          v-for="coin in topCoins"
          :key="coin.symbol"
          @click="selectedSymbol = coin.symbol"
          :class="[
            'p-4 rounded-xl transition-all duration-300 text-right',
            selectedSymbol === coin.symbol
              ? 'bg-primary text-white shadow-lg scale-105'
              : 'bg-bg-tertiary hover:bg-border-color hover:scale-105'
          ]"
        >
          <div class="text-2xl mb-2">{{ coin.icon }}</div>
          <div class="font-bold text-lg mb-1">{{ coin.name }}</div>
          <div class="text-xs opacity-75">{{ coin.symbol }}</div>
          <div v-if="coin.price" class="text-sm font-bold mt-2" :class="coin.change >= 0 ? 'text-success' : 'text-danger'">
            ${{ coin.price }}
            <span class="text-xs">
              {{ coin.change >= 0 ? '↗' : '↘' }} {{ Math.abs(coin.change).toFixed(2) }}%
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        to="/analytics"
        class="group bg-gradient-to-l from-success/20 to-transparent rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-start gap-4">
          <div class="text-5xl group-hover:animate-bounce">🐋</div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold mb-2 group-hover:text-success transition-colors">
              التحليلات المتقدمة
            </h3>
            <p class="text-text-secondary mb-3">
              كشف الامتصاص • تحليل معنويات السوق • سجل التنبيهات
            </p>
            <div class="flex items-center gap-2 text-success font-semibold">
              <span>اذهب للتحليلات</span>
              <span class="group-hover:translate-x-[-4px] transition-transform">←</span>
            </div>
          </div>
        </div>
      </NuxtLink>

      <NuxtLink
        to="/guide"
        class="group bg-gradient-to-l from-primary/20 to-transparent rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <div class="flex items-start gap-4">
          <div class="text-5xl group-hover:animate-bounce">📖</div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
              دليل الاستخدام
            </h3>
            <p class="text-text-secondary mb-3">
              تعلم كيفية استخدام المنصة • شرح المؤشرات • نصائح وحيل
            </p>
            <div class="flex items-center gap-2 text-primary font-semibold">
              <span>اقرأ الدليل</span>
              <span class="group-hover:translate-x-[-4px] transition-transform">←</span>
            </div>
          </div>
        </div>
      </NuxtLink>

      <div class="bg-gradient-to-l from-warning/20 to-transparent rounded-2xl p-8 shadow-lg">
        <div class="flex items-start gap-4">
          <div class="text-5xl">📊</div>
          <div class="flex-1">
            <h3 class="text-2xl font-bold mb-2">معاينة سريعة</h3>
            <p class="text-text-secondary mb-3">
              اختر عملة أدناه لعرض الرسوم البيانية والتحليلات الفورية
            </p>
            <select
              v-model="selectedSymbol"
              class="w-full p-3 rounded-lg bg-bg-tertiary border-2 border-warning/30 focus:outline-none focus:ring-2 focus:ring-warning font-bold"
            >
              <option v-for="symbol in popularSymbols" :key="symbol" :value="symbol">
                {{ symbol }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Grid -->
    <div v-if="selectedSymbol" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold flex items-center gap-3">
          <span>📈</span>
          {{ selectedSymbol }}
        </h2>
        <NuxtLink
          :to="`/analytics?symbol=${selectedSymbol}`"
          class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition-all font-semibold shadow-lg hover:shadow-xl"
        >
          عرض التحليلات المتقدمة →
        </NuxtLink>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceChart :symbol="selectedSymbol" :key="`chart-${selectedSymbol}`" />
        <OrderBook :symbol="selectedSymbol" :limit="20" :key="`orderbook-${selectedSymbol}`" />
      </div>
      
      <div class="lg:col-span-2">
        <TradeFlow :symbol="selectedSymbol" :limit="50" :key="`tradeflow-${selectedSymbol}`" />
      </div>
    </div>

    <!-- Features -->
    <div class="bg-bg-secondary rounded-2xl p-8 shadow-lg">
      <h2 class="text-3xl font-bold mb-8 text-center">✨ مميزات المنصة</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-bg-tertiary rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="text-4xl mb-4">🐋</div>
          <h3 class="text-xl font-bold mb-2">كشف الامتصاص</h3>
          <p class="text-text-secondary text-sm">
            اكتشف تحركات الحيتان والمؤسسات الكبرى في السوق
          </p>
        </div>

        <div class="bg-bg-tertiary rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="text-4xl mb-4">📊</div>
          <h3 class="text-xl font-bold mb-2">توازن دفتر الأوامر</h3>
          <p class="text-text-secondary text-sm">
            تحليل فوري لتوازن أوامر الشراء والبيع
          </p>
        </div>

        <div class="bg-bg-tertiary rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="text-4xl mb-4">💹</div>
          <h3 class="text-xl font-bold mb-2">تدفق الصفقات</h3>
          <p class="text-text-secondary text-sm">
            قياس ضغط الشراء مقابل البيع في الوقت الفعلي
          </p>
        </div>

        <div class="bg-bg-tertiary rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="text-4xl mb-4">⚡</div>
          <h3 class="text-xl font-bold mb-2">تنبيهات زيادة الحجم</h3>
          <p class="text-text-secondary text-sm">
            اكتشاف الزيادات المفاجئة في حجم التداول
          </p>
        </div>

        <div class="bg-bg-tertiary rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="text-4xl mb-4">📈</div>
          <h3 class="text-xl font-bold mb-2">مؤشرات فنية</h3>
          <p class="text-text-secondary text-sm">
            EMA, SMA, Bollinger Bands, RSI, MACD والمزيد
          </p>
        </div>

        <div class="bg-bg-tertiary rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="text-4xl mb-4">🔔</div>
          <h3 class="text-xl font-bold mb-2">تنبيهات صوتية</h3>
          <p class="text-text-secondary text-sm">
            إشعارات فورية عند اكتشاف فرص مهمة
          </p>
        </div>

        <div class="bg-bg-tertiary rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="text-4xl mb-4">📋</div>
          <h3 class="text-xl font-bold mb-2">سجل التنبيهات</h3>
          <p class="text-text-secondary text-sm">
            حفظ تلقائي لجميع تنبيهات الامتصاص
          </p>
        </div>

        <div class="bg-bg-tertiary rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="text-4xl mb-4">🎨</div>
          <h3 class="text-xl font-bold mb-2">واجهة عصرية</h3>
          <p class="text-text-secondary text-sm">
            تصميم جميل مع وضع ليلي ونهاري
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-gradient-to-l from-primary/10 to-success/10 rounded-2xl p-10 text-center shadow-lg">
      <h2 class="text-3xl font-bold mb-4">جاهز للبدء؟</h2>
      <p class="text-text-secondary text-lg mb-6 max-w-2xl mx-auto">
        استخدم أدوات التحليل المتقدمة واكتشف فرص التداول قبل الآخرين
      </p>
      <NuxtLink
        to="/analytics"
        class="inline-block px-8 py-4 bg-primary text-white rounded-xl hover:bg-primary/80 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
      >
        ابدأ التحليل الآن 🚀
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedSymbol = ref('BTCUSDT')
const marketType = ref<'spot' | 'futures'>('spot')

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

const popularSymbols = computed(() => {
  return marketType.value === 'spot' ? spotSymbols : futuresSymbols
})

const spotCoins = ref([
  { symbol: 'BTCUSDT', name: 'Bitcoin', icon: '₿', price: null, change: 0 },
  { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'Ξ', price: null, change: 0 },
  { symbol: 'BNBUSDT', name: 'BNB', icon: '💎', price: null, change: 0 },
  { symbol: 'SOLUSDT', name: 'Solana', icon: '◎', price: null, change: 0 },
  { symbol: 'XRPUSDT', name: 'XRP', icon: '✕', price: null, change: 0 },
])

const futuresCoins = ref([
  { symbol: 'BTCUSDT', name: 'Bitcoin', icon: '₿', price: null, change: 0 },
  { symbol: 'ETHUSDT', name: 'Ethereum', icon: 'Ξ', price: null, change: 0 },
  { symbol: 'BNBUSDT', name: 'BNB', icon: '💎', price: null, change: 0 },
  { symbol: 'SOLUSDT', name: 'Solana', icon: '◎', price: null, change: 0 },
  { symbol: 'XRPUSDT', name: 'XRP', icon: '✕', price: null, change: 0 },
])

const topCoins = computed(() => {
  return marketType.value === 'spot' ? spotCoins.value : futuresCoins.value
})

// Load live prices
const { get24hrTicker } = useBinanceApi()

const loadPrices = async () => {
  try {
    const coins = marketType.value === 'spot' ? spotCoins.value : futuresCoins.value
    for (const coin of coins) {
      const ticker = await get24hrTicker(coin.symbol)
      if (ticker) {
        coin.price = parseFloat(ticker.lastPrice).toFixed(2)
        coin.change = parseFloat(ticker.priceChangePercent)
      }
    }
  } catch (err) {
    console.error('Error loading prices:', err)
  }
}

// Watch market type changes
watch(marketType, () => {
  loadPrices()
})

onMounted(() => {
  loadPrices()
  // Update prices every 30 seconds
  setInterval(loadPrices, 30000)
})
</script>
