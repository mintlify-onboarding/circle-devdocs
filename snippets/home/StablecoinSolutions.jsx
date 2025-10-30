export const StablecoinSolutions = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  const cards = [
    {
      icon: "wallet",
      iconColor: "#9F72FF",
      iconBgColor: "#F6F2FF",
      iconBgColorDark: "#2D1B4E",
      iconSize: 24,
      title: "Integrate USDC into your app",
      description: "Embed USDC payments and wallets directly in your app.",
      linkText: "Wallets",
      linkHref: "/stablecoins/what-is-usdc",
    },
    {
      icon: "arrow-up-arrow-down",
      iconColor: "#1894E8",
      iconBgColor: "#E1F2FF",
      iconBgColorDark: "#0A2540",
      iconSize: 20,
      rotate: true,
      title: "Bridge between blockchains",
      description: "Transfer USDC seamlessly across chains with CCTP.",
      linkText: "CCTP",
      linkHref: "/cctp",
    },
    {
      icon: "coin-blank",
      iconColor: "#0B9C4A",
      iconBgColor: "#E2FDF2",
      iconBgColorDark: "#0A2E1A",
      iconSize: 24,
      title: "Integrate currency trading",
      description: "Enable currency trading in your app with our APIs.",
      linkText: "StableFX",
      linkHref: "/wallets/user-controlled/receive-inbound-transfer",
    },
  ];

  return (
    <Columns cols={3}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="border border-[#1118271A] dark:border-[#374151] rounded-xl p-[24px] flex flex-col hover:border-[#0073C3] dark:hover:border-[#3B9EFF] select-none transition-all duration-300 h-full"
        >
          <span
            className={`${
              card.rotate
                ? "inline-flex items-center justify-center w-[56px] h-[56px] rounded-full rotate-45 transition-colors flex-shrink-0 mb-[16px]"
                : "inline-flex items-center justify-center w-[56px] h-[56px] rounded-full transition-colors flex-shrink-0 mb-[16px]"
            }`}
            style={{
              backgroundColor: `light-dark(${card.iconBgColor}, ${card.iconBgColorDark})`,
            }}
          >
            <Icon icon={card.icon} color={card.iconColor} size={card.iconSize} />
          </span>
          <h3 className="text-lg font-bold text-[#29233B] dark:text-white mt-0 mb-[16px]">{card.title}</h3>
          <p className="text-[#6B6580] dark:text-[#9CA3AF] m-0 mb-[16px] flex-grow">{card.description}</p>
          <a
            href={card.linkHref}
            className="cursor-pointer text-[#0073C3] dark:!text-[#0073C3] font-bold w-fit no-underline hover:underline border-b-0 mt-auto"
          >
            {card.linkText}
          </a>
        </div>
      ))}
    </Columns>
  );
};
