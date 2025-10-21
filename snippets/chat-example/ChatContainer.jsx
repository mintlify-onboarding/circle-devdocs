// Types
export const StreamingState = {
  IDLE: "idle",
  STREAMING: "streaming",
  RETRYING: "retrying",
};

// Mock data for testing
export const MOCK_RESPONSES = [
  "Okay, I will help you with your request. Could you please specify what you want to do? Do you want to generate code?",
  "I understand. Let me break this down for you step by step.",
  "That's a great question! Here are some key points to consider.",
  "Based on what you've told me, I recommend the following approach.",
  "I can definitely help with that. Let me provide you with more details.",
];

// Action types
export const ACTIONS = {
  ADD_USER_MESSAGE: "ADD_USER_MESSAGE",
  ADD_BOT_MESSAGE: "ADD_BOT_MESSAGE",
  APPEND_TO_BOT_MESSAGE: "APPEND_TO_BOT_MESSAGE",
  COMPLETE_BOT_MESSAGE: "COMPLETE_BOT_MESSAGE",
  SET_STREAMING_STATE: "SET_STREAMING_STATE",
  SET_ERROR: "SET_ERROR",
  REMOVE_LAST_BOT_MESSAGE: "REMOVE_LAST_BOT_MESSAGE",
};

// API endpoint
export const CHAT_API_URL = "/api/chat";

// Initial state
export const initialState = {
  messages: [],
  streamingState: StreamingState.IDLE,
  error: false,
};

// Reducer
export const chatReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_USER_MESSAGE:
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

    case ACTIONS.ADD_BOT_MESSAGE:
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

    case ACTIONS.APPEND_TO_BOT_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((msg, index) =>
          index === state.messages.length - 1 && msg.type === "bot"
            ? { ...msg, content: msg.content + action.payload.content }
            : msg
        ),
      };

    case ACTIONS.COMPLETE_BOT_MESSAGE:
      return {
        ...state,
        messages: state.messages.map((msg, index) =>
          index === state.messages.length - 1 && msg.type === "bot" ? { ...msg, isComplete: true } : msg
        ),
      };

    case ACTIONS.SET_STREAMING_STATE:
      return {
        ...state,
        streamingState: action.payload,
      };

    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case ACTIONS.REMOVE_LAST_BOT_MESSAGE:
      return {
        ...state,
        messages: state.messages.slice(0, -1),
      };

    default:
      return state;
  }
};

/**
 * A React hook that manages chat message interactions with a streaming API endpoint.
 * Provides functionality to send messages, receive streaming responses, and manage chat state.
 * Falls back to mock data if API is not available.
 */
