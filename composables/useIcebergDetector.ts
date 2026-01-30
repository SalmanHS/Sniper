// Iceberg Order Detector - كاشف الأوامر المخفية
// الأوامر الضخمة التي يخفيها الحيتان عن طريق تقسيمها

interface OrderSnapshot {
  price: string
  qty: string
  timestamp: number
}

interface IcebergOrder {
  price: string
  side: 'bid' | 'ask'
  detectedQty: number
  refillCount: number
  confidence: number
  strength: 'ضعيف' | 'متوسط' | 'قوي' | 'قوي جداً'
  timestamp: number
}

export const useIcebergDetector = () => {
  // تخزين تاريخ الأوامر لكل مستوى سعر
  const orderHistory = ref<Map<string, OrderSnapshot[]>>(new Map())
  const detectedIcebergs = ref<IcebergOrder[]>([])
  const lastOrderBook = ref<any>(null)

  // تنظيف البيانات القديمة (أكثر من 5 دقائق)
  const cleanOldData = () => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    
    orderHistory.value.forEach((snapshots, key) => {
      const filtered = snapshots.filter(s => s.timestamp > fiveMinutesAgo)
      if (filtered.length === 0) {
        orderHistory.value.delete(key)
      } else {
        orderHistory.value.set(key, filtered)
      }
    })

    detectedIcebergs.value = detectedIcebergs.value.filter(
      ice => ice.timestamp > fiveMinutesAgo
    )
  }

  // كشف أوامر Iceberg بناءً على إعادة التعبئة
  const detectIcebergs = (currentOrderBook: any) => {
    if (!currentOrderBook || !lastOrderBook.value) {
      lastOrderBook.value = currentOrderBook
      return
    }

    const now = Date.now()
    const newIcebergs: IcebergOrder[] = []

    // التحقق من أوامر الشراء (Bids)
    if (currentOrderBook.bids && lastOrderBook.value.bids) {
      const bidIcebergs = analyzeOrders(
        currentOrderBook.bids,
        lastOrderBook.value.bids,
        'bid',
        now
      )
      newIcebergs.push(...bidIcebergs)
    }

    // التحقق من أوامر البيع (Asks)
    if (currentOrderBook.asks && lastOrderBook.value.asks) {
      const askIcebergs = analyzeOrders(
        currentOrderBook.asks,
        lastOrderBook.value.asks,
        'ask',
        now
      )
      newIcebergs.push(...askIcebergs)
    }

    // إضافة أوامر Iceberg المكتشفة
    newIcebergs.forEach(iceberg => {
      // التحقق من عدم وجود نفس السعر مؤخراً (تجنب التكرار)
      const exists = detectedIcebergs.value.find(
        existing =>
          existing.price === iceberg.price &&
          existing.side === iceberg.side &&
          now - existing.timestamp < 60000 // آخر دقيقة
      )

      if (!exists && iceberg.confidence >= 70) {
        detectedIcebergs.value.unshift(iceberg)
        
        // الاحتفاظ بآخر 20 أمر فقط
        if (detectedIcebergs.value.length > 20) {
          detectedIcebergs.value = detectedIcebergs.value.slice(0, 20)
        }
      }
    })

    lastOrderBook.value = currentOrderBook
    cleanOldData()
  }

  // تحليل الأوامر للكشف عن Iceberg
  const analyzeOrders = (
    currentOrders: any[],
    previousOrders: any[],
    side: 'bid' | 'ask',
    timestamp: number
  ): IcebergOrder[] => {
    const icebergs: IcebergOrder[] = []

    currentOrders.forEach((currentOrder, index) => {
      const price = currentOrder.price
      const currentQty = parseFloat(currentOrder.qty)
      const key = `${side}_${price}`

      // البحث عن نفس السعر في الأوامر السابقة
      const previousOrder = previousOrders.find(o => o.price === price)

      if (previousOrder) {
        const previousQty = parseFloat(previousOrder.qty)
        
        // حفظ في التاريخ
        if (!orderHistory.value.has(key)) {
          orderHistory.value.set(key, [])
        }
        orderHistory.value.get(key)!.push({
          price,
          qty: currentOrder.qty,
          timestamp
        })

        const history = orderHistory.value.get(key)!

        // شروط كشف Iceberg:
        // 1. إعادة تعبئة سريعة بعد نقصان الكمية
        // 2. نفس مستوى السعر يُعاد تعبئته عدة مرات
        // 3. الكمية تعود لمستوى قريب من السابق

        if (history.length >= 3) {
          const recentHistory = history.slice(-5) // آخر 5 قراءات
          let refillCount = 0
          let totalRefilled = 0

          for (let i = 1; i < recentHistory.length; i++) {
            const prev = parseFloat(recentHistory[i - 1].qty)
            const curr = parseFloat(recentHistory[i].qty)
            
            // إعادة تعبئة: الكمية تزيد بعد نقصان
            if (curr > prev * 1.1) {
              refillCount++
              totalRefilled += (curr - prev)
            }
          }

          // إذا تمت إعادة التعبئة 2+ مرات، قد يكون Iceberg
          if (refillCount >= 2) {
            // حساب القوة والثقة
            let confidence = 50 + (refillCount * 10)
            let strength: IcebergOrder['strength'] = 'متوسط'

            // التحقق من الكمية الإجمالية
            const avgQty = recentHistory.reduce((sum, h) => sum + parseFloat(h.qty), 0) / recentHistory.length

            if (avgQty > currentQty * 5) {
              confidence += 20
              strength = 'قوي جداً'
            } else if (avgQty > currentQty * 3) {
              confidence += 15
              strength = 'قوي'
            } else if (avgQty > currentQty * 1.5) {
              confidence += 10
            }

            // التحقق من الموقع (أوامر قريبة من السعر الحالي أهم)
            if (index < 5) {
              confidence += 10
            }

            confidence = Math.min(100, confidence)

            icebergs.push({
              price,
              side,
              detectedQty: totalRefilled,
              refillCount,
              confidence: Math.round(confidence),
              strength,
              timestamp
            })
          }
        }
      }
    })

    return icebergs
  }

  // تنسيق عرض أوامر Iceberg
  const getIcebergSummary = () => {
    const bidIcebergs = detectedIcebergs.value.filter(i => i.side === 'bid')
    const askIcebergs = detectedIcebergs.value.filter(i => i.side === 'ask')

    return {
      total: detectedIcebergs.value.length,
      bids: bidIcebergs.length,
      asks: askIcebergs.length,
      strongBids: bidIcebergs.filter(i => i.strength === 'قوي' || i.strength === 'قوي جداً').length,
      strongAsks: askIcebergs.filter(i => i.strength === 'قوي' || i.strength === 'قوي جداً').length,
      recentBidIcebergs: bidIcebergs.slice(0, 3),
      recentAskIcebergs: askIcebergs.slice(0, 3)
    }
  }

  // التحقق من وجود Iceberg عند سعر معين
  const hasIcebergAtPrice = (price: string, side: 'bid' | 'ask'): IcebergOrder | null => {
    return detectedIcebergs.value.find(
      ice => ice.price === price && ice.side === side
    ) || null
  }

  // مسح البيانات
  const reset = () => {
    orderHistory.value.clear()
    detectedIcebergs.value = []
    lastOrderBook.value = null
  }

  return {
    detectIcebergs,
    detectedIcebergs: readonly(detectedIcebergs),
    getIcebergSummary,
    hasIcebergAtPrice,
    reset
  }
}
