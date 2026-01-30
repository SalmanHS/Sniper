interface OrderBookEntry {
  price: string
  qty: string
}

interface OrderBook {
  lastUpdateId: number
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
}

interface Trade {
  id: number
  price: string
  qty: string
  quoteQty: string
  time: number
  isBuyerMaker: boolean
}

interface AggTrade {
  a: number
  p: string
  q: string
  f: number
  l: number
  T: number
  m: boolean
}

interface Kline {
  openTime: number
  open: string
  high: string
  low: string
  close: string
  volume: string
  closeTime: number
  quoteVolume: string
  trades: number
  takerBuyBaseVolume: string
  takerBuyQuoteVolume: string
}

export const useBinanceApi = () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.binanceApiUrl

  const getOrderBook = async (symbol: string, limit: number = 100): Promise<OrderBook> => {
    try {
      const response = await $fetch<any>(`${apiUrl}/depth`, {
        params: {
          symbol: symbol.toUpperCase(),
          limit
        },
        retry: 2,
        retryDelay: 1000
      })
      
      // تحويل البيانات من format Binance [["price", "qty"], ...] إلى {price: "...", qty: "..."}
      return {
        lastUpdateId: response.lastUpdateId,
        bids: response.bids.map((bid: string[]) => ({
          price: bid[0],
          qty: bid[1]
        })),
        asks: response.asks.map((ask: string[]) => ({
          price: ask[0],
          qty: ask[1]
        }))
      }
    } catch (error: any) {
      console.error('Binance API Error (OrderBook):', error)
      throw new Error(error.message || 'فشل في جلب Order Book من Binance')
    }
  }

  const getTrades = async (symbol: string, limit: number = 100): Promise<Trade[]> => {
    try {
      const response = await $fetch<Trade[]>(`${apiUrl}/trades`, {
        params: {
          symbol: symbol.toUpperCase(),
          limit
        },
        retry: 2,
        retryDelay: 1000
      })
      return response
    } catch (error: any) {
      console.error('Binance API Error (Trades):', error)
      throw new Error(error.message || 'فشل في جلب الصفقات من Binance')
    }
  }

  const getAggTrades = async (symbol: string, limit: number = 100): Promise<AggTrade[]> => {
    const response = await $fetch<AggTrade[]>(`${apiUrl}/aggTrades`, {
      params: {
        symbol: symbol.toUpperCase(),
        limit
      }
    })
    return response
  }

  const getKlines = async (
    symbol: string,
    interval: string = '1m',
    limit: number = 100
  ): Promise<Kline[]> => {
    try {
      const response = await $fetch<any[][]>(`${apiUrl}/klines`, {
        params: {
          symbol: symbol.toUpperCase(),
          interval,
          limit
        },
        retry: 2,
        retryDelay: 1000
      })
      
      return response.map((k: any[]) => ({
        openTime: k[0],
        open: k[1],
        high: k[2],
        low: k[3],
        close: k[4],
        volume: k[5],
        closeTime: k[6],
        quoteVolume: k[7],
        trades: k[8],
        takerBuyBaseVolume: k[9],
        takerBuyQuoteVolume: k[10]
      }))
    } catch (error: any) {
      console.error('Binance API Error (Klines):', error)
      throw new Error(error.message || 'فشل في جلب بيانات الشموع من Binance')
    }
  }

  const get24hrTicker = async (symbol?: string) => {
    const url = symbol 
      ? `${apiUrl}/ticker/24hr?symbol=${symbol.toUpperCase()}`
      : `${apiUrl}/ticker/24hr`
    return await $fetch(url)
  }

  const getAllSymbols = async () => {
    const response = await $fetch<any[]>(`${apiUrl}/exchangeInfo`)
    return response.symbols
      .filter((s: any) => s.status === 'TRADING')
      .map((s: any) => ({
        symbol: s.symbol,
        baseAsset: s.baseAsset,
        quoteAsset: s.quoteAsset
      }))
  }

  return {
    getOrderBook,
    getTrades,
    getAggTrades,
    getKlines,
    get24hrTicker,
    getAllSymbols
  }
}

export type { OrderBook, OrderBookEntry, Trade, AggTrade, Kline }
