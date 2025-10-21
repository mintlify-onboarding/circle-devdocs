'use client'

import { useCallback, useMemo } from 'react'

import { Header, Button, Icon } from '@your-org/components'
import classNames from 'classnames'

import { useChat } from '../hooks/useChat'
import { useChatScroll } from '../hooks/useChatScroll'
import { StreamingState } from '../types'

type ChatInterfaceProps = {
  /**
   * The ID of the conversation to use.
   */
  sessionId: string
}

/**
 * Renders a chat interface with streaming responses.
 * This is a client component that manages the chat state for a given conversation.
 */
export const ChatInterface: React.FC<ChatInterfaceProps> = ({ sessionId }) => {
  const { handleSendMessage, messages, streamingState, error, handleRetry } =
    useChat({ sessionId })

  const hasMessages = useMemo(() => messages.length > 0, [messages])

  const { scrollContainerRef, chatEndRef, isAtBottom, scrollToBottom } =
    useChatScroll(hasMessages)

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom()
  }, [scrollToBottom])

  const handleSubmit = useCallback(
    (message: string) => {
      void (async () => {
        scrollToBottom()
        await handleSendMessage(message)
      })()
    },
    [handleSendMessage, scrollToBottom],
  )

  return (
    <>
      <div
        ref={scrollContainerRef}
        className={classNames('relative overflow-y-auto px-6 pb-4 pt-8', {
          grow: hasMessages,
        })}
      >
        <div className="w-full max-w-4xl mx-auto">
          {!hasMessages && (
            <div className="mb-6">
              <Header>
                <Header.Title>Chat Interface</Header.Title>
                <Header.Description>
                  Start a conversation with our AI assistant
                </Header.Description>
              </Header>
            </div>
          )}

          {hasMessages && (
            <div className="w-full">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleString()}
              </div>
              <ol className="flex w-full flex-col gap-y-4">
                {messages.map((message) =>
                  message.type === 'user' ? (
                    <div key={message.id} className="bg-blue-100 p-4 rounded">
                      {message.content}
                    </div>
                  ) : (
                    <div key={message.id} className="bg-gray-100 p-4 rounded">
                      {message.content}
                      {error && message.id === messages.at(-1)?.id && (
                        <Button onClick={handleRetry}>Retry</Button>
                      )}
                    </div>
                  ),
                )}
              </ol>
              <div
                ref={chatEndRef}
                aria-hidden="true"
                className="h-px w-full opacity-0"
              />
            </div>
          )}
        </div>
      </div>

      <div className="relative px-6 pb-4">
        {!isAtBottom && hasMessages && (
          <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-full">
            <Button
              className="bg-white shadow-md"
              onClick={handleScrollToBottom}
            >
              <Icon name="arrow-down" />
            </Button>
          </div>
        )}

        <div className="w-full max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              className="flex-1 p-2 border rounded"
              disabled={streamingState !== StreamingState.IDLE}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e.currentTarget.value)
                  e.currentTarget.value = ''
                }
              }}
              placeholder="Type your message..."
              type="text"
            />
            <Button
              disabled={streamingState !== StreamingState.IDLE}
              onClick={() => {
                const input = document.querySelector('input')
                if (input) {
                  handleSubmit(input.value)
                  input.value = ''
                }
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
