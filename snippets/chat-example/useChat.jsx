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
