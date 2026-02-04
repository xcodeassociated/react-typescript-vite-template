import { useEffect, useState, useRef } from 'react'

interface SseMessage {
  from: string
  to: string
  content: string
}

interface SSEOptions {
  onUpdate?: (message: SseMessage) => void
  onConnect?: () => void
  onError?: (error: Event) => void
  autoReconnect?: boolean
  maxRetries?: number
}

export const useSimpleSSE = (url: string, options: SSEOptions = {}) => {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [lastMessage, setLastMessage] = useState<SseMessage | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const eventSourceRef = useRef<EventSource | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const optionsRef = useRef(options)
  const retryCountRef = useRef(0)
  const maxAttempts = options.maxRetries ?? 5

  // Update options ref
  useEffect(() => {
    optionsRef.current = options
  }, [options])

  // Update ref whenever state changes
  useEffect(() => {
    retryCountRef.current = retryCount
  }, [retryCount])

  const connect = () => {
    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    if (retryCountRef.current < maxAttempts) {
      eventSourceRef.current = new EventSource(url)

      eventSourceRef.current.onopen = () => {
        setConnectionStatus('connected')
        setRetryCount(0) // Reset retry count on successful connection
        optionsRef.current.onConnect?.()
      }

      eventSourceRef.current.addEventListener('connected', (event) => {
        const message: SseMessage = JSON.parse(event.data)
        setLastMessage(message)
      })

      eventSourceRef.current.addEventListener('update', (event) => {
        const message: SseMessage = JSON.parse(event.data)
        setLastMessage(message)
        optionsRef.current.onUpdate?.(message)
      })

      eventSourceRef.current.addEventListener('heartbeat', () => {})

      eventSourceRef.current.onerror = (event) => {
        setConnectionStatus('disconnected')
        optionsRef.current.onError?.(event)

        // Auto-reconnect logic
        if (optionsRef.current.autoReconnect !== false) {
          console.error('SSE error:', event)

          const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)
          console.warn(`Reconnecting in ${delay}ms (attempt ${retryCountRef.current + 1})`)
          setRetryCount((prev) => prev + 1)

          retryTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        }
      }
    }
  }

  useEffect(() => {
    setConnectionStatus('connecting')
    connect()

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      setConnectionStatus('disconnected')
    }
  }, [url]) // Only reconnect when URL

  return {
    connectionStatus,
    lastMessage,
    retryCount,
    maxAttempts,
    reconnect: connect,
  }
}
