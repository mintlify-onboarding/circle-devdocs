import React, { useState } from "react";

export const InitializeUser = () => {
  const [apiKey, setApiKey] = useState("");
  const [userId, setUserId] = useState("");
  const [blockchain, setBlockchain] = useState("ETH-SEPOLIA");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Clear previous error
    setError("");

    // Validate API key
    if (!apiKey.trim()) {
      setError("This field is required.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://api.stytch.com/v1/users/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          user_id: userId || undefined,
          blockchain: blockchain,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setApiKey("");
    setUserId("");
    setBlockchain("ETH-SEPOLIA");
    setResponse(null);
    setError("");
  };

  return (
    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6 bg-white dark:bg-zinc-900">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-zinc-100 my-0 mb-4">Initialize User</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="border-r-0 lg:border-r border-gray-200 dark:border-zinc-800 pr-0 lg:pr-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 my-0">Input</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">* = required</span>
          </div>

          {/* API Key Field */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">API key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError("");
              }}
              placeholder="e.g. TEST_API_KEY"
              className={`w-full px-3 py-2.5 rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                error ? "border-2 border-red-500 dark:border-red-400" : "border border-gray-300 dark:border-zinc-700"
              }`}
            />
            {error && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-500 dark:text-red-400 text-sm">
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 dark:bg-red-400 text-white text-xs font-bold">
                  !
                </span>
                {error}
              </div>
            )}
          </div>

          {/* UserId Field */}
          <div className="mb-2">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">UserId</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-zinc-700 rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
          </div>

          {/* Blockchains Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Blockchains</label>
            <div className="relative">
              <select
                value={blockchain}
                onChange={(e) => setBlockchain(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 border border-gray-300 dark:border-zinc-700 rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 appearance-none"
              >
                <option value="ETH-SEPOLIA">ETH-SEPOLIA</option>
                <option value="MATIC-AMOY">MATIC-AMOY</option>
                <option value="SOL-DEVNET">SOL-DEVNET</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Clear Form Button */}
          <button
            onClick={handleClearForm}
            className="inline-flex items-center gap-1.5 text-base font-semibold text-blue-600 dark:text-blue-400 bg-transparent border-none cursor-pointer p-0 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Clear Form <Icon icon="circle-xmark" />
          </button>
        </div>

        {/* Response Section */}
        <div>
          <h3 className="text-xl font-semibold mb-2 mt-0 text-gray-900 dark:text-zinc-100">Response</h3>
          <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md p-4 min-h-[300px] max-h-[500px] overflow-auto relative">
            {response ? (
              <>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify(response, null, 2))}
                  className="absolute top-3 right-3 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded px-2.5 py-1.5 cursor-pointer text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
                  title="Copy to clipboard"
                >
                  📋
                </button>
                <pre className="m-0 text-xs font-mono whitespace-pre-wrap break-words text-gray-900 dark:text-zinc-100">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </>
            ) : (
              <div className="text-gray-400 dark:text-gray-500 text-sm flex items-center justify-center h-full">
                Response will appear here...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Try it out Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-[#0073C3] dark:bg-[#0073C3] text-white border-none rounded-md px-8 py-3 text-base font-semibold cursor-pointer inline-flex items-center gap-2 hover:bg-cyan-700 dark:hover:bg-cyan-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? "Loading..." : "Try it out"} →
        </button>
      </div>
    </div>
  );
};
