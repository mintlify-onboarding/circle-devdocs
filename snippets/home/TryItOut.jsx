export const TryItOut = () => {
  const [selectedItem, setSelectedItem] = useState(0);

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

  return (
    <div className="flex flex-row rounded-2xl bg-[#F5F7FA] dark:bg-[#1A1A1A] overflow-hidden">
      {/* Left sidebar */}
      <div className="w-[360px] p-[24px] pr-0 flex flex-col gap-[8px]">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => setSelectedItem(index)}
            className={`flex gap-[12px] p-[16px] rounded-xl cursor-pointer transition-all ${
              selectedItem === index
                ? "bg-white dark:bg-[#2A2A2A]"
                : "bg-transparent hover:bg-white/50 dark:hover:bg-[#252525]"
            }`}
          >
            <div className={`mt-[2px] flex-shrink-0 ${item.icon === "arrow-up-arrow-down" ? "rotate-45" : ""}`}>
              <Icon icon={item.icon} color="#6B7280" size={20} />
            </div>
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-[#111827] dark:text-white mb-[4px] leading-tight">
                {item.title}
              </div>
              <div className="text-[13px] text-[#6B7280] dark:text-[#9CA3AF] leading-tight">{item.subtitle}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Right code panel */}
      <div className="home_code_container flex-1 p-[24px] pl-[16px] flex flex-col">
        <div className="flex-1 rounded-xl overflow-hidden">
          <CodeBlock wrap lines language="json">
            {items[selectedItem].code}
          </CodeBlock>
        </div>
      </div>
    </div>
  );
};
