import type { FeatureFlags } from '@features/flags.graphql'
import type {
  NavigationItem,
  NavigationSection,
} from '@features/navigation.components/Navigation/types'

export const getNavigation: GetNavigationProps = ({ featureFlags }) => [
  {
    label: 'Stablecoins',
    items: [
      {
        label: 'USDC',
        url: '/stablecoins/what-is-usdc',
        children: [
          { label: 'What is USDC?', url: '/stablecoins/what-is-usdc' },
          {
            label: 'USDC Contract Addresses',
            url: '/stablecoins/usdc-contract-addresses',
          },
          {
            label: 'Quickstarts',
            isCollapsible: true,
            children: [
              {
                label: 'Transfer USDC on EVM chains',
                url: '/stablecoins/quickstart-transfer-10-usdc-on-chain',
              },
              {
                label: 'Transfer USDC on Aptos',
                url: '/stablecoins/quickstart-setup-transfer-usdc-aptos',
              },
              {
                label: 'Transfer USDC on HyperEVM',
                url: '/stablecoins/quickstart-setup-transfer-usdc-hyperevm',
              },
              {
                label: 'Transfer USDC on Ink',
                url: '/stablecoins/quickstart-setup-transfer-usdc-ink',
              },
              {
                label: 'Transfer USDC on Plume',
                url: '/stablecoins/quickstart-setup-transfer-usdc-plume',
              },
              {
                label: 'Transfer USDC on Sei',
                url: '/stablecoins/quickstart-setup-transfer-usdc-sei',
              },
              {
                label: 'Transfer USDC on Solana',
                url: '/stablecoins/quickstart-transfer-10-usdc-on-solana',
              },
              {
                label: 'Transfer USDC on Sonic',
                url: '/stablecoins/quickstart-setup-transfer-usdc-sonic',
              },
              {
                label: 'Transfer USDC on Sui',
                url: '/stablecoins/quickstart-setup-transfer-usdc-sui',
              },
              {
                label: 'Transfer USDC on XDC',
                url: '/stablecoins/quickstart-setup-transfer-usdc-xdc',
              },
              {
                label: 'Set up a USDC trustline on XRPL',
                url: '/stablecoins/quickstart-setup-usdc-trustline-xrpl',
              },
            ],
          },
          { label: 'Glossary', url: '/stablecoins/glossary' },
        ],
      },
      {
        label: 'EURC',
        url: '/stablecoins/what-is-eurc',
        children: [
          { label: 'What is EURC?', url: '/stablecoins/what-is-eurc' },
          {
            label: 'EURC Contract Addresses',
            url: '/stablecoins/eurc-contract-addresses',
          },
          {
            label: 'Quickstart: Transfer EURC on EVM chains',
            url: '/stablecoins/quickstart-transfer-10-eurc-on-chain',
          },
        ],
      },
    ],
  },
  {
    label: 'Tokenized Funds',
    items: [
      {
        label: 'USYC',
        url: '/tokenized/usyc/overview',
        children: [
          {
            label: 'Overview',
            url: '/tokenized/usyc/overview',
          },
          {
            label: 'Quickstart: Subscribe and Redeem USYC',
            url: '/tokenized/usyc/subscribe-and-redeem',
          },
          {
            label: 'Smart Contract Addresses',
            url: '/tokenized/usyc/smart-contracts',
          },
          {
            label: 'Web2 API Endpoints',
            url: '/tokenized/usyc/web2-apis',
          },
        ],
      },
    ],
  },
  {
    label: 'Circle Payments Network',
    items: [
      {
        label: 'CPN',
        url: '/cpn',
        children: [
          {
            label: 'CPN Overview',
            url: '/cpn',
          },
          {
            label: 'Concepts',
            items: [
              {
                label: 'Integration Concepts',
                url: '/cpn/concepts/integration-concepts',
              },
              {
                label: 'Block Confirmation and Transaction Finality',
                url: '/cpn/concepts/block-confirmation-and-finality',
              },
            ],
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Integrate with CPN as an OFI',
                url: '/cpn/quickstarts/integrate-with-cpn-ofi',
              },
            ],
          },
          {
            label: 'How-tos',
            items: [
              {
                label: 'Set up Webhook Notifications',
                url: '/cpn/howtos/setup-webhook-notifications',
              },
              {
                label: 'Verify Webhook Signatures',
                url: '/cpn/howtos/verify-webhook-signatures',
              },
              {
                label: 'Request Payment Configurations and Routes',
                url: '/cpn/howtos/request-payment-config',
              },
              {
                label: 'Integrate with JSON Schema',
                url: '/cpn/howtos/integrate-with-json-schema',
              },
              {
                label: 'Encrypt Travel Rule and Beneficiary Data',
                url: '/cpn/howtos/encrypt-travel-rule-beneficiary-data',
              },
              {
                label: 'Create an Onchain Transaction',
                url: '/cpn/howtos/create-an-onchain-txn',
              },
              {
                label: 'Encrypt Files for RFI Transmission',
                url: '/cpn/howtos/encrypt-files',
              },
              {
                label: 'Create a Support Ticket',
                url: '/cpn/howtos/create-support-ticket',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Supported Blockchains',
                url: '/cpn/references/supported-blockchains',
              },
              {
                label: 'Wallet Provider Compatibility',
                url: '/cpn/references/wallet-provider-compatibility',
              },
              {
                label: 'Component States and Workflows',
                url: '/cpn/references/component-states-and-workflows',
              },
              {
                label: 'Payment Reason Codes',
                url: '/cpn/references/payment-reason-codes',
              },
              {
                label: 'Payment Reference',
                url: '/cpn/references/payment-reference',
              },
              {
                label: 'Magic Values for Testing',
                url: '/cpn/references/magic-values',
              },
              {
                label: 'Webhook Events',
                url: '/cpn/references/webhook-events',
              },
              {
                label: 'Webhook Retries',
                url: '/cpn/references/webhook-retries',
              },
              {
                label: 'Payment and Transaction Failure Reasons',
                url: '/cpn/references/payment-and-transaction-failure-reasons',
              },
              {
                label: 'Payment Failure Codes',
                url: '/cpn/references/payment-failure-codes',
              },
              {
                label: 'Error Codes',
                url: '/cpn/references/error-codes',
              },
              {
                label: 'JSON Schema',
                url: '/cpn/references/json-schema',
              },
              {
                label: 'RFI Levels',
                url: '/cpn/references/rfi-levels',
              },
              {
                label: 'Travel Rule Requirements',
                url: '/cpn/references/travel-rule-requirements',
              },
              {
                label: 'Validating Brazilian Tax ID and Bank Account Numbers',
                url: '/cpn/references/validating-brazil-tax-account-id',
              },
              {
                label: 'API Reference',
                url: '/api-reference/cpn/cpn-platform/get-payment-configurations-overview',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    label: 'Developer Services',
    items: [
      {
        label: 'Wallets',
        url: '/wallets',
        children: [
          {
            label: 'Circle Wallets Overview',
            url: '/wallets',
          },
          {
            label: 'Wallets Products',
            items: [
              {
                label: 'Wallets: Modular',
                url: '../wallets/modular',
              },
              {
                label: 'Wallets: User-Controlled',
                url: '../wallets/user-controlled',
              },
              {
                label: 'Wallets: Dev-Controlled',
                url: '../wallets/dev-controlled',
              },
              {
                label: 'Gas Station',
                url: '../wallets/gas-station',
              },
              {
                label: 'Compliance Engine',
                url: '../wallets/compliance-engine',
              },
            ],
          },
          {
            label: 'Concepts',
            items: [
              {
                label: 'Key Management',
                url: '/wallets/key-management',
              },
              {
                label: 'Account Types',
                url: '/wallets/account-types',
              },
              {
                label: 'Signing APIs',
                url: '/wallets/signing-apis',
              },
              {
                label: 'Choosing your Wallet Type',
                url: '/wallets/infrastructure-models',
              },
              {
                label: 'Unified Wallet Addressing on EVM Chains',
                url: '/wallets/unified-wallet-addressing-evm',
              },
              {
                label: 'Wallets on Solana',
                url: '/wallets/wallets-on-solana',
              },
              {
                label: 'Webhook Notifications Flows',
                url: '/wallets/webhook-notification-flows',
              },
              {
                label: 'Webhook Notifications Logs',
                url: '/wallets/webhook-logs',
              },
            ],
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Subscribing to Webhook Notifications',
                url: '/wallets/webhook-notifications',
              },
            ],
          },
          {
            label: 'Tutorials',
            items: [
              {
                label: 'Batch Operations',
                url: '/wallets/batch-operations',
              },
              {
                label: 'Sign Transactions on EVM Chains',
                url: '/wallets/sign-tx-evm',
              },
              {
                label: 'Sign Transactions on Solana',
                url: '/wallets/sign-tx-solana',
              },
              {
                label: 'Sign Transactions on NEAR',
                url: '/wallets/sign-tx-near',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Supported Blockchains and APIs',
                url: '/wallets/supported-blockchains',
              },
              {
                label: 'Blockchain Infrastructure',
                url: '/wallets/blockchain-infrastructure',
              },
              {
                label: 'API Rate Limits',
                url: '/wallets/api-rate-limits',
              },
              {
                label: 'Transaction Rate Limits',
                url: '/wallets/transaction-limits-and-optimizations',
              },
              {
                label: 'Gas Fees',
                url: '/wallets/gas-fees',
              },
              {
                label: 'Monitored Tokens',
                url: '/wallets/monitored-tokens',
              },
              {
                label: 'Wallet Upgrades',
                url: '/wallets/wallet-upgrades',
              },
            ],
          },
        ],
      },
      {
        label: 'Gas Station',
        url: '/wallets/gas-station',
        isHidden: true,
        children: [
          {
            label: '↑ (Back to Wallets)',
            url: '/wallets',
          },
          {
            label: 'Gas Station Overview',
            url: '/wallets/gas-station',
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Send a Gasless Transaction',
                url: '/wallets/gas-station/send-a-gasless-transaction',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Contract Addresses',
                url: '/wallets/gas-station/contract-addresses',
              },
              {
                label: 'Billing for Sponsored Gas Fees',
                url: '/wallets/gas-station/billing',
              },
              {
                label: 'Policy Management',
                url: '/wallets/gas-station/policy-management',
              },
            ],
          },
        ],
      },
      {
        label: 'Compliance Engine',
        url: '/wallets/compliance-engine',
        isHidden: true,
        children: [
          {
            label: '↑ (Back to Wallets)',
            url: '/wallets',
          },
          {
            label: 'Compliance Engine Overview',
            url: '/wallets/compliance-engine',
          },
          {
            label: 'Concepts',
            items: [
              {
                label: 'Transaction Screening',
                url: '/wallets/compliance-engine/tx-screening',
              },
            ],
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Assess the Risk of Wallet Addresses',
                url: '/wallets/compliance-engine/tx-screening-quickstart',
              },
            ],
          },
          {
            label: 'Tutorials',
            items: [
              {
                label: 'Testing Transaction Screening',
                url: '/wallets/compliance-engine/tx-screening-testing',
              },
              {
                label: 'Transaction Screening Rule Management',
                url: '/wallets/compliance-engine/tx-screening-rule-management',
              },
              {
                label: 'Transaction Screening Alert Management',
                url: '/wallets/compliance-engine/tx-screening-alert-management',
              },
            ],
          },
        ],
      },
      {
        label: 'Wallets: Dev-Controlled',
        url: '/wallets/dev-controlled',
        isHidden: true,
        children: [
          {
            label: '↑ (Back to Wallets)',
            url: '/wallets',
          },
          {
            label: 'Developer-Controlled Wallets Overview',
            url: '/wallets/dev-controlled',
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Register Your Entity Secret',
                url: '/wallets/dev-controlled/register-entity-secret',
              },
              {
                label: 'Create Your First Developer-Controlled Wallet',
                url: '/wallets/dev-controlled/create-your-first-wallet',
              },
              {
                label: 'Receive an Inbound Transfer',
                url: '/wallets/dev-controlled/receive-an-inbound-transfer',
              },
              {
                label: 'Transfer Tokens from Wallet to Wallet',
                url: '/wallets/dev-controlled/transfer-tokens-across-wallets',
              },
            ],
          },
          {
            label: 'Tutorials',
            items: [
              {
                label: 'Entity Secret Management',
                url: '/wallets/dev-controlled/entity-secret-management',
              },
              {
                label: 'Onboard Users',
                url: '/wallets/dev-controlled/onboard-users',
              },
            ],
          },
        ],
      },
      {
        label: 'Wallets: User-Controlled',
        url: '/wallets/user-controlled',
        isHidden: true,
        children: [
          {
            label: '↑ (Back to Wallets)',
            url: '/wallets',
          },
          {
            label: 'User-Controlled Wallets Overview',
            url: '/wallets/user-controlled',
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Create Your First Wallet with Social Logins',
                url: '/wallets/user-controlled/create-your-first-wallet-with-social-logins',
              },
              {
                label: 'Create Your First Wallet with Email',
                url: '/wallets/user-controlled/create-your-first-wallet-with-email',
              },
              {
                label: 'Create Your First with PIN',
                url: '/wallets/user-controlled/create-your-first-wallet-with-pin',
              },
            ],
          },
          {
            label: 'Tutorials',
            items: [
              {
                label: 'Send an Outbound Transfer or Execute Contract',
                url: '/wallets/user-controlled/send-an-outbound-transfer-or-execute-contract',
              },
              {
                label: 'Initiate a Signature Request',
                url: '/wallets/user-controlled/initiate-a-signature-request',
              },
              {
                label: 'Receive an Inbound Transfer',
                url: '/wallets/user-controlled/receive-inbound-transfer',
              },
              {
                label: 'Send an Outbound Transfer',
                url: '/wallets/user-controlled/send-outbound-transfer',
              },
              {
                label: 'Reset Account Pin Code',
                url: '/wallets/user-controlled/reset-account-pin',
              },
              {
                label: 'Recover an Account',
                url: '/wallets/user-controlled/recover-account',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Authentication Methods',
                url: '/wallets/user-controlled/authentication-methods',
              },
              {
                label: 'Confirmation UIs',
                url: '/wallets/user-controlled/confirmation-uis',
              },
              {
                label: 'SDK Architecture',
                url: '/wallets/user-controlled/sdk-architecture',
              },
              {
                label: 'SDKs',
                url: '/wallets/user-controlled/sdks',
                isCollapsible: true,
                children: [
                  {
                    label: 'Web SDK',
                    url: '/wallets/user-controlled/web-sdk',
                  },
                  {
                    label: 'iOS Mobile SDK',
                    url: '/wallets/user-controlled/ios-sdk',
                  },
                  {
                    label: 'Android Mobile SDK',
                    url: '/wallets/user-controlled/android-sdk',
                  },
                  {
                    label: 'React Native Mobile SDK',
                    url: '/wallets/user-controlled/react-native-sdk',
                  },
                  {
                    label: 'Web SDK UI Customizations',
                    url: '/wallets/user-controlled/web-sdk-ui-customizations',
                  },
                  {
                    label: 'iOS SDK UI Customization API',
                    url: '/wallets/user-controlled/ios-sdk-ui-customization-api',
                  },
                  {
                    label: 'Android SDK UI Customization API',
                    url: '/wallets/user-controlled/android-sdk-ui-customization-api',
                  },
                  {
                    label: 'React Native SDK UI Customization API',
                    url: '/wallets/user-controlled/react-native-sdk-ui-customization-api',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Wallets: Modular',
        url: '/wallets/modular',
        isHidden: true,
        children: [
          {
            label: '↑ (Back to Wallets)',
            url: '/wallets',
          },
          {
            label: 'Modular Wallets Overview',
            url: '/wallets/modular',
          },
          {
            label: 'Concepts',
            items: [
              {
                label: 'Key Features',
                url: '/wallets/modular/key-features',
              },
              {
                label: 'Passkeys',
                url: '/wallets/modular/passkeys',
              },
            ],
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Create a Wallet and Send a Gasless Transaction',
                url: '/wallets/modular/create-a-wallet-and-send-gasless-txn',
              },
            ],
          },
          {
            label: 'Tutorials',
            items: [
              {
                label: 'Console Setup',
                url: '/wallets/modular/console-setup',
              },
              {
                label: 'Set Up Passkey Recovery',
                url: '/wallets/modular/recover-passkey',
              },
              {
                label: 'Dynamic Integration',
                url: '/wallets/modular/dynamic-integration',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Modules',
                url: '/wallets/modular/modules',
              },
              {
                label: 'SDKs',
                isCollapsible: true,
                children: [
                  {
                    label: 'Web SDK',
                    url: '/wallets/modular/web-sdk',
                  },
                  {
                    label: 'iOS Mobile SDK',
                    url: '/wallets/modular/ios-sdk',
                  },
                  {
                    label: 'Android Mobile SDK',
                    url: '/wallets/modular/android-sdk',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Contracts',
        url: '/contracts',
        children: [
          {
            label: 'Circle Contracts Overview',
            url: '/contracts',
          },
          {
            label: 'Concepts',
            items: [
              {
                label: 'Templates',
                url: '/contracts/scp-templates-overview',
              },
            ],
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Deploy a Smart Contract using Bytecode',
                url: '/contracts/scp-deploy-smart-contract',
              },
              {
                label: 'Deploy an NFT Smart Contract From a Template',
                url: '/contracts/deploy-smart-contract-template',
              },
              {
                label: 'Interact With a Smart Contract',
                url: '/contracts/scp-interact-smart-contract',
              },
              {
                label: 'Event Monitoring for Smart Contracts',
                url: '/contracts/scp-event-monitoring',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Supported Blockchains',
                url: '/contracts/supported-blockchains',
              },
              {
                label: 'Airdrop Template',
                url: '/contracts/airdrop',
              },
              {
                label: 'Token Template',
                url: '/contracts/erc-20-token',
              },
              {
                label: 'Multi-Token Template',
                url: '/contracts/erc-1155-multi-token',
              },
              {
                label: 'NFT Template',
                url: '/contracts/erc-721-nft',
              },
            ],
          },
        ],
      },
      {
        label: 'CCTP',
        url: '/cctp',
        children: [
          {
            label: 'CCTP Overview',
            url: '/cctp',
          },
          {
            label: 'Concepts',
            items: [
              {
                label: 'Technical Guide',
                url: '/cctp/technical-guide',
              },
              { label: 'FAQ', url: '/cctp/cctp-faq' },
            ],
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Transfer USDC on testnet from Ethereum to Avalanche',
                url: '/cctp/transfer-usdc-on-testnet-from-ethereum-to-avalanche',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Supported Chains and Domains',
                url: '/cctp/cctp-supported-blockchains',
              },
              {
                label: 'EVM Contracts and Interfaces',
                url: '/cctp/evm-smart-contracts',
              },
              {
                label: 'Non-EVM Contracts and Interfaces',
                isCollapsible: true,
                children: [
                  {
                    label: 'Solana Programs and Interfaces',
                    url: '/cctp/solana-programs',
                  },
                ],
              },
              {
                label: 'Block Confirmations',
                url: '/cctp/required-block-confirmations',
              },
              {
                label: 'API Reference',
                url: '/api-reference/w3s/cctp/get-public-keys-v-2',
                icon: 'SwitchHorizontalOutline',
              },
              {
                label: 'Sample Applications',
                url: '../sample-projects#cctp',
              },
              {
                label: 'CCTP V1',
                url: '../cctp/v1',
              },
            ],
          },
        ],
      },
      {
        label: 'CCTP V1',
        url: '/cctp/v1',
        isHidden: true,
        children: [
          {
            label: '↑ (Back to CCTP)',
            url: '/cctp',
          },
          {
            label: 'CCTP V1 Overview',
            url: '/cctp/v1',
          },
          {
            label: 'Concepts',
            items: [
              {
                label: 'Message Passing',
                url: '/cctp/v1/generic-message-passing',
              },
              { label: 'Message Format', url: '/cctp/v1/message-format' },
              {
                label: 'API Hosts and Endpoints',
                url: '/cctp/v1/cctp-apis',
              },
              { label: 'Limits', url: '/cctp/v1/limits' },
            ],
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Transfer USDC on testnet from Ethereum to Avalanche',
                url: '/cctp/v1/transfer-usdc-on-testnet-from-ethereum-to-avalanche',
              },
              {
                label: 'Transfer USDC on testnet between Noble and Ethereum',
                url: '/cctp/v1/transfer-usdc-on-testnet-from-noble-to-ethereum',
              },
              {
                label: 'Transfer USDC on testnet between Sui and Ethereum',
                url: '/cctp/v1/transfer-usdc-on-testnet-from-sui-to-ethereum',
              },
              {
                label: 'Transfer USDC on testnet between Aptos and Base',
                url: '/cctp/v1/transfer-usdc-on-testnet-from-aptos-to-base',
              },
              {
                label:
                  'Transfer USDC on devnet between Solana and other chains',
                url: '/cctp/v1/transfer-testnet-usdc-between-solana-devnet',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Supported Blockchains',
                url: '/cctp/v1/cctp-supported-blockchains',
              },
              {
                label: 'EVM Contracts and Interfaces',
                url: '/cctp/v1/evm-smart-contracts',
              },
              {
                label: 'Non-EVM Contracts and Interfaces',
                isCollapsible: true,
                children: [
                  {
                    label: 'Solana Programs and Interfaces',
                    url: '/cctp/v1/solana-programs',
                  },
                  {
                    label: 'Noble Cosmos Module and Interface',
                    url: '/cctp/v1/noble-cosmos-module',
                  },
                  {
                    label: 'Sui Packages and Interfaces',
                    url: '/cctp/v1/sui-packages',
                  },
                  {
                    label: 'Aptos Packages and Interfaces',
                    url: '/cctp/v1/aptos-packages',
                  },
                ],
              },
              {
                label: 'Block Confirmations',
                url: '/cctp/v1/required-block-confirmations',
              },
              {
                label: 'Chain Domains',
                url: '/cctp/v1/supported-domains',
              },
              {
                label: 'API Reference',
                url: '/api-reference/cctp/all/get-attestation',
                icon: 'SwitchHorizontalOutline',
              },
              {
                label: 'Sample Applications',
                url: '../../sample-projects#cctp',
              },
            ],
          },
        ],
      },
      {
        label: 'Gateway',
        url: '/gateway',
        children: [
          {
            label: 'Gateway Overview',
            url: '/gateway',
          },
          {
            label: 'Concepts',
            items: [
              {
                label: 'Technical Guide',
                url: '/gateway/concepts/technical-guide',
              },
              {
                label: 'FAQ',
                url: '/gateway/concepts/faq',
              },
            ],
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Quickstart: Create and Transfer a Unified USDC Balance',
                url: '/gateway/quickstarts/unified-balance',
              },
            ],
          },
          {
            label: 'How-tos',
            items: [
              {
                label: 'Create a Unified USDC Balance',
                url: '/gateway/howtos/create-unified-usdc-balance',
              },
              {
                label: 'Transfer a Unified USDC Balance Instantly',
                url: '/gateway/howtos/transfer-unified-usdc-balance',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Fees',
                url: '/gateway/references/fees',
              },
              {
                label: 'Supported Blockchains and Confirmations',
                url: '/gateway/references/supported-blockchains',
              },
              {
                label: 'Contract Addresses',
                url: '/gateway/references/contract-addresses',
              },
              {
                label: 'Contract Interfaces and Events',
                url: '/gateway/references/contract-interfaces-and-events',
              },
              {
                label: 'API Reference',
                url: '/api-reference/gateway/all/get-token-balances',
              },
            ],
          },
        ],
      },
      {
        label: 'Paymaster',
        url: '/paymaster',
        children: [
          {
            label: 'Paymaster Overview',
            url: '/paymaster',
          },
          {
            label: 'Quickstarts',
            items: [
              {
                label: 'Build a Wallet to Pay Gas Fees in USDC',
                url: '/paymaster/pay-gas-fees-usdc',
              },
            ],
          },
          {
            label: 'References',
            items: [
              {
                label: 'Addresses and Events',
                url: '/paymaster/addresses-and-events',
              },
            ],
          },
        ],
      },
      {
        label: 'References',
        url: '/w3s/supported-blockchains-and-currencies',
        children: [
          {
            label: 'Supported Blockchains',
            url: '/w3s/supported-blockchains-and-currencies',
            isCollapsible: true,
            children: [
              {
                label: 'Blockchain Compatibility for Developer Services APIs',
                url: '/w3s/blockchain-compatibility-for-circle-apis',
              },
              {
                label: 'Blockchain Confirmations',
                url: '/w3s/blockchain-confirmations',
              },
              {
                label: 'Chain ID for Signing Transactions',
                url: '/w3s/sign-tx-chain-id',
              },
            ],
          },
          {
            label: 'API Keys and Client Keys',
            url: '/w3s/web3-services-api-client-keys-auth',
          },
          {
            label: 'Testnet vs. Mainnet',
            url: '/w3s/sandbox-vs-production',
          },
          {
            label: 'Testnet Faucets',
            url: '/w3s/developer-console-faucet',
          },
          {
            label: 'Developer Console',
            isCollapsible: true,
            children: [
              {
                label: 'Circle Developer Account',
                url: '/w3s/circle-developer-account',
              },
              {
                label: 'Developer Account Logs',
                url: '/w3s/developer-account-logs',
              },
              {
                label: 'Manage Team Members',
                url: '/w3s/manage-team-members',
              },
            ],
          },
          { label: 'Postman API Suite', url: '/w3s/postman' },
          { label: 'Idempotent Requests', url: '/w3s/idempotent-requests' },
          {
            label: 'Compliance Requirements',
            url: '/w3s/compliance-requirements',
          },
          { label: 'HTTP Errors', url: '/w3s/synchronous-errors' },
          {
            label: 'Transaction States and Errors',
            url: '/w3s/asynchronous-states-and-statuses',
          },
          {
            label: 'Glossary',
            url: '/w3s/programmable-wallets-primitives',
          },
        ],
      },
    ],
  },
  {
    label: 'Liquidity Services',
    items: [
      {
        label: 'Mint',
        url: '/circle-mint/introducing-circle-mint',
        children: [
          {
            label: 'Circle Mint Overview',
            url: '/circle-mint/introducing-circle-mint',
          },
          {
            label: 'Getting Started',
            url: '/circle-mint/getting-started-with-the-circle-apis',
            isCollapsible: true,
            children: [
              {
                label: 'Notifications Quickstart',
                url: '/circle-mint/circle-apis-notifications-quickstart',
              },
            ],
          },
          {
            label: 'Sandbox to Production Transition Guide',
            url: '/circle-mint/sandbox-to-production-transition-guide',
          },
          {
            label: 'Core Functionality',
            isCollapsible: true,
            children: [
              {
                label: 'Quickstart: Deposit via Blockchain Wallet',
                url: '/circle-mint/quickstart-deposit-via-blockchain-wallet',
              },
              {
                label: 'Quickstart: Deposit via Funds Transfer',
                url: '/circle-mint/quickstart-deposit-via-funds-transfer',
              },
              {
                label: 'Quickstart: Withdraw to Bank',
                url: '/circle-mint/quickstart-withdraw-to-bank',
              },
              {
                label: 'Quickstart: Withdraw via Blockchain Wallet',
                url: '/circle-mint/quickstart-withdraw-via-blockchain-wallet',
              },
            ],
          },
          {
            label: 'Using the API',
            isCollapsible: true,
            children: [
              {
                label: 'Authentication',
                url: '/circle-mint/authentication',
              },
              { label: 'API Keys', url: '/circle-mint/api-keys' },
              {
                label: 'Sandbox Environment',
                url: '/circle-mint/circle-apis-production-sandbox-environments',
              },
              {
                label: 'Using Sandbox to Test Connectivity and API Keys',
                url: '/circle-mint/testing-connectivity-and-api-keys',
              },
              {
                label: 'Idempotent Requests',
                url: '/circle-mint/a-note-on-idempotent-requests',
              },
              {
                label: 'API Resource Data Models',
                url: '/circle-mint/circle-api-resources',
              },
              {
                label: 'Notifications Data Models',
                url: '/circle-mint/notifications-data-models',
              },
              {
                label: 'Date Filtering and Pagination Queries',
                url: '/circle-mint/pagination-and-filtering',
              },
            ],
          },
          {
            label: 'Blockchain Confirmations',
            url: '/circle-mint/blockchain-confirmations',
          },
          {
            label: 'Supported Chains and Currencies',
            url: '/circle-mint/supported-chains-and-currencies',
          },
          {
            label: 'Supported Countries',
            url: '/circle-mint/supported-countries',
          },
          {
            label: 'Onchain Travel Rule',
            url: '/circle-mint/travel-rule-on-chain',
          },
          {
            label: 'Wire Virtual Account Number',
            url: '/circle-mint/wire-virtual-account-number',
          },
          {
            label: 'Circle APIs: API and Entity Errors',
            url: '/circle-mint/circle-apis-api-errors',
          },
          {
            label: 'Additional APIs',
            url: '/circle-mint/additional-apis',
            isCollapsible: true,
            children: [
              {
                label: 'Exchange Local Currency for USDC',
                url: '/circle-mint/exchange-local-currency-usdc',
              },
              {
                label: 'Swap Between USDC and EURC',
                url: '/circle-mint/swap-between-usdc-and-eurc',
              },
              {
                label: 'Send USDC from your Circle Mint Account',
                url: '/circle-mint/crypto-payouts',
              },
              {
                label: 'Quickstart: Crypto Deposits',
                url: '/circle-mint/crypto-payments-quickstart',
              },
              {
                label: 'Quickstart: Crypto Refunds',
                url: '/circle-mint/crypto-refunds',
              },
            ],
          },
          {
            label: 'Developer Tools',
            items: [
              { label: 'Circle SDKs', url: '/circle-mint/circle-sdks' },
              { label: 'OpenAPI', url: '/circle-mint/openapi' },
              { label: 'Postman Suite', url: '/circle-mint/postman' },
              { label: 'API Logs', url: '/circle-mint/api-logs' },
              {
                label: 'Manage Webhook Subscriptions',
                url: '/circle-mint/webhook-subscription-management',
              },
            ],
          },
          {
            label: 'API Reference',
            url: '/api-reference/circle-mint/account/list-business-balances',
            icon: 'SwitchHorizontalOutline',
          },
        ],
      },
    ],
  },
  {
    label: 'Resources',
    items: [
      {
        label: 'API Reference',
        url: '/api-reference',
      },
      {
        label: 'Resources',
        url: '/sdks',
        isHidden: true,
        children: [
          {
            label: 'SDK Explorer',
            url: '/sdk-explorer',
            isHidden: !featureFlags.sdkExplorerEnabled,
          },
          {
            label: 'SDKs',
            url: '/sdks',
            isCollapsible: true,
            children: [
              {
                label: 'Developer-Controlled Wallets SDK',
                url: '/sdks#developer-controlled-wallet-sdk',
              },
              {
                label: 'Modular Wallets SDK',
                url: '/sdks#modular-wallet-sdk-client',
              },
              {
                label: 'User-Controlled Wallets SDK (Client)',
                url: '/sdks#user-controlled-wallet-sdk-client',
              },
              {
                label: 'User-Controlled Wallets SDK (Server)',
                url: '/sdks#user-controlled-wallet-sdk-server',
              },
              {
                label: 'Contracts SDK',
                url: '/sdks#smart-contract-platform-sdk',
              },
              {
                label: 'CCTP Third-Party SDKs',
                url: '/sdks#cctp-third-party-sdks',
              },
              {
                label: 'Mint Payouts SDK',
                url: '/sdks#mint-payouts-sdk',
              },
            ],
          },
          {
            label: 'Sample Projects',
            url: '/sample-projects',
            isCollapsible: true,
            children: [
              {
                label:
                  'Create escrow contracts for the gig economy using AI and USDC',
                url: '/sample-projects#create-escrow-contracts-for-the-gig-economy-using-ai-and-usdc',
              },
              {
                label: 'Autonomous payments with AI agents',
                url: '/sample-projects#autonomous-payments-with-ai-agents',
              },
              {
                label: 'Create a smart account and send a gasless transaction',
                url: '/sample-projects#create-a-smart-account-and-send-a-gasless-transaction',
              },
              {
                label:
                  'User account creation, email login, and PIN authorization flow',
                url: '/sample-projects#user-account-creation-email-login-and-pin-authorization-flow',
              },
              {
                label:
                  'User account creation, social and email login, and PIN authorization flow',
                url: '/sample-projects#user-account-creation-and-email-login-and-pin-authorization-flow',
              },
              {
                label: 'User account creation and social login',
                url: '/sample-projects#user-account-creation-and-social-login',
              },
              {
                label: 'Manage user sessions',
                url: '/sample-projects#manage-user-sessions',
              },
              {
                label: 'Telegram bot with Wallets',
                url: '/sample-projects#telegram-bot-with-wallets',
              },
              {
                label: 'Pay for network fees with USDC',
                url: '/sample-projects#pay-for-network-fees-with-usdc',
              },
              {
                label: 'Test payment flows',
                url: '/sample-projects#test-payment-flows',
              },
              {
                label: 'Fast Transfer USDC between blockchains',
                url: '/sample-projects#fast-transfer-usdc-between-blockchains',
              },
              {
                label: 'Transfer USDC between blockchains',
                url: '/sample-projects#transfer-usdc-between-blockchains',
              },
              {
                label: 'Cross-chain USDC Telegram bot with CCTP and Wallets',
                url: '/sample-projects#cross-chain-usdc-telegram-bot-with-cctp-and-wallets',
              },
              {
                label: 'Evaluate a fast confirmation rule on Ethereum',
                url: '/sample-projects#evaluate-a-fast-confirmation-rule-on-ethereum',
              },
              {
                label: 'Execute onchain transactions with intents and AI',
                url: '/sample-projects#execute-onchain-transactions-with-intents-and-ai',
              },
              {
                label: 'Create credit apps powered by USDC',
                url: '/sample-projects#create-credit-apps-powered-by-usdc',
              },
            ],
          },
        ],
      },
      {
        label: 'SDK Explorer',
        url: '/sdk-explorer',
        isHidden: !featureFlags.sdkExplorerEnabled,
      },
      {
        label: 'SDKs',
        url: '/sdks',
        isHidden: !featureFlags.sdkAndSampleOverviewEnabled,
      },
      {
        label: 'Sample Projects',
        url: '/sample-projects',
        isHidden: !featureFlags.sdkAndSampleOverviewEnabled,
      },
      {
        label: 'Interactive Quickstarts',
        url: '/interactive-quickstarts',
        isHidden: featureFlags.sdkAndSampleOverviewEnabled,
        children: [
          {
            label: 'Overview',
            url: '/interactive-quickstarts',
          },
          {
            label: 'Get Started',
            url: '/interactive-quickstarts/get-started',
            isCollapsible: true,
            children: [
              {
                label: 'Create a Developer Services account',
                url: '/interactive-quickstarts/get-started#create-a-developer-services-account',
              },
              {
                label: 'Understanding Testnet vs Mainnet environments',
                url: '/interactive-quickstarts/get-started#understanding-testnet-vs-mainnet-environments',
              },
              {
                label: 'Create your API key',
                url: '/interactive-quickstarts/get-started#create-your-api-key',
              },
              {
                label: 'The power of Testnet',
                url: '/interactive-quickstarts/get-started#the-power-of-testnet',
              },
            ],
          },
          {
            label: 'Developer Controlled Wallets',
            url: '/interactive-quickstarts/dev-controlled-wallets',
            isCollapsible: true,
            children: [
              {
                label: 'Introduction',
                url: '/interactive-quickstarts/dev-controlled-wallets#introduction',
              },
              {
                label: 'Prerequisites',
                url: '/interactive-quickstarts/dev-controlled-wallets#prerequisites',
              },
              {
                label: 'Setup your Entity Secret',
                url: '/interactive-quickstarts/dev-controlled-wallets#setup-your-entity-secret',
              },
              {
                label: 'Create a Wallet',
                url: '/interactive-quickstarts/dev-controlled-wallets#create-a-wallet',
              },
              {
                label: 'Initiate a Transaction',
                url: '/interactive-quickstarts/dev-controlled-wallets#initiate-a-transaction',
              },
              {
                label: 'Congratulations on your Progress!',
                url: '/interactive-quickstarts/dev-controlled-wallets#congratulations-on-your-progress',
              },
            ],
          },
          {
            label: 'User Controlled Wallets',
            url: '/interactive-quickstarts/user-controlled-wallets',
            isCollapsible: true,
            children: [
              {
                label: 'Introduction',
                url: '/interactive-quickstarts/user-controlled-wallets#introduction',
              },
              {
                label: 'Prerequisites',
                url: '/interactive-quickstarts/user-controlled-wallets#prerequisites',
              },
              {
                label: 'Configure your App (get your AppID)',
                url: '/interactive-quickstarts/user-controlled-wallets#configure-your-app-get-your-appid',
              },
              {
                label: 'Create your User Wallet',
                url: '/interactive-quickstarts/user-controlled-wallets#create-your-user-wallet',
              },
              {
                label: 'Initiate a Transaction',
                url: '/interactive-quickstarts/user-controlled-wallets#initiate-a-transaction',
              },
              {
                label: 'Congratulations on your Progress!',
                url: '/interactive-quickstarts/user-controlled-wallets#congratulations-on-your-progress',
              },
            ],
          },
          {
            label: 'CCTP',
            url: '/interactive-quickstarts/cctp',
            isCollapsible: true,
            children: [
              {
                label: 'Introduction',
                url: '/interactive-quickstarts/cctp#introduction',
              },
              {
                label: 'Prerequisites',
                url: '/interactive-quickstarts/cctp#prerequisites',
              },
              {
                label: 'Burn USDC',
                url: '/interactive-quickstarts/cctp#burn-usdc',
              },
              {
                label: 'Approve Burn',
                url: '/interactive-quickstarts/cctp#approve-burn',
              },
              {
                label: 'Mint USDC',
                url: '/interactive-quickstarts/cctp#mint-usdc',
              },
              {
                label: 'Congratulations on your Progress!',
                url: '/interactive-quickstarts/cctp#congratulations-on-your-progress',
              },
            ],
          },
        ],
      },
      {
        label: 'Build with AI',
        url: '/ai-codegen',
        // Hide if AI chatbot is disabled, or if it's in internal QA mode.
        isHidden:
          !featureFlags.aiChatbotEnabled || featureFlags.aiChatbotInternalQA,
        children: [
          {
            label: 'Generate code',
            url: '/ai-codegen',
            icon: 'ChatOutline',
          },
        ],
      },
      {
        label: 'Faucet',
        url: process.env.FAUCET_URL as string,
      },
      {
        label: 'Release Notes',
        url: '/release-notes',
        children: [
          {
            label: '2025',
            items: [
              {
                label: 'Developer Services',
                url: '/release-notes/w3s-2025',
              },
              {
                label: 'Circle Mint',
                url: '/release-notes/circle-mint-2025',
              },
              {
                label: 'Stablecoins',
                url: '/release-notes/stablecoins-2025',
              },
              {
                label: 'Tokenized Funds',
                url: '/release-notes/tokenized-funds-2025',
              },
              {
                label: 'Circle Payments Network',
                url: '/release-notes/cpn-2025',
              },
            ],
          },
          {
            label: '2024',
            items: [
              {
                label: 'Developer Services',
                url: '/release-notes/w3s-2024',
              },
              {
                label: 'Circle Mint',
                url: '/release-notes/circle-mint-2024',
              },
              {
                label: 'Stablecoins',
                url: '/release-notes/stablecoins-2024',
              },
            ],
          },
        ],
      },
      {
        label: 'Help',
        url: 'https://support.usdc.circle.com/hc/en-us/p/contactus',
      },
    ],
  },
  {
    label: 'SDK Explorer',
    isHidden: true,
    items: [
      {
        label: 'Developer Controlled Wallets NodeJS',
        url: '/sdk-explorer/developer-controlled-wallets/Node.js',
        children: [
          {
            label: 'Getting Started',
            url: '/sdk-explorer/developer-controlled-wallets/Node.js/getting-started',
          },
        ],
      },
      {
        label: 'User Controlled Wallets NodeJS',
        url: '/sdk-explorer/user-controlled-wallets/Node.js',
        children: [
          {
            label: 'Getting Started',
            url: '/sdk-explorer/user-controlled-wallets/Node.js/getting-started',
          },
        ],
      },
      {
        label: 'Contracts NodeJS',
        url: '/sdk-explorer/smart-contract-platform/Node.js',
        children: [
          {
            label: 'Getting Started',
            url: '/sdk-explorer/smart-contract-platform/Node.js/getting-started',
          },
        ],
      },
      {
        label: 'Developer Controlled Wallets Python',
        url: '/sdk-explorer/developer-controlled-wallets/Python',
        children: [
          {
            label: 'Getting Started',
            url: '/sdk-explorer/developer-controlled-wallets/Python/getting-started',
          },
        ],
      },
      {
        label: 'User Controlled Wallets Python',
        url: '/sdk-explorer/user-controlled-wallets/Python',
        children: [
          {
            label: 'Getting Started',
            url: '/sdk-explorer/user-controlled-wallets/Python/getting-started',
          },
        ],
      },
      {
        label: 'Contracts Platform Python',
        url: '/sdk-explorer/smart-contract-platform/Python',
        children: [
          {
            label: 'Getting Started',
            url: '/sdk-explorer/smart-contract-platform/Python/getting-started',
          },
        ],
      },
    ],
  },
]

type GetNavigationProps = ({
  featureFlags,
}: {
  featureFlags: FeatureFlags
}) => (NavigationItem | NavigationSection)[]
