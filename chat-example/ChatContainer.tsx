'use client'

import { useEffect, useState } from 'react'

import { ChatInterface } from './ChatInterface'

type ChatError = 'SESSION_CREATION_FAILED' | 'UNEXPECTED_ERROR'

/**
 * Error component to display when session creation fails.
 */
const ErrorDisplay: React.FC<{ error: ChatError }> = ({ error }) => {
  const errorMessages = {
    SESSION_CREATION_FAILED: 'Failed to create chat session. Please try again.',
    UNEXPECTED_ERROR: 'An unexpected error occurred. Please try again later.',
  }

  return (
    <div className="p-4 bg-red-100 text-red-700 rounded">
      {errorMessages[error]}
    </div>
  )
}

/**
 * Container component that handles session creation and renders the chat interface.
 * This is a client component that creates a new chat session before rendering the chat UI.
 */
export const ChatContainer: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [error, setError] = useState<ChatError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const createSession = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/chat/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to create session')
        }

        const data = await response.json()

        if (!data?.sessionId) {
          throw new Error('SESSION_CREATION_FAILED')
        }

        setSessionId(data.sessionId)
      } catch (err) {
        console.error('Error creating chat session:', err)
        setError(
          err instanceof Error && err.message === 'SESSION_CREATION_FAILED'
            ? 'SESSION_CREATION_FAILED'
            : 'UNEXPECTED_ERROR',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void createSession()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  if (!sessionId) {
    return null
  }

  return <ChatInterface sessionId={sessionId} />
}
