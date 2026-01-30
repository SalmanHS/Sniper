import type { OrderBook, Trade, AggTrade } from './useBinanceApi'

export const useMarketAnalytics = () => {
  const calculateOrderBookImbalance = (orderBook: OrderBook) => {
    const bidsVolume = orderBook.bids.reduce((sum, bid) => {
      return sum + parseFloat(bid.price) * parseFloat(bid.qty)
    }, 0)

    const asksVolume = orderBook.asks.reduce((sum, ask) => {
      return sum + parseFloat(ask.price) * parseFloat(ask.qty)
    }, 0)

    const totalVolume = bidsVolume + asksVolume
    const imbalance = totalVolume > 0 
      ? ((bidsVolume - asksVolume) / totalVolume) * 100 
      : 0

    return {
      imbalance,
      bidsVolume,
      asksVolume,
      totalVolume,
      isBullish: imbalance > 0
    }
  }

  const calculateTradeFlow = (trades: Trade[]) => {
    let buyVolume = 0
    let sellVolume = 0
    let buyCount = 0
    let sellCount = 0

    trades.forEach(trade => {
      const volume = parseFloat(trade.quoteQty)
      if (!trade.isBuyerMaker) {
        buyVolume += volume
        buyCount++
      } else {
        sellVolume += volume
        sellCount++
      }
    })

    const totalVolume = buyVolume + sellVolume
    const buyPressure = totalVolume > 0 ? (buyVolume / totalVolume) * 100 : 50
    const sellPressure = 100 - buyPressure

    return {
      buyVolume,
      sellVolume,
      buyCount,
      sellCount,
      buyPressure,
      sellPressure,
      netFlow: buyVolume - sellVolume
    }
  }

  const calculateVolumeSpike = (
    currentVolume: number,
    historicalVolumes: number[],
    threshold: number = 2
  ) => {
    if (historicalVolumes.length === 0) return { isSpike: false, ratio: 1 }

    const avgVolume = historicalVolumes.reduce((sum, v) => sum + v, 0) / historicalVolumes.length
    const ratio = avgVolume > 0 ? currentVolume / avgVolume : 1
    const isSpike = ratio >= threshold

    return {
      isSpike,
      ratio,
      currentVolume,
      avgVolume
    }
  }

  const calculateLiquidationCascade = (aggTrades: AggTrade[]) => {
    const liquidations = aggTrades.filter(trade => {
      const size = parseFloat(trade.q)
      return size > 1000000
    })

    const liquidationVolume = liquidations.reduce((sum, trade) => {
      return sum + parseFloat(trade.q) * parseFloat(trade.p)
    }, 0)

    return {
      liquidationCount: liquidations.length,
      liquidationVolume,
      hasCascade: liquidations.length >= 5
    }
  }

  return {
    calculateOrderBookImbalance,
    calculateTradeFlow,
    calculateVolumeSpike,
    calculateLiquidationCascade
  }
}
