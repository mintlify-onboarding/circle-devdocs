import { useCallback, useEffect, useReducer, useRef } from 'react'

// Types
export enum StreamingState {
  IDLE = 'idle',
  STREAMING = 'streaming',
  RETRYING = 'retrying',
}

type Message = {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isComplete?: boolean
}

type ChatState = {
  messages: Message[]
  streamingState: StreamingState
  error: boolean
}

// Action types
type ChatAction =
  | { type: 'ADD_USER_MESSAGE'; payload: { content: string } }
  | { type: 'ADD_BOT_MESSAGE'; payload: { id: string } }
  | { type: 'APPEND_TO_BOT_MESSAGE'; payload: { content: string } }
  | { type: 'COMPLETE_BOT_MESSAGE' }
  | { type: 'SET_STREAMING_STATE'; payload: StreamingState }
  | { type: 'SET_ERROR'; payload: boolean }
  | { type: 'REMOVE_LAST_BOT_MESSAGE' }

// API endpoint
const CHAT_API_URL = '/api/chat'

// Initial state
const initialState: ChatState = {
  messages: [],
  streamingState: StreamingState.IDLE,
  error: false,
}

// Reducer
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: crypto.randomUUID(),
            type: 'user',
            content: action.payload.content,
            timestamp: new Date(),
          },
        ],
      }

    case 'ADD_BOT_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: action.payload.id,
            type: 'bot',
            content: '',
            timestamp: new Date(),
            isComplete: false,
          },
        ],
      }

    case 'APPEND_TO_BOT_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg, index) =>
          index === state.messages.length - 1 && msg.type === 'bot'
            ? { ...msg, content: msg.content + action.payload.content }
            : msg,
        ),
      }

    case 'COMPLETE_BOT_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg, index) =>
          index === state.messages.length - 1 && msg.type === 'bot'
            ? { ...msg, isComplete: true }
            : msg,
        ),
      }

    case 'SET_STREAMING_STATE':
      return {
        ...state,
        streamingState: action.payload,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }

    case 'REMOVE_LAST_BOT_MESSAGE':
      return {
        ...state,
        messages: state.messages.slice(0, -1),
      }

    default:
      return state
  }
}

type UseChatProps = {
  sessionId: string
}

/**
 * A React hook that manages chat message interactions with a streaming API endpoint.
 * Provides functionality to send messages, receive streaming responses, and manage chat state.
 */
export const useChat = ({ sessionId }: UseChatProps) => {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const isMounted = useRef(true)

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Safe dispatch to avoid updating unmounted component
  const safeDispatch = useCallback(
    (action: ChatAction) => {
      if (isMounted.current) {
        dispatch(action)
      }
    },
    [dispatch],
  )

  const handleError = useCallback(() => {
    safeDispatch({ type: 'SET_ERROR', payload: true })
    safeDispatch({ type: 'SET_STREAMING_STATE', payload: StreamingState.IDLE })
  }, [safeDispatch])

  const processStream = useCallback(
    async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          // Convert the chunk to text
          const chunk = new TextDecoder().decode(value)
          const data = JSON.parse(chunk)

          // Handle the chunk
          if (data.type === 'completion') {
            safeDispatch({ type: 'COMPLETE_BOT_MESSAGE' })
            continue
          }

          if (data.content) {
            safeDispatch({
              type: 'APPEND_TO_BOT_MESSAGE',
              payload: { content: data.content },
            })
          }
        }
      } catch (error) {
        handleError()
      }
    },
    [safeDispatch, handleError],
  )

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!isMounted.current) return

      // Reset error state
      safeDispatch({ type: 'SET_ERROR', payload: false })

      // Set streaming state
      safeDispatch({
        type: 'SET_STREAMING_STATE',
        payload: StreamingState.STREAMING,
      })

      // Add bot message placeholder
      const botMessageId = crypto.randomUUID()
      safeDispatch({ type: 'ADD_BOT_MESSAGE', payload: { id: botMessageId } })

      try {
        const response = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: content,
            sessionId,
          }),
        })

        if (!response.ok) {
          throw new Error('HTTP error')
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No reader available')
        }

        await processStream(reader)
      } catch (error) {
        handleError()
      } finally {
        safeDispatch({
          type: 'SET_STREAMING_STATE',
          payload: StreamingState.IDLE,
        })
      }
    },
    [safeDispatch, sessionId, processStream, handleError],
  )

  const handleRetry = useCallback(async () => {
    safeDispatch({ type: 'REMOVE_LAST_BOT_MESSAGE' })
    const lastUserMessage = state.messages
      .filter((message) => message.type === 'user')
      .at(-1)?.content

    if (lastUserMessage) {
      await handleSendMessage(lastUserMessage)
    }
  }, [safeDispatch, handleSendMessage, state.messages])

  return {
    handleSendMessage,
    messages: state.messages,
    streamingState: state.streamingState,
    error: state.error,
    handleRetry,
  }
}