export const useChat = ({ sessionId, apiUrl = null }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
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
    safeDispatch({ type: ACTIONS.SET_ERROR, payload: true });
    safeDispatch({ type: ACTIONS.SET_STREAMING_STATE, payload: StreamingState.IDLE });
  }, [safeDispatch]);

  // Mock streaming response
  const processMockStream = useCallback(
    async (content) => {
      try {
        // Simulate streaming by sending chunks
        const words = content.split(" ");
        for (let i = 0; i < words.length; i++) {
          if (!isMounted.current) break;

          await new Promise((resolve) => setTimeout(resolve, 50));
          safeDispatch({
            type: ACTIONS.APPEND_TO_BOT_MESSAGE,
            payload: { content: words[i] + (i < words.length - 1 ? " " : "") },
          });
        }
        safeDispatch({ type: ACTIONS.COMPLETE_BOT_MESSAGE });
      } catch (error) {
        handleError();
      }
    },
    [safeDispatch, handleError]
  );

  // Real streaming from API
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
            safeDispatch({ type: ACTIONS.COMPLETE_BOT_MESSAGE });
            continue;
          }

          if (data.content) {
            safeDispatch({
              type: ACTIONS.APPEND_TO_BOT_MESSAGE,
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

  const handleSendMessage = useCallback(
    async (content) => {
      if (!isMounted.current) return;

      // Reset error state
      safeDispatch({ type: ACTIONS.SET_ERROR, payload: false });

      // Set streaming state
      safeDispatch({
        type: ACTIONS.SET_STREAMING_STATE,
        payload: StreamingState.STREAMING,
      });

      // Add user message
      safeDispatch({ type: ACTIONS.ADD_USER_MESSAGE, payload: { content } });

      // Add bot message placeholder
      const botMessageId = crypto.randomUUID();
      safeDispatch({ type: ACTIONS.ADD_BOT_MESSAGE, payload: { id: botMessageId } });

      try {
        const endpoint = apiUrl || CHAT_API_URL;

        const response = await fetch(endpoint, {
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
      } catch (error) {
        // Fallback to mock data
        console.log("Using mock response:", error);
        const mockResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
        await processMockStream(mockResponse);
      } finally {
        safeDispatch({
          type: ACTIONS.SET_STREAMING_STATE,
          payload: StreamingState.IDLE,
        });
      }
    },
    [safeDispatch, sessionId, processStream, processMockStream, apiUrl]
  );

  const handleRetry = useCallback(async () => {
    safeDispatch({ type: ACTIONS.REMOVE_LAST_BOT_MESSAGE });
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
};

export const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2"
    />
  </svg>
);

export const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <g clipPath="url(#clip0_2707_47)">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m9.947 14.783-6.945-4.419 17.046-5.682-5.682 17.046zm0 0 5.05-5.05"
      />
    </g>
    <defs>
      <clipPath id="clip0_2707_47">
        <path fill="currentColor" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const CircleLogoIcon = () => (
  <svg data-testid="svg" viewBox="102 50 234 236" width="1.5em" xmlns="http://www.w3.org/2000/svg">
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
        <stop offset="0" stopColor="#b090f5" />
        <stop offset="1" stopColor="#5fbfff" />
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
        <stop offset="0" stopColor="#68d7fa" />
        <stop offset="1" stopColor="#4ee498" />
      </linearGradient>
    </defs>
    <path
      d="M319.43,110.37l-5-8.78a5.14,5.14,0,0,0-8.11-1.08L294.82,112a5.17,5.17,0,0,0-.64,6.51,90.22,90.22,0,0,1,10,20.58l0,0a90.2,90.2,0,0,1-85.45,119,89.38,89.38,0,0,1-42.26-10.49l19.45-19.46a64.41,64.41,0,0,0,80.77-88.29,5.15,5.15,0,0,0-8.29-1.41L256.76,150a5.14,5.14,0,0,0-1.37,4.82l1,4.18a38.63,38.63,0,0,1-56.75,42.39l-5.13-2.94a5.13,5.13,0,0,0-6.2.83l-47.51,47.5a5.15,5.15,0,0,0,.51,7.73l7,5.37a114.86,114.86,0,0,0,70.46,23.88A116,116,0,0,0,319.43,110.37Z"
      data-testid="icon-path"
      fill="url(#linearGradient)"
    />
    <path
      d="M289.21,75.82a114.83,114.83,0,0,0-70.46-23.89A116,116,0,0,0,118.06,225.37l5,8.77a5.16,5.16,0,0,0,8.12,1.09l11.48-11.48a5.19,5.19,0,0,0,.64-6.5,89.81,89.81,0,0,1-10-20.58l0,0a90.2,90.2,0,0,1,85.45-119A89.29,89.29,0,0,1,261,88.19l-19.46,19.45a64.39,64.39,0,0,0-87.21,60.23c0,1.07.29,5.95.38,6.79a64.76,64.76,0,0,0,6.07,21.27,5.16,5.16,0,0,0,8.3,1.41l11.64-11.65a5.15,5.15,0,0,0,1.38-4.81l-1-4.19a38.62,38.62,0,0,1,56.75-42.38l5.13,2.94a5.16,5.16,0,0,0,6.2-.83l47.5-47.5a5.16,5.16,0,0,0-.5-7.74Z"
      data-testid="icon-path"
      fill="url(#linearGradient2)"
    />
  </svg>
);

export const ArrowDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

/**
 * ChatInterface Component
 * Renders a chat interface with streaming responses and auto-scroll functionality.
 * Manages the chat UI for a given conversation session with Tailwind CSS and dark mode support.
 */
export const ChatInterface = ({ sessionId, darkMode = false, apiUrl = null }) => {
  const { handleSendMessage, messages, streamingState, error, handleRetry } = useChat({
    sessionId,
    apiUrl,
  });

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  const scrollContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const isAtBottomRef = useRef(true);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    isAtBottomRef.current = true;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle scroll to detect if at bottom
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 50;
  }, []);

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const handleSubmit = useCallback(
    (message) => {
      if (!message.trim() || streamingState !== StreamingState.IDLE) return;
      void (async () => {
        scrollToBottom();
        await handleSendMessage(message);
      })();
    },
    [handleSendMessage, scrollToBottom, streamingState]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  const isDark = darkMode;

  return (
    <>
      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className={`relative flex-1 overflow-y-auto px-6 pb-4 pt-8 pointer-events-none ${hasMessages ? "grow" : ""} ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="w-full max-w-4xl mx-auto">
          {!hasMessages && (
            <div className="mb-6 md:mb-12">
              <div className="pointer-events-auto pb-2 pt-1">
                <h1 className={`text-3xl font-medium mb-0 pb-0 pt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  How can we help you?
                </h1>
              </div>
            </div>
          )}

          {hasMessages && (
            <div className="pointer-events-auto w-full opacity-100">
              {/* Date Separator */}
              <div className="flex flex-row items-center gap-4 mb-4">
                <hr className={`flex-1 ${isDark ? "border-gray-700" : "border-gray-200"}`} />
                <div
                  className={`flex shrink-0 flex-row items-center gap-2 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <CalendarIcon />
                  <span>
                    Today{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
                <hr className={`flex-1 ${isDark ? "border-gray-700" : "border-gray-200"}`} />
              </div>

              {/* Messages List */}
              <ol className="flex w-full flex-col gap-y-4">
                {messages.map((message) =>
                  message.type === "user" ? (
                    <li key={message.id} className="flex w-full justify-end">
                      <div
                        className={`max-w-xs inline-block rounded-md px-6 py-4 ${
                          isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-base break-words">{message.content}</p>
                      </div>
                    </li>
                  ) : (
                    <li key={message.id} className="flex w-full flex-col gap-y-2">
                      <CircleLogoIcon />
                      <div className="flex flex-row items-center gap-x-6">
                        <span className={`font-bold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                          Circle AI
                        </span>
                        <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                          {message.timestamp.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className={`prose max-w-none ${isDark ? "text-gray-200" : "text-gray-900"}`}>
                        <p>{message.content}</p>
                      </div>
                      {error && message.id === messages.at(-1)?.id && (
                        <div className="mt-2">
                          <button
                            onClick={handleRetry}
                            className={`px-4 py-2 rounded-md transition-all ${
                              isDark
                                ? "bg-sky-600 text-white hover:bg-sky-700"
                                : "bg-sky-500 text-white hover:bg-sky-600"
                            }`}
                          >
                            Retry
                          </button>
                        </div>
                      )}
                    </li>
                  )
                )}
              </ol>

              {/* Scroll anchor */}
              <div ref={chatEndRef} aria-hidden="true" className="pointer-events-none h-px w-full opacity-0" />
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {!isAtBottomRef.current && hasMessages && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-full">
          <button
            onClick={handleScrollToBottom}
            className={`p-2 rounded-full shadow-md transition-all ${
              isDark ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-white text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ArrowDownIcon />
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className={`relative px-6 pb-4 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <div className="w-full max-w-4xl mx-auto">
          <div
            className={`rounded-lg shadow-md transition-all duration-200 ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <div className="px-4 pb-4 pt-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(inputRef.current?.value || "");
                  if (inputRef.current) inputRef.current.value = "";
                }}
              >
                <div className="flex flex-col gap-4">
                  <textarea
                    ref={inputRef}
                    className={`w-full border-0 outline-0 resize-none focus:ring-0 ${
                      isDark
                        ? "bg-gray-800 text-white placeholder-gray-500"
                        : "bg-white text-gray-900 placeholder-gray-400"
                    }`}
                    placeholder={hasMessages ? "Continue the conversation..." : "How can we help you?"}
                    disabled={streamingState !== StreamingState.IDLE}
                    rows={3}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={streamingState !== StreamingState.IDLE}
                      className={`rounded-md p-0 w-10 h-10 flex items-center justify-center transition-all duration-200 ${
                        streamingState !== StreamingState.IDLE
                          ? isDark
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : isDark
                          ? "bg-sky-600 text-white hover:bg-sky-700 active:scale-95"
                          : "bg-sky-500 text-white hover:bg-sky-600 active:scale-95"
                      }`}
                      aria-label="Send"
                    >
                      <SendIcon />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Disclaimer */}
          <div className={`mt-4 text-center text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <p>
              AI responses may be inaccurate. Circle is not liable for errors or outcomes. Don't share sensitive or
              confidential information.{" "}
              <a href="#" className={`underline ${isDark ? "hover:text-gray-300" : "hover:text-gray-700"}`}>
                Learn more
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Error component to display when session creation fails.
 */
export const ErrorDisplay = ({ error, isDark }) => {
  const errorMessages = {
    SESSION_CREATION_FAILED: "Failed to create chat session. Please try again.",
    UNEXPECTED_ERROR: "An unexpected error occurred. Please try again later.",
  };

  return (
    <div
      className={`p-4 rounded-md ${
        isDark ? "bg-red-900 text-red-200 border border-red-700" : "bg-red-100 text-red-700 border border-red-300"
      }`}
    >
      {errorMessages[error] || "An error occurred"}
    </div>
  );
};

/**
 * Container component that handles session creation and renders the chat interface.
 * This component creates a new chat session before rendering the chat UI.
 * Supports both real API and mock session for development.
 */
export const ChatContainer = ({ darkMode = false, sessionApiUrl = null, chatApiUrl = null }) => {
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createSession = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use provided API URL or default
        const apiUrl = sessionApiUrl || "/api/chat/session";

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to create session");
        }

        const data = await response.json();

        if (!data?.sessionId) {
          throw new Error("SESSION_CREATION_FAILED");
        }

        setSessionId(data.sessionId);
      } catch (err) {
        console.error("Error creating chat session:", err);

        // Fallback to mock session for development
        console.log("Using mock session for development");
        setSessionId(`mock-session-${Date.now()}`);

        // Optionally show error only if not using mock
        if (sessionApiUrl) {
          setError(
            err instanceof Error && err.message === "SESSION_CREATION_FAILED"
              ? "SESSION_CREATION_FAILED"
              : "UNEXPECTED_ERROR"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    void createSession();
  }, [sessionApiUrl]);

  const isDark = darkMode;

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        <div
          className={`animate-spin rounded-full h-8 w-8 ${
            isDark ? "border-b-2 border-white" : "border-b-2 border-gray-900"
          }`}
        />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay error={error} isDark={isDark} />;
  }

  if (!sessionId) {
    return null;
  }

  return (
    <div className={`flex flex-col h-full w-full ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <ChatInterface sessionId={sessionId} darkMode={darkMode} apiUrl={chatApiUrl} />
    </div>
  );
};
