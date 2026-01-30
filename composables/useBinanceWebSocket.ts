interface WebSocketMessage {
  stream: string
  data: any
}

export const useBinanceWebSocket = () => {
  let ws: WebSocket | null = null
  let streams: Set<string> = new Set()
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  const reconnectDelay = 1000

  const connect = (streamNames: string[], onMessage: (data: any) => void) => {
    if (ws?.readyState === WebSocket.OPEN) {
      return
    }

    const config = useRuntimeConfig()
    const baseUrl = config.public.binanceWsUrl
    const streamParams = streamNames.join('/')
    const url = `${baseUrl}/${streamParams}`

    ws = new WebSocket(url)

    ws.onopen = () => {
      console.log('WebSocket connected')
      reconnectAttempts = 0
      streams = new Set(streamNames)
    }

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)
        onMessage(message)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.onclose = () => {
      console.log('WebSocket closed')
      if (reconnectAttempts < maxReconnectAttempts) {
        reconnectAttempts++
        setTimeout(() => {
          connect(Array.from(streams), onMessage)
        }, reconnectDelay * reconnectAttempts)
      }
    }
  }

  const disconnect = () => {
    if (ws) {
      ws.close()
      ws = null
      streams.clear()
    }
  }

  const subscribe = (streamName: string, onMessage: (data: any) => void) => {
    if (!streams.has(streamName)) {
      streams.add(streamName)
      if (ws?.readyState === WebSocket.OPEN) {
        disconnect()
      }
      connect(Array.from(streams), onMessage)
    }
  }

  const unsubscribe = (streamName: string) => {
    streams.delete(streamName)
    if (streams.size === 0) {
      disconnect()
    } else if (ws?.readyState === WebSocket.OPEN) {
      disconnect()
      connect(Array.from(streams), () => {})
    }
  }

  const isConnected = computed(() => {
    if (import.meta.client) {
      return ws?.readyState === WebSocket.OPEN
    }
    return false
  })

  return {
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    isConnected
  }
}
