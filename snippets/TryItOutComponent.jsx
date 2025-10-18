export const TryItOutComponent = () => {
  const [selectedItem, setSelectedItem] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(items[selectedItem].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to tokenize and highlight JSON syntax
  const tokenizeJSON = (line) => {
    const parts = [];
    let i = 0;

    while (i < line.length) {
      // Check if we're at a key (property name)
      if (line[i] === '"') {
        const keyStart = i;
        i++; // skip opening quote
        while (i < line.length && line[i] !== '"') i++;
        i++; // skip closing quote

        // Check if this is a key (followed by colon)
        if (i < line.length && line[i] === ":") {
          parts.push({ text: line.substring(keyStart, i + 1), color: "#0073C3" });
          i++;
          continue;
        } else {
          // It's a string value
          parts.push({ text: line.substring(keyStart, i), color: "#C41E8C" });
          continue;
        }
      }

      // Check for numbers
      if (/\d/.test(line[i])) {
        const numStart = i;
        while (i < line.length && /[\d.]/.test(line[i])) i++;
        parts.push({ text: line.substring(numStart, i), color: "#C41E8C" });
        continue;
      }

      // Everything else (brackets, commas, spaces, etc.)
      const otherStart = i;
      while (i < line.length && line[i] !== '"' && !/\d/.test(line[i])) i++;
      if (i > otherStart) {
        parts.push({ text: line.substring(otherStart, i), color: "#1F2937" });
      }
    }

    return parts.length > 0 ? parts : [{ text: line, color: "#1F2937" }];
  };

  const items = [
    {
      icon: "arrows-maximize",
      title: "Get supported tokens and chains",
      subtitle: "Gateway APIs",
      code: `{
  "newRoyaltyRecipient": "0xb794f5ea0ba39494ce839613fffba74279579268",
  "newRoyaltyBps": "250",
  "newRoyaltyRecipient2": "0xb794f5ea0ba39494ce839613fffba74279579269",
  "newRoyaltyBps2": "251"
}`,
    },
    {
      icon: "arrow-up-arrow-down",
      title: "Transfer fees between chains",
      subtitle: "Using CCTP",
      code: `{
  "newRoyaltyRecipient": "0xb794f5ea0ba39494ce839613fffba74279579268",
  "newRoyaltyBps": "250",
  "newRoyaltyRecipient2": "0xb794f5ea0ba39494ce839613fffba74279579269",
  "newRoyaltyBps2": "251"
}`,
    },
    {
      icon: "arrows-rotate-reverse",
      title: "Get a testnet token",
      subtitle: "With the API Faucet",
      code: `{
  "newRoyaltyRecipient": "0xb794f5ea0ba39494ce839613fffba74279579268",
  "newRoyaltyBps": "250",
  "newRoyaltyRecipient2": "0xb794f5ea0ba39494ce839613fffba74279579269",
  "newRoyaltyBps2": "251"
}`,
    },
    {
      icon: "droplet",
      title: "Fetch an exchange rate",
      subtitle: "Using Circle Mint",
      code: `{
  "newRoyaltyRecipient": "0xb794f5ea0ba39494ce839613fffba74279579268",
  "newRoyaltyBps": "250",
  "newRoyaltyRecipient2": "0xb794f5ea0ba39494ce839613fffba74279579269",
  "newRoyaltyBps2": "251"
}`,
    },
  ];

  const codeLines = items[selectedItem].code.split("\n");

  return (
    <div className="TryItOutComponent rounded-2xl overflow-hidden flex flex-col lg:flex-row min-h-[400px] bg-[#F5F5F7] dark:bg-[#1A1A1A]">
      {/* Left side - Menu items */}
      <div className="flex flex-col gap-[8px] lg:w-[340px] p-[24px]">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedItem(index)}
            className={`flex items-start gap-[12px] p-[16px] rounded-lg cursor-pointer transition-all ${
              selectedItem === index
                ? "bg-white dark:bg-[#2A2A2A] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                : "hover:bg-white/50 dark:hover:bg-[#252525]"
            }`}
          >
            <div className={`mt-[2px] flex-shrink-0 ${item.icon === "arrow-up-arrow-down" ? "rotate-45" : ""}`}>
              <Icon icon={item.icon} color="#6B7280" size={20} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold mb-[4px] text-[#111827] dark:text-white m-0 leading-tight">
                {item.title}
              </h3>
              <p className="text-[13px] text-[#6B7280] dark:text-[#9CA3AF] m-0 leading-tight">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right side - Code block with line numbers */}
      <div className="flex-1 flex flex-col p-[24px] pl-[16px] self-stretch">
        <div className="flex-1 flex rounded-lg border border-[#E5E5E7] dark:border-[#3A3A3A] overflow-hidden h-full relative bg-white dark:bg-[#1F1F1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="absolute top-[16px] right-[16px] z-10 p-[6px] hover:bg-[#F5F5F7] dark:hover:bg-[#2A2A2A] rounded-md transition-all"
            title={copied ? "Copied!" : "Copy code"}
          >
            <Icon
              icon={copied ? "check" : "clone"}
              color={copied ? "#10B981" : "#6B7280"}
              size={18}
              iconType="duotone"
            />
          </button>

          <div className="code-container flex-1 flex overflow-auto bg-white dark:bg-[#1F1F1F]">
            <div className="flex min-w-max w-full">
              {/* Line numbers */}
              <div className="pl-[20px] pr-[12px] py-[16px] select-none sticky left-0 z-10 bg-white dark:bg-[#1F1F1F]">
                {codeLines.map((_, index) => (
                  <div
                    key={index}
                    className="text-[13px] font-mono text-right min-w-[20px] text-[#9CA3AF] dark:text-[#6B7280]"
                    style={{ lineHeight: "22px", height: "22px" }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code content */}
              <div className="pr-[20px] pl-[12px] py-[16px] flex-1 !bg-white dark:!bg-[#1F1F1F]">
                <pre className="text-[13px] font-mono m-0 text-[#1F2937] dark:text-[#E5E7EB] !bg-transparent" style={{ lineHeight: "22px", backgroundColor: "transparent !important" }}>
                  {codeLines.map((line, index) => (
                    <div key={index} style={{ lineHeight: "22px", height: "22px" }}>
                      {tokenizeJSON(line).map((part, partIndex) => (
                        <span key={partIndex} style={{ color: part.color }}>
                          {part.text}
                        </span>
                      ))}
                    </div>
                  ))}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
