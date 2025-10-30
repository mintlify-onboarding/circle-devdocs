export const BuildWithKits = () => {
  return (
    <div className="border border-[#B5E1FF] dark:border-[#0073C360] bg-[#f7f8ff] dark:bg-[#0A1628] rounded-2xl flex flex-col lg:flex-row items-start lg:items-stretch justify-between px-[24px] py-[16px] lg:py-[16px] gap-[16px] mt-[20px] mb-[40px]">
      <div className="max-w-[360px]">
        <h2 className="text-xl font-medium text-[#29233B] dark:text-white mb-[4px] mt-0">Accelerate with kits</h2>
        <p className="text-[#6B6580] dark:text-[#9CA3AF] m-0 text-base tracking-[-0.312px] flex">
          The fastest way to build with Circle — a ready-to-use toolkit that makes building onchain simple.
        </p>
      </div>
      <a
        href="#"
        className="border border-[#1118271A] dark:border-[#374151] bg-[#FFFFFF] dark:bg-[#1F2937] px-[24px] py-[12px] rounded-lg flex items-center justify-between w-full lg:flex-1 lg:max-w-[630px] cursor-pointer hover:border-[#0073C3] dark:hover:border-[#3B9EFF] transition-all duration-300 no-underline"
      >
        <div className="flex flex-col gap-[4px] flex-1 justify-center">
          <h3 className="text-[16px] font-bold text-[#29233B] dark:text-white mt-0 mb-0">Stablecoin Kit</h3>
          <p className="flex text-[#6B6580] dark:text-[#9CA3AF] m-0 text-sm font-normal">Coming Soon</p>
        </div>
      </a>
      <a
        href="#"
        className="border border-[#1118271A] dark:border-[#374151] bg-[#FFFFFF] dark:bg-[#1F2937] px-[24px] py-[12px] rounded-lg flex items-center justify-between w-full lg:flex-1 lg:max-w-[630px] cursor-pointer hover:border-[#0073C3] dark:hover:border-[#3B9EFF] transition-all duration-300 no-underline relative"
      >
        <div className="flex flex-col gap-[4px] flex-1 justify-center">
          <h3 className="text-[16px] font-bold text-[#29233B] dark:text-white mt-0 mb-0">Bridging Kit</h3>
          <p className="flex text-[#6B6580] dark:text-[#9CA3AF] m-0 text-sm font-normal">
            Everything you need to bridge.
          </p>
        </div>
        <div className="absolute right-[10px]">
          <Icon icon="chevron-right" color="#6B6580" size={20} />
        </div>
      </a>
    </div>
  );
};
