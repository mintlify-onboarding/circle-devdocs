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
          parts.push({ text: line.substring(keyStart, i), color: "#BB1DCA" });
          continue;
        }
      }

      // Check for numbers
      if (/\d/.test(line[i])) {
        const numStart = i;
        while (i < line.length && /[\d.]/.test(line[i])) i++;
        parts.push({ text: line.substring(numStart, i), color: "#BB1DCA" });
        continue;
      }

      // Everything else (brackets, commas, spaces, etc.)
      const otherStart = i;
      while (i < line.length && line[i] !== '"' && !/\d/.test(line[i])) i++;
      if (i > otherStart) {
        parts.push({ text: line.substring(otherStart, i), color: "#000000" });
      }
    }

    return parts.length > 0 ? parts : [{ text: line, color: "#000000" }];
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
    <div
      className="rounded-2xl overflow-hidden flex flex-col lg:flex-row min-h-[280px]"
      style={{ background: "linear-gradient(88.57deg, rgba(241, 235, 255, 0.5) 0%, rgba(225, 242, 255, 0.5) 94.58%)" }}
    >
      {/* Left side - Menu items */}
      <div className="flex flex-col gap-[4px] lg:w-[454px] p-[24px]">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedItem(index)}
            className={`flex items-start gap-[12px] p-[16px] rounded-lg cursor-pointer transition-all  ${
              selectedItem === index ? "bg-white" : "hover:bg-[#F9F9FC]"
            }`}
          >
            {/* item.icon == arrow-up-arrow-down rotate-45 */}
            <div className={`mt-[2px] flex-shrink-0 ${item.icon === "arrow-up-arrow-down" ? "rotate-45" : ""}`}>
              <Icon icon={item.icon} color="#6B7280" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-[2px] text-[#111827] m-0">{item.title}</h3>
              <p className="text-xs text-[#6B7280] m-0">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right side - Code block with line numbers */}
      <div className="flex-1 flex flex-col p-[24px] pl-0 self-stretch max-h-[378px] max-w-[630px]">
        <div
          className="flex-1 flex rounded-lg border border-[#1118271A] p-[12px] h-full relative"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          {/* Copy button */}
          <button
            onClick={handleCopy}
            className={`absolute top-[24px] right-[24px] z-10 p-[4px] hover:opacity-70 transition-opacity ${
              copied ? "" : "rotate-90"
            }`}
            title={copied ? "copied!" : "copy code"}
          >
            <Icon
              icon={copied ? "check" : "clone"}
              color={copied ? "#10B981" : "#6B6580"}
              size={20}
              iconType="duotone"
            />
          </button>

          <div className="flex-1 flex rounded-md overflow-auto" style={{ backgroundColor: "#F9F9FC" }}>
            <div className="flex min-w-max">
              {/* Line numbers */}
              <div
                className="px-[16px] py-[16px] pr-0 border-[#1118271A] select-none sticky left-0 z-10"
                style={{ backgroundColor: "#F9F9FC" }}
              >
                {codeLines.map((_, index) => (
                  <div
                    key={index}
                    className="text-sm font-mono text-right min-w-[20px]"
                    style={{ backgroundColor: "#F9F9FC", lineHeight: "21px", height: "21px", color: "#9CA3AF" }}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code content */}
              <div className="px-[16px] py-[16px]" style={{ backgroundColor: "#F9F9FC" }}>
                <pre className="text-sm font-mono m-0" style={{ backgroundColor: "#F9F9FC", lineHeight: "21px" }}>
                  {codeLines.map((line, index) => (
                    <div key={index} style={{ lineHeight: "21px", height: "21px" }}>
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
