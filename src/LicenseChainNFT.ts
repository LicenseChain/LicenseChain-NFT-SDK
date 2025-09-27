import { ConfigurationOptions } from './types';
import { NFTManager } from './NFTManager';
import { MarketplaceManager } from './MarketplaceManager';
import { ConfigurationException } from './errors';

export class LicenseChainNFT {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private nftManager: NFTManager;
  private marketplaceManager: MarketplaceManager;

  constructor(options: ConfigurationOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || 'https://api.licensechain.app';
    this.timeout = options.timeout || 30000;
    this.retries = options.retries || 3;

    if (!this.apiKey) {
      throw new ConfigurationException('API key is required');
    }

    this.nftManager = new NFTManager(this.apiKey, this.baseUrl, this.timeout, this.retries);
    this.marketplaceManager = new MarketplaceManager(this.apiKey, this.baseUrl, this.timeout, this.retries);
  }

  getNFTs() {
    return this.nftManager;
  }

  getMarketplace() {
    return this.marketplaceManager;
  }

  static create(apiKey: string, baseUrl?: string): LicenseChainNFT {
    return new LicenseChainNFT({
      apiKey,
      baseUrl: baseUrl || 'https://api.licensechain.app'
    });
  }

  static fromEnvironment(): LicenseChainNFT {
    return new LicenseChainNFT({
      apiKey: process.env.LICENSECHAIN_API_KEY || '',
      baseUrl: process.env.LICENSECHAIN_BASE_URL || 'https://api.licensechain.app'
    });
  }
}
