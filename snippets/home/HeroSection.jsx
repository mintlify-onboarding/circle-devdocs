export const HeroSection = () => {
  useEffect(() => {
    const header = document.querySelector("div#content-area > header#header");
    if (header) {
      header.style.display = "none";
    }

    const mdxContent = document.querySelector("div.mdx-content");
    if (mdxContent) {
      mdxContent.style.marginTop = "0";
    }
    return () => {
      const header = document.querySelector("div#content-area > header#header");
      if (header) {
        header.style.display = "";
      }

      const mdxContent = document.querySelector("div.mdx-content");
      if (mdxContent) {
        mdxContent.style.marginTop = "";
      }
    };
  }, []);

  return (
    <div className="relative w-full flex items-center justify-between mt-0">
      <div>
        <h1 className="text-5xl font-bold text-black dark:text-white mb-[16px]">Circle developers</h1>
        <p className="mb-[24px] text-[#4B5563] dark:text-[#9CA3AF]">Bridge chains. Move money. Develop faster.</p>
        <div className="flex gap-[16px] mt-4">
          <a className="cursor-pointer border border-[#0073C380] dark:border-[#0073C360] text-[#0073C3] dark:text-[#3B9EFF] h-[40px] px-4 rounded-md inline-flex items-center gap-2 hover:bg-[#0073C31A] dark:hover:bg-[#0073C320] transition-all duration-300">
            <Icon icon="server" color="#0073C3" size={24} />
            Build with MCP Server
          </a>
          <a
            href="https://developers.circle.com/ai-codegen"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer border border-[#0073C380] dark:border-[#0073C360] text-[#0073C3] dark:text-[#3B9EFF] h-[40px] px-4 rounded-md inline-flex items-center gap-2 hover:bg-[#0073C31A] dark:hover:bg-[#0073C320] transition-all duration-300"
          >
            <Icon icon="sparkles" color="#0073C3" size={24} />
            Code with AI
          </a>
        </div>
      </div>

      <div className="hidden md:block">
        <img src="images/home/hero.svg" noZoom alt="hero image my-0" />
      </div>
    </div>
  );
};
