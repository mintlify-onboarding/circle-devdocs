import SDKCard from "./SDKCard";

// Example cards from the HTML
export const DeveloperControlledWalletCard = () => (
  <SDKCard
    id="developer-controlled-wallet-sdk"
    title="Developer-Controlled Wallets SDK"
    description="Server SDK for creating and managing developer-controlled wallets"
    icon="wallet"
    iconColor="orange"
    product="Wallets"
    languages="TypeScript, Python"
    links={[
      {
        label: "Node.js",
        href: "https://www.npmjs.com/package/@circle-fin/developer-controlled-wallets",
        icon: "/images/NpmBlueIcon.svg",
      },
      {
        label: "Python",
        href: "https://pypi.org/project/circle-developer-controlled-wallets/",
      },
      {
        label: "Documentation",
        href: "/sdk-explorer#server-side-sdks",
      },
    ]}
  />
);

export const ModularWalletsCard = () => (
  <SDKCard
    id="modular-wallet-sdk-client"
    title="Modular Wallets SDK"
    description="Client SDK for creating and managing modular wallets"
    icon="template"
    iconColor="blue"
    product="Modular Wallets"
    languages="JavaScript, TypeScript, Swift, Kotlin, Java"
    platforms={[
      { name: "Web", icon: "globe" },
      { name: "iOS", icon: "/images/IosIcon.svg" },
      { name: "Android", icon: "/images/AndroidIcon.svg" },
    ]}
    links={[
      {
        label: "Web",
        href: "https://www.npmjs.com/package/@circle-fin/modular-wallets-core",
        icon: "/images/NpmBlueIcon.svg",
      },
      {
        label: "iOS",
        href: "https://github.com/circlefin/modularwallets-ios-sdk",
        icon: "/images/GithubBlueIcon.svg",
      },
      {
        label: "Android",
        href: "https://github.com/circlefin/modularwallets-android-sdk",
        icon: "/images/GithubBlueIcon.svg",
      },
      {
        label: "Web documentation",
        href: "/wallets/modular/web-sdk",
      },
      {
        label: "iOS documentation",
        href: "/wallets/modular/ios-sdk",
      },
      {
        label: "Android documentation",
        href: "/wallets/modular/android-sdk",
      },
    ]}
  />
);

export const UserControlledWalletClientCard = () => (
  <SDKCard
    id="user-controlled-wallet-sdk-client"
    title="User-Controlled Wallets SDK (Client)"
    description="Client SDK for creating and managing user-controlled wallets"
    icon="wallet"
    iconColor="green"
    product="Wallets"
    languages="JavaScript, TypeScript, Kotlin, Swift"
    platforms={[
      { name: "Web", icon: "globe" },
      { name: "React", icon: "/images/ReactIcon.svg" },
      { name: "iOS", icon: "/images/IosIcon.svg" },
      { name: "Android", icon: "/images/AndroidIcon.svg" },
    ]}
    links={[
      {
        label: "Web",
        href: "https://github.com/circlefin/w3s-pw-web-sdk",
        icon: "/images/GithubBlueIcon.svg",
      },
      {
        label: "React Native",
        href: "https://github.com/circlefin/w3s-react-native-sdk",
        icon: "/images/GithubBlueIcon.svg",
      },
      {
        label: "iOS",
        href: "https://github.com/circlefin/w3s-ios-sdk",
        icon: "/images/GithubBlueIcon.svg",
      },
      {
        label: "Android",
        href: "https://github.com/circlefin/w3s-android-sdk",
        icon: "/images/GithubBlueIcon.svg",
      },
      {
        label: "Documentation",
        href: "/wallets/user-controlled/sdks",
      },
    ]}
  />
);

export const UserControlledWalletServerCard = () => (
  <SDKCard
    id="user-controlled-wallet-sdk-server"
    title="User-Controlled Wallets SDK (Server)"
    description="Server SDK for creating and managing user-controlled wallets"
    icon="wallet"
    iconColor="green"
    product="Wallets"
    languages="TypeScript, Python"
    links={[
      {
        label: "Node.js",
        href: "https://www.npmjs.com/package/@circle-fin/user-controlled-wallets",
        icon: "/images/NpmBlueIcon.svg",
      },
      {
        label: "Python",
        href: "https://pypi.org/project/circle-user-controlled-wallets/",
      },
      {
        label: "Documentation",
        href: "/sdk-explorer#server-side-sdks",
      },
    ]}
  />
);

export const ContractsCard = () => (
  <SDKCard
    id="smart-contract-platform-sdk"
    title="Contracts SDK"
    description="Server SDK for creating and managing smart contracts"
    icon="contract"
    iconColor="purple"
    product="Contracts"
    languages="TypeScript, Python"
    links={[
      {
        label: "Node.js",
        href: "https://www.npmjs.com/package/@circle-fin/smart-contract-platform",
        icon: "/images/NpmBlueIcon.svg",
      },
      {
        label: "Python",
        href: "https://pypi.org/project/circle-smart-contract-platform/",
      },
      {
        label: "Documentation",
        href: "/sdk-explorer#server-side-sdks",
      },
    ]}
  />
);

export const CCTPThirdPartyCard = () => (
  <SDKCard
    id="cctp-third-party-sdks"
    title="CCTP Third-Party SDKs"
    description="Server SDKs for integrating CCTP from third-party providers"
    icon="switch"
    iconColor="blue"
    product="CCTP"
    languages="Various"
    links={[
      {
        label: "Stableit SDK",
        href: "https://docs.stableit.com",
      },
      {
        label: "cctp-rs",
        href: "https://crates.io/crates/cctp-rs",
      },
    ]}
  />
);

export const MintPayoutsCard = () => (
  <SDKCard
    id="mint-payouts-sdk"
    title="Mint Payouts SDK"
    description="Server SDK for creating and managing crypto payouts"
    icon="library"
    iconColor="violet"
    product="Mint"
    languages="NodeJS"
    links={[
      {
        label: "Github",
        href: "https://github.com/circlefin/circle-nodejs-sdk",
        icon: "/images/GithubBlueIcon.svg",
      },
    ]}
  />
);

// All cards wrapper
export const AllSDKCards = () => (
  <div className="w-full">
    <DeveloperControlledWalletCard />
    <ModularWalletsCard />
    <UserControlledWalletClientCard />
    <UserControlledWalletServerCard />
    <ContractsCard />
    <CCTPThirdPartyCard />
    <MintPayoutsCard />
  </div>
);
