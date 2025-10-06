import { Icon } from "@mintlify/components";

export const SDKCard = ({
  id,
  title,
  description,
  icon,
  iconName,
  iconColor,
  product,
  textForProduct,
  languages,
  textForLanguages,
  platforms,
  links,
  relevantLinks,
  anchor,
}) => {
  // Normalize props - support both naming conventions
  const finalIcon = iconName || icon;
  const finalIconColor = iconColor || "blue";
  const finalProduct = textForProduct || product;
  const finalLanguages = textForLanguages || languages;
  const finalLinks = relevantLinks || links || [];
  const finalPlatforms = platforms || [];
  const WalletIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 25 24"
      className="pointer-events-none"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3.676 6.647c0-.437.186-.856.517-1.165A1.83 1.83 0 0 1 5.441 5h11.47c.469 0 .918.174 1.249.482.33.31.517.728.517 1.165v.824m-15-.824v11.706c0 .437.185.856.516 1.165.331.308.78.482 1.248.482H19.56a1.83 1.83 0 0 0 1.248-.482c.33-.31.517-.728.517-1.165v-1.824M3.675 6.647c0 .437.186.856.517 1.165s.78.482 1.248.482H19.56c.468 0 .917.174 1.248.483.33.308.517.727.517 1.164v1.824M17.5 16h4.3a.7.7 0 0 0 .7-.7v-2.6a.7.7 0 0 0-.7-.7h-4.3a2 2 0 1 0 0 4"
      />
    </svg>
  );

  const TemplateIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="pointer-events-none"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path strokeMiterlimit="10" strokeWidth="2" d="M4 8v11c0 1.1.9 2 2 2h10" />
      <path
        strokeMiterlimit="10"
        strokeWidth="2"
        d="m19.7 7.4-4.6-4.2c-.2-.1-.4-.2-.6-.2H9.7C8.8 3 8 3.7 8 4.6v10.9c0 .8.8 1.5 1.7 1.5h8.6c.9 0 1.7-.7 1.7-1.6V8q0-.3-.3-.6Z"
      />
      <path strokeMiterlimit="10" strokeWidth="2" d="M15 3.1v4.4c0 .3.2.5.5.5H20M17.1 7.5l-1.2-2.2" />
    </svg>
  );

  const ContractIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="pointer-events-none"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m10.5 15-2-2 2-2m3 4 2-2-2-2M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2"
      />
    </svg>
  );

  const SwitchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="pointer-events-none"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 7h12m0 0-4-4m4 4-4 4m0 6H4m0 0 4 4m-4-4 4-4"
      />
    </svg>
  );

  const LibraryIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="pointer-events-none"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4z"
      />
    </svg>
  );

  const BeakerIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      className="pointer-events-none"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082m-.75-.082A24.3 24.3 0 0 0 4.5 9.75m14.25-6.646a24.3 24.3 0 0 1-14.25 6.646m14.25-6.646V8.25a2.25 2.25 0 0 1-.659 1.591L19 14.5M14.25 3.104c-.251.023-.501.05-.75.082m.75-.082a24.3 24.3 0 0 0 5.25 6.646M19 14.5l-4.09 4.09a1.125 1.125 0 0 1-1.59 0L5 10.277m14 4.223V18a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-3.723"
      />
    </svg>
  );

  const iconColorStyles = {
    orange: {
      light: { backgroundColor: "#fff7ed", color: "#ea580c" },
      dark: { backgroundColor: "#431407", color: "#fb923c" },
    },
    blue: {
      light: { backgroundColor: "#eff6ff", color: "#2563eb" },
      dark: { backgroundColor: "#1e3a8a", color: "#60a5fa" },
    },
    green: {
      light: { backgroundColor: "#f0fdf4", color: "#16a34a" },
      dark: { backgroundColor: "#14532d", color: "#4ade80" },
    },
    purple: {
      light: { backgroundColor: "#faf5ff", color: "#9333ea" },
      dark: { backgroundColor: "#581c87", color: "#c084fc" },
    },
    violet: {
      light: { backgroundColor: "#f5f3ff", color: "#7c3aed" },
      dark: { backgroundColor: "#4c1d95", color: "#a78bfa" },
    },
    pink: {
      light: { backgroundColor: "#fdf2f8", color: "#ec4899" },
      dark: { backgroundColor: "#831843", color: "#f9a8d4" },
    },
    red: {
      light: { backgroundColor: "#fef2f2", color: "#dc2626" },
      dark: { backgroundColor: "#7f1d1d", color: "#f87171" },
    },
    "accent-orange": {
      light: { backgroundColor: "#fff7ed", color: "#ea580c" },
      dark: { backgroundColor: "#431407", color: "#fb923c" },
    },
    "accent-blue": {
      light: { backgroundColor: "#eff6ff", color: "#2563eb" },
      dark: { backgroundColor: "#1e3a8a", color: "#60a5fa" },
    },
    "accent-green": {
      light: { backgroundColor: "#f0fdf4", color: "#16a34a" },
      dark: { backgroundColor: "#14532d", color: "#4ade80" },
    },
    "accent-purple": {
      light: { backgroundColor: "#faf5ff", color: "#9333ea" },
      dark: { backgroundColor: "#581c87", color: "#c084fc" },
    },
    "accent-violet": {
      light: { backgroundColor: "#f5f3ff", color: "#7c3aed" },
      dark: { backgroundColor: "#4c1d95", color: "#a78bfa" },
    },
    "accent-pink": {
      light: { backgroundColor: "#fdf2f8", color: "#ec4899" },
      dark: { backgroundColor: "#831843", color: "#f9a8d4" },
    },
    error: {
      light: { backgroundColor: "#fef2f2", color: "#dc2626" },
      dark: { backgroundColor: "#7f1d1d", color: "#f87171" },
    },
  };

  const iconColorClasses = {
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    violet: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  };

  const iconComponents = {
    wallet: <WalletIcon />,
    WalletOutline: <WalletIcon />,
    template: <TemplateIcon />,
    TemplateOutline: <TemplateIcon />,
    contract: <ContractIcon />,
    ContractOutline: <ContractIcon />,
    switch: <SwitchIcon />,
    SwitchHorizontalOutline: <SwitchIcon />,
    library: <LibraryIcon />,
    LibraryOutline: <LibraryIcon />,
    beaker: <BeakerIcon />,
    BeakerOutline: <BeakerIcon />,
  };

  const selectedIcon = iconComponents[finalIcon] || finalIcon;

  return (
    <>
      <style>{`
        .icon-circle-${finalIconColor} {
          background-color: ${iconColorStyles[finalIconColor]?.light.backgroundColor};
          color: ${iconColorStyles[finalIconColor]?.light.color};
        }
        .dark .icon-circle-${finalIconColor} {
          background-color: ${iconColorStyles[finalIconColor]?.dark.backgroundColor};
          color: ${iconColorStyles[finalIconColor]?.dark.color};
        }
      `}</style>
      <div
        className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm mt-4"
        data-testid="sdk-sample-card"
        id={anchor || id}
      >
        {/* Header Section */}
        <div className="mb-4">
          <div className="flex flex-row items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 icon-circle-${finalIconColor}`}>
              {selectedIcon}
            </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="flex flex-wrap gap-6 mb-4">
        {/* Product */}
        {finalProduct && (
          <div data-testid="sdk-sample-card-product">
            <div data-testid="card-detail">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Product
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">{finalProduct}</div>
            </div>
          </div>
        )}

        {/* Languages */}
        {finalLanguages && (
          <div data-testid="sdk-sample-card-languages">
            <div data-testid="card-detail">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Languages
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">{finalLanguages}</div>
            </div>
          </div>
        )}

        {/* Platforms (Optional) */}
        {finalPlatforms && finalPlatforms.length > 0 && (
          <div data-testid="sdk-sample-card-platforms">
            <div data-testid="card-detail">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Platforms
              </h3>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <div className="flex flex-wrap items-center gap-3 font-semibold">
                  {finalPlatforms.map((platform, index) => {
                    const platformName = typeof platform === "string" ? platform : platform.name;
                    let platformIcon = typeof platform === "string" ? null : platform.icon;

                    // Auto-detect icon based on platform name if not provided
                    if (!platformIcon) {
                      const lowerName = platformName.toLowerCase();
                      if (lowerName.includes("react")) {
                        platformIcon = "react";
                      } else if (lowerName.includes("web")) {
                        platformIcon = "globe";
                      } else if (lowerName.includes("android")) {
                        platformIcon = "android";
                      } else if (lowerName.includes("ios")) {
                        platformIcon = "apple";
                      }
                    }

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-1 shrink-0"
                        data-testid="sdk-sample-card-platform-item"
                      >
                        {platformIcon &&
                          (platformIcon.endsWith(".svg") ? (
                            <img
                              alt={platformName}
                              loading="lazy"
                              width="20"
                              height="20"
                              decoding="async"
                              src={platformIcon}
                              className="shrink-0"
                            />
                          ) : (
                            <Icon icon={platformIcon} className="w-5 h-5 shrink-0" />
                          ))}
                        {platformName}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Links Section */}
      <div className="flex flex-wrap gap-2" data-testid="sdk-sample-card-relevant-links">
        {finalLinks.map((link, index) => (
          <a
            key={index}
            data-testid="sdk-sample-card-relevant-link"
            href={link.url || link.href}
            rel="noreferrer noopener nofollow"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium no-underline border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200"
          >
            {link.icon && <Icon icon={link.icon} className="w-5 h-5 shrink-0" />}
            {link.type === "github" && <Icon icon="github" className="w-5 h-5 shrink-0" />}
            {link.label}
          </a>
        ))}
      </div>
    </div>
    </>
  );
};
