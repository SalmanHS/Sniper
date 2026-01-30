<template>
  <div class="bg-bg-secondary rounded-2xl p-6 shadow-lg border border-border-color/30 dark:border-border-color dark:shadow-2xl">
    <h3 class="text-xl font-bold mb-4">تدفق الصفقات - {{ symbol }}</h3>

    <div v-if="error" class="text-center py-8 text-danger">
      {{ error }}
    </div>

    <div v-else-if="tradeFlow">
      <!-- Pressure Indicators -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="bg-bg-tertiary/50 dark:bg-bg-tertiary/20 rounded-lg p-4 border border-border-color/30 dark:border-border-color">
          <div class="text-sm text-text-secondary mb-2">ضغط الشراء</div>
          <div class="text-2xl font-bold text-success">{{ tradeFlow.buyPressure.toFixed(2) }}%</div>
          <div class="text-xs text-text-secondary mt-1">
            {{ tradeFlow.buyCount }} صفقة | {{ formatVolume(tradeFlow.buyVolume) }}
          </div>
        </div>
        <div class="bg-bg-tertiary/50 dark:bg-bg-tertiary/20 rounded-lg p-4 border border-border-color/30 dark:border-border-color">
          <div class="text-sm text-text-secondary mb-2">ضغط البيع</div>
          <div class="text-2xl font-bold text-danger">{{ tradeFlow.sellPressure.toFixed(2) }}%</div>
          <div class="text-xs text-text-secondary mt-1">
            {{ tradeFlow.sellCount }} صفقة | {{ formatVolume(tradeFlow.sellVolume) }}
          </div>
        </div>
      </div>

      <!-- Flow Bar -->
      <div class="mb-4">
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="text-text-secondary">التدفق الصافي</span>
          <span 
            :class="[
              'font-bold',
              tradeFlow.netFlow >= 0 ? 'text-success' : 'text-danger'
            ]"
          >
            {{ formatVolume(tradeFlow.netFlow) }}
          </span>
        </div>
        <div class="h-4 bg-bg-tertiary rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300"
            :class="tradeFlow.netFlow >= 0 ? 'bg-success' : 'bg-danger'"
            :style="{ 
              width: `${Math.abs(tradeFlow.buyPressure - tradeFlow.sellPressure)}%`,
              marginRight: tradeFlow.netFlow >= 0 ? '0' : 'auto',
              marginLeft: tradeFlow.netFlow < 0 ? '0' : 'auto'
            }"
          ></div>
        </div>
      </div>

      <!-- Recent Trades -->
      <div>
        <div class="text-sm font-semibold mb-2 pb-2 border-b border-border-color">
          الصفقات الأخيرة
        </div>
        <div class="space-y-1 max-h-64 overflow-y-auto">
          <div
            v-for="(trade, index) in recentTrades"
            :key="`trade-${index}`"
            :class="[
              'flex items-center justify-between text-sm p-2 rounded',
              trade.isBuyerMaker ? 'bg-danger/10' : 'bg-success/10'
            ]"
          >
            <span 
              :class="[
                'font-mono',
                trade.isBuyerMaker ? 'text-danger' : 'text-success'
              ]"
            >
              {{ parseFloat(trade.price).toFixed(8) }}
            </span>
            <span class="text-text-secondary font-mono">
              {{ parseFloat(trade.qty).toFixed(6) }}
            </span>
            <span class="text-xs text-text-secondary">
              {{ formatTime(trade.time) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Trade } from '~/composables/useBinanceApi'

interface Props {
  symbol: string
  limit?: number
}

const props = withDefaults(defineProps<Props>(), {
  limit: 50
})

const { getTrades } = useBinanceApi()
const { calculateTradeFlow } = useMarketAnalytics()

const trades = ref<Trade[]>([])
const error = ref<string | null>(null)

const tradeFlow = computed(() => {
  if (trades.value.length === 0) return null
  return calculateTradeFlow(trades.value)
})

const recentTrades = computed(() => {
  return trades.value.slice(0, 20)
})

const formatVolume = (volume: number) => {
  if (Math.abs(volume) >= 1e9) {
    return (volume / 1e9).toFixed(2) + 'B'
  }
  if (Math.abs(volume) >= 1e6) {
    return (volume / 1e6).toFixed(2) + 'M'
  }
  if (Math.abs(volume) >= 1e3) {
    return (volume / 1e3).toFixed(2) + 'K'
  }
  return volume.toFixed(2)
}

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('ar-SA', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
}

const loadTrades = async () => {
  try {
    error.value = null
    const newTrades = await getTrades(props.symbol, props.limit)
    // تحديث سلس
    trades.value = newTrades
  } catch (err: any) {
    error.value = err.message || 'حدث خطأ في تحميل الصفقات'
  }
}

let updateInterval: NodeJS.Timeout | null = null

onMounted(() => {
  loadTrades()
  // تحديث كل 6 ثواني لمزيد من الاستقرار
  updateInterval = setInterval(() => loadTrades(), 6000)
})

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval)
  }
})

watch(() => props.symbol, () => {
  trades.value = []
  loadTrades()
  if (updateInterval) {
    clearInterval(updateInterval)
  }
  // تحديث كل 6 ثواني
  updateInterval = setInterval(() => loadTrades(), 6000)
})
</script>
