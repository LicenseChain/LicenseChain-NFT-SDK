export class LicenseChainNFTError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'LicenseChainNFTError';
  }
}

export class NetworkError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class NotFoundError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

export class ServerError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

export class NFTError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'NFT_ERROR');
    this.name = 'NFTError';
  }
}

export class MarketplaceError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'MARKETPLACE_ERROR');
    this.name = 'MarketplaceError';
  }
}

export class CollectionError extends LicenseChainNFTError {
  constructor(message: string) {
    super(message, 'COLLECTION_ERROR');
    this.name = 'CollectionError';
  }
}
