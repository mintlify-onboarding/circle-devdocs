import { ChatInterface } from "/snippets/chat-example/ChatInterface.jsx";

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
