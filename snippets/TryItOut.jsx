export const TryItOut = ({ title = "Initialize User", fields = [], apiEndpoint, description }) => {
  const [formData, setFormData] = useState(() => {
    const initial = {};
    fields.forEach((field) => {
      initial[field.name] = field.defaultValue || "";
    });
    return initial;
  });
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleExecute = async () => {
    if (!apiEndpoint) {
      console.log("Form data:", formData);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(apiEndpoint.url, {
        method: apiEndpoint.method || "POST",
        headers: {
          "Content-Type": "application/json",
          ...apiEndpoint.headers?.(formData),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A9FE8] dark:bg-[#1A9FE8] px-6 py-4 flex justify-between items-center">
        <h3 className="text-white text-lg font-semibold m-0">Try it out: {title}</h3>
        <button
          onClick={handleExecute}
          disabled={isLoading}
          className="bg-white/20 hover:bg-white/30 text-white font-semibold px-6 py-2 rounded-md transition-colors border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Loading..." : "Execute"}
        </button>
      </div>

      {/* Form Fields */}
      <div className="p-6 bg-white dark:bg-zinc-900 space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">{field.label}</label>
            <input
              type={field.type || "text"}
              value={formData[field.name]}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
            />
            {field.helpLink && (
              <a
                href={field.helpLink.href}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
              >
                {field.helpLink.text}
              </a>
            )}
          </div>
        ))}

        {/* Description */}
        {description && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <h4 className="text-sm font-semibold mb-3 text-gray-900 dark:text-white">Response:</h4>
            <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-4 max-h-[400px] overflow-auto">
              <pre className="m-0 text-xs font-mono whitespace-pre-wrap break-words text-gray-900 dark:text-zinc-100">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
