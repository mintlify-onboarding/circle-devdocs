export const BuildWithKits = () => {
  return (
    <div className="border border-[#B5E1FF] dark:border-[#0073C360] bg-[#f7f8ff] dark:bg-[#0A1628] rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between px-[24px] py-[24px] lg:py-[20px] gap-[16px] mb-[40px]">
      <div className="flex-shrink-0">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-[4px] mt-0">Build fast with Kits</h2>
        <p className="text-[#4B5563] dark:text-[#9CA3AF] m-0 text-base">
          Pre-configured SDKs that handle setup, keys, and chains.
        </p>
      </div>
      <a
        href="#"
        className="border border-[#1118271A] dark:border-[#374151] bg-[#FFFFFF] dark:bg-[#1F2937] px-[24px] py-[12px] rounded-lg flex items-center justify-between w-full lg:flex-1 lg:max-w-[630px] cursor-pointer hover:border-[#0073C3] dark:hover:border-[#3B9EFF] transition-all duration-300 no-underline"
      >
        <div className="flex flex-col gap-[4px] flex-1">
          <h3 className="text-lg font-bold text-black dark:text-white mt-0 mb-0">Bridging Kit</h3>
          <p className="text-[#4B5563] dark:text-[#9CA3AF] m-0 text-sm">Connect assets and wallets across chains.</p>
        </div>
        <Icon icon="chevron-right" color="#6B6580" size={20} />
      </a>
    </div>
  );
};
