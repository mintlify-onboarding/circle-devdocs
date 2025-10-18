export const ApiReferenceBackground = () => {
  return (
    <div className="relative w-full min-h-[400px] md:min-h-[500px] flex flex-col md:flex-row md:items-start">
      {/* Left side - Text content */}
      <div className="flex-1 max-w-[600px] py-8 md:pr-8 relative z-10">
        <p className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-300 m-0">
          Overview of Circle's RESTful APIs and endpoints. Our API References include a Playground as a safe interactive
          space to test out API requests in various languages and check their responses in real time. Log in to your
          Circle Developer Console account and add your API key to start managing your Circle Developer resources in
          testnet.
        </p>
      </div>

      {/* Right side - Background image */}
      <div className="relative md:absolute md:top-0 md:right-0 w-full md:h-full pointer-events-none overflow-visible flex justify-center md:justify-end mt-4 md:mt-0">
        <img
          src="/images/api_bg.webp"
          alt=""
          className="relative md:absolute md:top-0 md:right-[-50px] lg:right-[-100px] w-full max-w-[250px] md:max-w-[450px] h-auto object-contain"
        />
      </div>
    </div>
  );
};
