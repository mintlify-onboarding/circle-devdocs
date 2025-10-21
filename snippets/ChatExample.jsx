export const ChatExample = ({ sessionApiUrl, chatApiUrl } = {}) => {
  function generateMockSessionId() {
    return crypto.randomUUID();
  }

  async function mockCreateSession() {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      sessionId: generateMockSessionId(),
    };
  }

  async function mockChatResponse(message) {
    // Simulate network delay and streaming response
    const responses = [
      "That's an interesting question! ",
      "Let me think about that... ",
      "Here's what I think: ",
      "I appreciate you asking. ",
      "That's a great point. ",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const fullResponse = randomResponse + message + " (mock response)";

    return {
      async *[Symbol.asyncIterator]() {
        const chunkSize = 5;
        for (let i = 0; i < fullResponse.length; i += chunkSize) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          yield {
            type: "content",
            content: fullResponse.slice(i, i + chunkSize),
          };
        }
        yield { type: "completion" };
      },
    };
  }

  const StreamingState = {
    IDLE: "idle",
    STREAMING: "streaming",
    RETRYING: "retrying",
  };

  // ============================================================================
  // Chat Reducer
  // ============================================================================

  const initialChatState = {
    messages: [],
    streamingState: StreamingState.IDLE,
    error: false,
  };

  function chatReducer(state, action) {
    switch (action.type) {
      case "ADD_USER_MESSAGE":
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              id: crypto.randomUUID(),
              type: "user",
              content: action.payload.content,
              timestamp: new Date(),
            },
          ],
        };

      case "ADD_BOT_MESSAGE":
        return {
          ...state,
          messages: [
            ...state.messages,
            {
              id: action.payload.id,
              type: "bot",
              content: "",
              timestamp: new Date(),
              isComplete: false,
            },
          ],
        };

      case "APPEND_TO_BOT_MESSAGE":
        return {
          ...state,
          messages: state.messages.map((msg, index) =>
            index === state.messages.length - 1 && msg.type === "bot"
              ? { ...msg, content: msg.content + action.payload.content }
              : msg
          ),
        };

      case "COMPLETE_BOT_MESSAGE":
        return {
          ...state,
          messages: state.messages.map((msg, index) =>
            index === state.messages.length - 1 && msg.type === "bot" ? { ...msg, isComplete: true } : msg
          ),
        };

      case "SET_STREAMING_STATE":
        return {
          ...state,
          streamingState: action.payload,
        };

      case "SET_ERROR":
        return {
          ...state,
          error: action.payload,
        };

      case "REMOVE_LAST_BOT_MESSAGE":
        return {
          ...state,
          messages: state.messages.slice(0, -1),
        };

      default:
        return state;
    }
  }

  // ============================================================================
  // useChat Hook (extracted from component)
  // ============================================================================

  function useChat({ sessionId, chatApiUrl: customChatApiUrl }) {
    const [state, dispatch] = useReducer(chatReducer, initialChatState);
    const isMounted = useRef(true);

    // Cleanup on unmount
    useEffect(() => {
      isMounted.current = true;
      return () => {
        isMounted.current = false;
      };
    }, []);

    // Safe dispatch to avoid updating unmounted component
    const safeDispatch = useCallback(
      (action) => {
        if (isMounted.current) {
          dispatch(action);
        }
      },
      [dispatch]
    );

    const handleError = useCallback(() => {
      safeDispatch({ type: "SET_ERROR", payload: true });
      safeDispatch({ type: "SET_STREAMING_STATE", payload: StreamingState.IDLE });
    }, [safeDispatch]);

    const processStream = useCallback(
      async (reader) => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Convert the chunk to text
            const chunk = new TextDecoder().decode(value);
            const data = JSON.parse(chunk);

            // Handle the chunk
            if (data.type === "completion") {
              safeDispatch({ type: "COMPLETE_BOT_MESSAGE" });
              continue;
            }

            if (data.content) {
              safeDispatch({
                type: "APPEND_TO_BOT_MESSAGE",
                payload: { content: data.content },
              });
            }
          }
        } catch (error) {
          handleError();
        }
      },
      [safeDispatch, handleError]
    );

    const processMockStream = useCallback(
      async (mockIterator) => {
        try {
          for await (const chunk of mockIterator) {
            if (!isMounted.current) return;

            if (chunk.type === "completion") {
              safeDispatch({ type: "COMPLETE_BOT_MESSAGE" });
              continue;
            }

            if (chunk.content) {
              safeDispatch({
                type: "APPEND_TO_BOT_MESSAGE",
                payload: { content: chunk.content },
              });
            }
          }
        } catch (error) {
          handleError();
        }
      },
      [safeDispatch, handleError]
    );

    const handleSendMessage = useCallback(
      async (content) => {
        if (!isMounted.current) return;

        // Reset error state
        safeDispatch({ type: "SET_ERROR", payload: false });

        // Add user message to chat
        safeDispatch({ type: "ADD_USER_MESSAGE", payload: { content } });

        // Set streaming state
        safeDispatch({
          type: "SET_STREAMING_STATE",
          payload: StreamingState.STREAMING,
        });

        // Add bot message placeholder
        const botMessageId = crypto.randomUUID();
        safeDispatch({ type: "ADD_BOT_MESSAGE", payload: { id: botMessageId } });

        try {
          if (!customChatApiUrl) {
            // Use mock API
            const mockIterator = await mockChatResponse(content);
            await processMockStream(mockIterator);
          } else {
            // Use real API
            const response = await fetch(customChatApiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: content,
                sessionId,
              }),
            });

            if (!response.ok) {
              throw new Error("HTTP error");
            }

            const reader = response.body?.getReader();
            if (!reader) {
              throw new Error("No reader available");
            }

            await processStream(reader);
          }
        } catch (error) {
          handleError();
        } finally {
          safeDispatch({
            type: "SET_STREAMING_STATE",
            payload: StreamingState.IDLE,
          });
        }
      },
      [safeDispatch, sessionId, customChatApiUrl, processStream, processMockStream, handleError]
    );

    const handleRetry = useCallback(async () => {
      safeDispatch({ type: "REMOVE_LAST_BOT_MESSAGE" });
      const lastUserMessage = state.messages.filter((message) => message.type === "user").at(-1)?.content;

      if (lastUserMessage) {
        await handleSendMessage(lastUserMessage);
      }
    }, [safeDispatch, handleSendMessage, state.messages]);

    return {
      handleSendMessage,
      messages: state.messages,
      streamingState: state.streamingState,
      error: state.error,
      handleRetry,
    };
  }

  // ============================================================================
  // useChatScroll Hook
  // ============================================================================

  function useChatScroll(shouldScroll) {
    const scrollContainerRef = useRef(null);
    const chatEndRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const scrollToBottom = useCallback(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsAtBottom(true);
    }, []);

    useEffect(() => {
      if (shouldScroll) {
        scrollToBottom();
      }
    }, [shouldScroll, scrollToBottom]);

    useEffect(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = container;
        const atBottom = scrollHeight - scrollTop - clientHeight < 10;
        setIsAtBottom(atBottom);
      };

      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }, []);

    return { scrollContainerRef, chatEndRef, isAtBottom, scrollToBottom };
  }

  // ============================================================================
  // Error Display Component
  // ============================================================================

  function ErrorDisplay({ error }) {
    const errorMessages = {
      SESSION_CREATION_FAILED: "Failed to create chat session. Please try again.",
      UNEXPECTED_ERROR: "An unexpected error occurred. Please try again later.",
    };

    return <div className="p-4 bg-red-100 text-red-700 rounded">{errorMessages[error]}</div>;
  }

  // ============================================================================
  // Chat Interface Component
  // ============================================================================

  function ChatInterface({ sessionId }) {
    const { handleSendMessage, messages, streamingState, error, handleRetry } = useChat({ sessionId, chatApiUrl });

    const hasMessages = useMemo(() => messages.length > 0, [messages]);

    const { scrollContainerRef, chatEndRef, scrollToBottom } = useChatScroll(hasMessages);

    const formatTime = useCallback((date) => {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }, []);

    const getFirstMessageTime = useCallback(() => {
      const firstMessage = messages.find((msg) => msg.type === "bot");
      return firstMessage
        ? formatTime(firstMessage.timestamp)
        : new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }, [messages, formatTime]);

    const handleSubmit = useCallback(
      (message) => {
        void (async () => {
          scrollToBottom();
          await handleSendMessage(message);
        })();
      },
      [handleSendMessage, scrollToBottom]
    );

    return (
      <div className="flex flex-col dark:text-white transition-colors">
        {/* Messages Container */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto py-4">
          <div className="w-full mx-auto">
            {hasMessages && (
              <div className="space-y-6 py-4">
                <div className="flex justify-center items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-8">
                  <Icon icon="calendar" />
                  <span>{getFirstMessageTime()}</span>
                </div>

                <div className="space-y-5">
                  {messages.map((message) =>
                    message.type === "user" ? (
                      <div key={message.id} className="flex justify-end">
                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl px-5 py-3 max-w-sm break-words text-sm">
                          {message.content}
                        </div>
                      </div>
                    ) : (
                      <div key={message.id} className="flex justify-start gap-0">
                        <div className="flex-1 max-w-sm">
                          <div className="mb-2">
                            <svg
                              data-testid="svg"
                              viewBox="102 50 234 236"
                              width="2em"
                              height="2em"
                              xmlns="http://www.w3.org/2000/svg"
                              className="mb-2"
                            >
                              <defs>
                                <linearGradient
                                  data-testid="linear-gradient"
                                  gradientUnits="userSpaceOnUse"
                                  id="linearGradient"
                                  x1="177.86"
                                  x2="341.06"
                                  y1="291.18"
                                  y2="127.98"
                                >
                                  <stop offset="0" stop-color="#b090f5"></stop>
                                  <stop offset="1" stop-color="#5fbfff"></stop>
                                </linearGradient>
                                <linearGradient
                                  data-testid="linear-gradient-2"
                                  gradientUnits="userSpaceOnUse"
                                  id="linearGradient2"
                                  x1="96.43"
                                  x2="259.64"
                                  y1="207.75"
                                  y2="44.55"
                                >
                                  <stop offset="0" stop-color="#68d7fa"></stop>
                                  <stop offset="1" stop-color="#4ee498"></stop>
                                </linearGradient>
                              </defs>
                              <path
                                d="M319.43,110.37l-5-8.78a5.14,5.14,0,0,0-8.11-1.08L294.82,112a5.17,5.17,0,0,0-.64,6.51,90.22,90.22,0,0,1,10,20.58l0,0a90.2,90.2,0,0,1-85.45,119,89.38,89.38,0,0,1-42.26-10.49l19.45-19.46a64.41,64.41,0,0,0,80.77-88.29,5.15,5.15,0,0,0-8.29-1.41L256.76,150a5.14,5.14,0,0,0-1.37,4.82l1,4.18a38.63,38.63,0,0,1-56.75,42.39l-5.13-2.94a5.13,5.13,0,0,0-6.2.83l-47.51,47.5a5.15,5.15,0,0,0,.51,7.73l7,5.37a114.86,114.86,0,0,0,70.46,23.88A116,116,0,0,0,319.43,110.37Z"
                                data-testid="icon-path"
                                fill="url(#linearGradient)"
                              ></path>
                              <path
                                d="M289.21,75.82a114.83,114.83,0,0,0-70.46-23.89A116,116,0,0,0,118.06,225.37l5,8.77a5.16,5.16,0,0,0,8.12,1.09l11.48-11.48a5.19,5.19,0,0,0,.64-6.5,89.81,89.81,0,0,1-10-20.58l0,0a90.2,90.2,0,0,1,85.45-119A89.29,89.29,0,0,1,261,88.19l-19.46,19.45a64.39,64.39,0,0,0-87.21,60.23c0,1.07.29,5.95.38,6.79a64.76,64.76,0,0,0,6.07,21.27,5.16,5.16,0,0,0,8.3,1.41l11.64-11.65a5.15,5.15,0,0,0,1.38-4.81l-1-4.19a38.62,38.62,0,0,1,56.75-42.38l5.13,2.94a5.16,5.16,0,0,0,6.2-.83l47.5-47.5a5.16,5.16,0,0,0-.5-7.74Z"
                                data-testid="icon-path"
                                fill="url(#linearGradient2)"
                              ></path>
                            </svg>
                          </div>
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Circle AI</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {message.content}
                            {error && message.id === messages.at(-1)?.id && (
                              <button
                                onClick={handleRetry}
                                className="mt-3 px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition"
                              >
                                Retry
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div ref={chatEndRef} aria-hidden="true" className="h-px w-full opacity-0" />
              </div>
            )}
          </div>
        </div>

        {/* Input Container - Card Style */}
        <div className="w-full">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-800 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const textarea = e.currentTarget.querySelector("textarea");
                  if (textarea) {
                    handleSubmit(textarea.value);
                    textarea.value = "";
                  }
                }}
              >
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-3 pr-14 border-0 focus:outline-none focus:ring-0 transition placeholder-gray-400 dark:placeholder-gray-500 text-gray-700 dark:text-gray-200 bg-transparent text-sm resize-none"
                    disabled={streamingState !== StreamingState.IDLE}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        const textarea = e.currentTarget;
                        handleSubmit(textarea.value);
                        textarea.value = "";
                      }
                    }}
                    placeholder={!hasMessages ? "How can we help you?" : "Continue the conversation..."}
                    rows="3"
                  />
                  <button
                    disabled={streamingState !== StreamingState.IDLE}
                    className="absolute right-0 bottom-0 flex items-center justify-center w-10 h-10 p-0 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition"
                    type="submit"
                  >
                    <Icon icon="paper-plane" color="#fff" />
                  </button>
                </div>
              </form>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 text-center text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              <p>
                AI responses may be inaccurate. Circle is not liable for errors or outcomes. Don't share sensitive or
                confidential information.{" "}
                <a href="#" className="text-blue-500 dark:text-blue-400 hover:underline">
                  Learn more
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let data;

        if (!sessionApiUrl) {
          // Use mock API
          data = await mockCreateSession();
        } else {
          // Use real API
          const response = await fetch(sessionApiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to create session");
          }

          data = await response.json();
        }

        if (!data?.sessionId) {
          throw new Error("SESSION_CREATION_FAILED");
        }

        setSessionId(data.sessionId);
      } catch (err) {
        console.error("Error creating chat session:", err);
        setError(
          err instanceof Error && err.message === "SESSION_CREATION_FAILED"
            ? "SESSION_CREATION_FAILED"
            : "UNEXPECTED_ERROR"
        );
      } finally {
        setIsLoading(false);
      }
    };

    void createSession();
  }, [sessionApiUrl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (!sessionId) {
    return null;
  }

  return <ChatInterface sessionId={sessionId} />;
};
