# 🎨 LicenseChain NFT SDK

[![npm version](https://badge.fury.io/js/@licensechain%2Fnft-sdk.svg)](https://badge.fury.io/js/@licensechain%2Fnft-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **NFT-powered licensing for LicenseChain** - Create, manage, and trade software licenses as Non-Fungible Tokens (NFTs) with advanced metadata and marketplace integration.

## 🌟 Features

### 🎨 **NFT Standards**
- **ERC-721** - Ethereum NFT standard
- **ERC-1155** - Multi-token standard
- **SPL Tokens** - Solana NFT standard
- **Metaplex** - Solana metadata standard
- **IPFS Integration** - Decentralized metadata storage

### 🏪 **Marketplace Integration**
- **OpenSea** - Ethereum/Polygon marketplace
- **Magic Eden** - Solana marketplace
- **Rarible** - Multi-chain marketplace
- **Foundation** - Ethereum marketplace
- **SuperRare** - Ethereum marketplace

### 🔐 **Advanced Licensing**
- **License NFTs** - Software licenses as NFTs
- **Feature Tokens** - Individual features as tokens
- **Time-based Licenses** - Expiring license NFTs
- **Transferable Licenses** - Tradeable license rights
- **Royalty Management** - Automatic royalty distribution

### 🌐 **Multi-Chain Support**
- **Ethereum** - ERC-721/ERC-1155
- **Polygon** - Layer 2 scaling
- **Solana** - SPL tokens
- **BSC** - BEP-721/BEP-1155
- **Avalanche** - AVAX NFTs

## 🚀 Quick Start

### Installation

```bash
npm install @licensechain/nft-sdk
# or
yarn add @licensechain/nft-sdk
# or
pnpm add @licensechain/nft-sdk
```

### Basic Usage

```typescript
import { LicenseChainNFT } from '@licensechain/nft-sdk';

// Initialize the SDK
const nftSDK = new LicenseChainNFT({
  chain: 'ethereum', // or 'polygon', 'solana', 'bsc'
  privateKey: process.env.PRIVATE_KEY,
  rpcUrl: process.env.RPC_URL,
  ipfsUrl: process.env.IPFS_URL
});

// Deploy NFT license contract
const contract = await nftSDK.deployLicenseNFT({
  name: 'My Software License NFT',
  symbol: 'MSLN',
  baseURI: 'https://api.myapp.com/nft-metadata/',
  maxSupply: 10000,
  royaltyRecipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  royaltyFee: 250 // 2.5%
});

// Create a license NFT
const licenseNFT = await contract.mintLicenseNFT({
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  tokenId: 1,
  metadata: {
    name: 'MyApp Pro License',
    description: 'Premium software license with unlimited features',
    image: 'https://api.myapp.com/images/license-nft.png',
    attributes: [
      { trait_type: 'Software', value: 'MyApp Pro' },
      { trait_type: 'Version', value: '2.0.0' },
      { trait_type: 'Features', value: 'Premium, Unlimited' },
      { trait_type: 'Expires', value: '2024-12-31' }
    ],
    license: {
      software: 'MyApp Pro',
      version: '2.0.0',
      features: ['premium', 'unlimited'],
      expiresAt: 1735689600
    }
  }
});

// Verify license NFT
const isValid = await contract.verifyLicenseNFT(1);
console.log('License NFT valid:', isValid);
```

## 📚 API Reference

### LicenseChainNFT

#### Constructor Options

```typescript
interface NFTConfig {
  chain: 'ethereum' | 'polygon' | 'solana' | 'bsc' | 'avalanche';
  privateKey?: string;
  walletProvider?: any;
  rpcUrl?: string;
  ipfsUrl?: string;
  marketplaceApiKey?: string;
  royaltyRecipient?: string;
  royaltyFee?: number;
}
```

#### Methods

##### `deployLicenseNFT(options)`
Deploy a new license NFT contract.

```typescript
interface DeployOptions {
  name: string;
  symbol: string;
  baseURI: string;
  maxSupply?: number;
  royaltyRecipient?: string;
  royaltyFee?: number;
  contractURI?: string;
}

const contract = await nftSDK.deployLicenseNFT({
  name: 'My Software License NFT',
  symbol: 'MSLN',
  baseURI: 'https://api.myapp.com/nft-metadata/',
  maxSupply: 10000,
  royaltyRecipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  royaltyFee: 250,
  contractURI: 'https://api.myapp.com/contract-metadata.json'
});
```

##### `getContract(address)`
Get an existing contract instance.

```typescript
const contract = await nftSDK.getContract('0x...');
```

### LicenseNFTContract

#### Methods

##### `mintLicenseNFT(options)`
Mint a new license NFT.

```typescript
interface MintOptions {
  to: string;
  tokenId: number;
  metadata: NFTMetadata;
  expiresAt?: number;
  transferable?: boolean;
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  animation_url?: string;
  attributes: Attribute[];
  license: LicenseData;
}

interface Attribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

interface LicenseData {
  software: string;
  version: string;
  features: string[];
  expiresAt?: number;
  customData?: Record<string, any>;
}

const licenseNFT = await contract.mintLicenseNFT({
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  tokenId: 1,
  metadata: {
    name: 'MyApp Pro License',
    description: 'Premium software license with unlimited features',
    image: 'https://api.myapp.com/images/license-nft.png',
    attributes: [
      { trait_type: 'Software', value: 'MyApp Pro' },
      { trait_type: 'Version', value: '2.0.0' },
      { trait_type: 'Features', value: 'Premium, Unlimited' }
    ],
    license: {
      software: 'MyApp Pro',
      version: '2.0.0',
      features: ['premium', 'unlimited'],
      expiresAt: 1735689600
    }
  }
});
```

##### `verifyLicenseNFT(tokenId)`
Verify if a license NFT is valid.

```typescript
const isValid = await contract.verifyLicenseNFT(1);
```

##### `getLicenseNFTMetadata(tokenId)`
Get license NFT metadata.

```typescript
const metadata = await contract.getLicenseNFTMetadata(1);
```

##### `transferLicenseNFT(from, to, tokenId)`
Transfer a license NFT to another address.

```typescript
const tx = await contract.transferLicenseNFT(
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  '0x8ba1f109551bD432803012645Hac136c4c8c4c8c',
  1
);
```

##### `listLicenseNFT(marketplace, tokenId, price)`
List a license NFT on a marketplace.

```typescript
const listing = await contract.listLicenseNFT({
  marketplace: 'opensea',
  tokenId: 1,
  price: '1.0', // ETH
  currency: 'ETH',
  duration: 7 // days
});
```

##### `buyLicenseNFT(marketplace, tokenId)`
Buy a license NFT from a marketplace.

```typescript
const purchase = await contract.buyLicenseNFT({
  marketplace: 'opensea',
  tokenId: 1,
  price: '1.0'
});
```

## 🔧 Advanced Features

### IPFS Integration

```typescript
// Upload metadata to IPFS
const ipfsHash = await nftSDK.uploadToIPFS({
  name: 'MyApp Pro License',
  description: 'Premium software license',
  image: 'https://api.myapp.com/images/license-nft.png',
  attributes: [
    { trait_type: 'Software', value: 'MyApp Pro' },
    { trait_type: 'Version', value: '2.0.0' }
  ]
});

// Mint with IPFS metadata
const licenseNFT = await contract.mintLicenseNFT({
  to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  tokenId: 1,
  metadata: {
    name: 'MyApp Pro License',
    description: 'Premium software license',
    image: 'ipfs://' + ipfsHash,
    attributes: [
      { trait_type: 'Software', value: 'MyApp Pro' },
      { trait_type: 'Version', value: '2.0.0' }
    ],
    license: {
      software: 'MyApp Pro',
      version: '2.0.0',
      features: ['premium', 'unlimited']
    }
  }
});
```

### Marketplace Integration

```typescript
// List on OpenSea
const openseaListing = await contract.listLicenseNFT({
  marketplace: 'opensea',
  tokenId: 1,
  price: '1.0',
  currency: 'ETH',
  duration: 30
});

// List on Magic Eden (Solana)
const magicEdenListing = await contract.listLicenseNFT({
  marketplace: 'magiceden',
  tokenId: 1,
  price: '5.0',
  currency: 'SOL',
  duration: 14
});

// Get marketplace data
const openseaData = await nftSDK.getMarketplaceData('opensea', contract.address, 1);
const magicEdenData = await nftSDK.getMarketplaceData('magiceden', contract.address, 1);
```

### Batch Operations

```typescript
// Batch mint license NFTs
const licenseNFTs = await contract.batchMintLicenseNFTs([
  {
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    tokenId: 1,
    metadata: {
      name: 'MyApp Basic License',
      description: 'Basic software license',
      image: 'https://api.myapp.com/images/basic-license.png',
      attributes: [
        { trait_type: 'Software', value: 'MyApp Basic' },
        { trait_type: 'Version', value: '1.0.0' }
      ],
      license: {
        software: 'MyApp Basic',
        version: '1.0.0',
        features: ['basic']
      }
    }
  },
  {
    to: '0x8ba1f109551bD432803012645Hac136c4c8c4c8c',
    tokenId: 2,
    metadata: {
      name: 'MyApp Pro License',
      description: 'Premium software license',
      image: 'https://api.myapp.com/images/pro-license.png',
      attributes: [
        { trait_type: 'Software', value: 'MyApp Pro' },
        { trait_type: 'Version', value: '2.0.0' }
      ],
      license: {
        software: 'MyApp Pro',
        version: '2.0.0',
        features: ['premium', 'unlimited']
      }
    }
  }
]);
```

### Royalty Management

```typescript
// Set royalty for contract
await contract.setRoyalty({
  recipient: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  fee: 250 // 2.5%
});

// Get royalty info
const royaltyInfo = await contract.getRoyaltyInfo(1, '1000000000000000000'); // 1 ETH
console.log('Royalty recipient:', royaltyInfo.recipient);
console.log('Royalty fee:', royaltyInfo.fee);
```

## 🌐 Chain Configuration

### Supported Chains

| Chain | Standard | RPC URL | Explorer | Marketplace |
|-------|----------|---------|----------|-------------|
| Ethereum | ERC-721/ERC-1155 | https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY | https://etherscan.io | OpenSea, Rarible |
| Polygon | ERC-721/ERC-1155 | https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY | https://polygonscan.com | OpenSea, Rarible |
| Solana | SPL Tokens | https://api.mainnet-beta.solana.com | https://explorer.solana.com | Magic Eden, OpenSea |
| BSC | BEP-721/BEP-1155 | https://bsc-dataseed.binance.org | https://bscscan.com | OpenSea, PancakeSwap |
| Avalanche | ERC-721/ERC-1155 | https://api.avax.network/ext/bc/C/rpc | https://snowtrace.io | OpenSea, Kalao |

### Custom Chain

```typescript
const nftSDK = new LicenseChainNFT({
  chain: 'custom',
  rpcUrl: 'https://your-custom-rpc.com',
  chainConfig: {
    chainId: 12345,
    name: 'Custom Chain',
    explorerUrl: 'https://explorer.custom.com',
    marketplaceUrl: 'https://marketplace.custom.com'
  }
});
```

## 🔒 Security Best Practices

### Metadata Security

```typescript
// Use IPFS for immutable metadata
const metadata = {
  name: 'MyApp Pro License',
  description: 'Premium software license',
  image: 'ipfs://QmYourHashHere',
  attributes: [
    { trait_type: 'Software', value: 'MyApp Pro' },
    { trait_type: 'Version', value: '2.0.0' }
  ],
  license: {
    software: 'MyApp Pro',
    version: '2.0.0',
    features: ['premium', 'unlimited']
  }
};

// Verify metadata integrity
const isValid = await nftSDK.verifyMetadataIntegrity(metadata);
```

### Access Control

```typescript
// Set minter role
await contract.grantRole('MINTER_ROLE', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');

// Set admin role
await contract.grantRole('ADMIN_ROLE', '0x8ba1f109551bD432803012645Hac136c4c8c4c8c');

// Pause contract if needed
await contract.pause();
```

## 📊 Error Handling

```typescript
import { LicenseChainError, ErrorCodes } from '@licensechain/nft-sdk';

try {
  const licenseNFT = await contract.mintLicenseNFT(options);
} catch (error) {
  if (error instanceof LicenseChainError) {
    switch (error.code) {
      case ErrorCodes.INSUFFICIENT_FUNDS:
        console.error('Insufficient funds for transaction');
        break;
      case ErrorCodes.NFT_NOT_FOUND:
        console.error('NFT not found');
        break;
      case ErrorCodes.MARKETPLACE_ERROR:
        console.error('Marketplace operation failed:', error.details);
        break;
      case ErrorCodes.IPFS_ERROR:
        console.error('IPFS operation failed:', error.details);
        break;
      default:
        console.error('Unknown error:', error.message);
    }
  }
}
```

## 🧪 Testing

```typescript
import { LicenseChainNFT } from '@licensechain/nft-sdk';

describe('LicenseChain NFT SDK', () => {
  let nftSDK: LicenseChainNFT;
  let contract: LicenseNFTContract;

  beforeEach(async () => {
    nftSDK = new LicenseChainNFT({
      chain: 'ethereum',
      privateKey: process.env.PRIVATE_KEY
    });

    contract = await nftSDK.deployLicenseNFT({
      name: 'Test License NFT',
      symbol: 'TLN',
      baseURI: 'https://test.com/'
    });
  });

  it('should mint a license NFT', async () => {
    const licenseNFT = await contract.mintLicenseNFT({
      to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      tokenId: 1,
      metadata: {
        name: 'Test License',
        description: 'Test software license',
        image: 'https://test.com/image.png',
        attributes: [
          { trait_type: 'Software', value: 'Test App' },
          { trait_type: 'Version', value: '1.0.0' }
        ],
        license: {
          software: 'Test App',
          version: '1.0.0',
          features: ['basic']
        }
      }
    });

    expect(licenseNFT.tokenId).toBe(1);
    expect(licenseNFT.owner).toBe('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6');
  });
});
```

## 📦 Package Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "deploy:ethereum": "ts-node scripts/deploy-ethereum.ts",
    "deploy:polygon": "ts-node scripts/deploy-polygon.ts",
    "deploy:solana": "ts-node scripts/deploy-solana.ts"
  }
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/LicenseChain/LicenseChain-NFT-SDK.git
cd LicenseChain-NFT-SDK
npm install
npm run build
npm test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation](https://docs.licensechain.app/nft-sdk)
- [GitHub Repository](https://github.com/LicenseChain/LicenseChain-NFT-SDK)
- [NPM Package](https://www.npmjs.com/package/@licensechain/nft-sdk)
- [Discord Community](https://discord.gg/licensechain)
- [Twitter](https://twitter.com/licensechain)

## 🆘 Support

- 📧 Email: support@licensechain.app
- 💬 Discord: [LicenseChain Community](https://discord.gg/licensechain)
- 📖 Documentation: [docs.licensechain.app](https://docs.licensechain.app)
- 🐛 Issues: [GitHub Issues](https://github.com/LicenseChain/LicenseChain-NFT-SDK/issues)

---

**Built with ❤️ by the LicenseChain Team**
