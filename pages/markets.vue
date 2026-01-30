<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold">الأسواق</h1>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="ابحث عن عملة..."
        class="px-4 py-2 rounded-lg bg-bg-secondary border border-border-color focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="pulse text-text-secondary text-lg">جاري تحميل الأسواق...</div>
    </div>

    <div v-else-if="error" class="text-center py-12 text-danger">
      {{ error }}
    </div>

    <div v-else class="bg-bg-secondary rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-bg-tertiary">
            <tr>
              <th class="px-6 py-4 text-right text-sm font-semibold">الرمز</th>
              <th class="px-6 py-4 text-right text-sm font-semibold">السعر</th>
              <th class="px-6 py-4 text-right text-sm font-semibold">التغيير (24h)</th>
              <th class="px-6 py-4 text-right text-sm font-semibold">الحجم (24h)</th>
              <th class="px-6 py-4 text-right text-sm font-semibold">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="market in filteredMarkets"
              :key="market.symbol"
              class="border-t border-border-color hover:bg-bg-tertiary/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="font-bold">{{ market.symbol }}</div>
                <div class="text-sm text-text-secondary">{{ market.baseAsset }}/{{ market.quoteAsset }}</div>
              </td>
              <td class="px-6 py-4 font-mono">
                {{ formatPrice(market.price) }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'font-bold',
                    parseFloat(market.priceChangePercent) >= 0 ? 'text-success' : 'text-danger'
                  ]"
                >
                  {{ parseFloat(market.priceChangePercent).toFixed(2) }}%
                </span>
              </td>
              <td class="px-6 py-4 font-mono text-sm">
                {{ formatVolume(market.volume) }}
              </td>
              <td class="px-6 py-4">
                <NuxtLink
                  :to="`/analytics?symbol=${market.symbol}`"
                  class="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-80 transition-opacity text-sm"
                >
                  عرض التحليلات
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getAllSymbols, get24hrTicker } = useBinanceApi()

const markets = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const searchQuery = ref('')

const filteredMarkets = computed(() => {
  if (!searchQuery.value) return markets.value
  const query = searchQuery.value.toUpperCase()
  return markets.value.filter(m => 
    m.symbol.includes(query) || 
    m.baseAsset.includes(query) || 
    m.quoteAsset.includes(query)
  )
})

const formatPrice = (price: string) => {
  const num = parseFloat(price)
  if (num >= 1) return num.toFixed(2)
  if (num >= 0.01) return num.toFixed(4)
  return num.toFixed(8)
}

const formatVolume = (volume: string) => {
  const num = parseFloat(volume)
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

const loadMarkets = async () => {
  try {
    loading.value = true
    error.value = null
    
    const symbols = await getAllSymbols()
    const tickers = await get24hrTicker()
    
    const tickerMap = new Map()
    if (Array.isArray(tickers)) {
      tickers.forEach((t: any) => {
        tickerMap.set(t.symbol, t)
      })
    } else {
      tickerMap.set(tickers.symbol, tickers)
    }

    markets.value = symbols
      .map((s: any) => {
        const ticker = tickerMap.get(s.symbol)
        return {
          ...s,
          price: ticker?.lastPrice || '0',
          priceChangePercent: ticker?.priceChangePercent || '0',
          volume: ticker?.volume || '0'
        }
      })
      .filter((m: any) => parseFloat(m.price) > 0)
      .sort((a: any, b: any) => parseFloat(b.volume) - parseFloat(a.volume))
      .slice(0, 100)
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ في تحميل الأسواق'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMarkets()
  const interval = setInterval(loadMarkets, 30000)
  onUnmounted(() => clearInterval(interval))
})
</script>
