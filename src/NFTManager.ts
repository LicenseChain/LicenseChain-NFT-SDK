import { 
  NFT, 
  CreateNFTRequest, 
  UpdateNFTRequest, 
  NFTListResponse, 
  NFTStats,
  NFTCollection,
  CreateCollectionRequest,
  CollectionListResponse,
  CollectionStats,
  PaginationOptions,
  FilterOptions,
  SortOptions
} from './types';
import { 
  validateEthereumAddress, 
  validateTokenId, 
  validateMetadata, 
  retryWithBackoff,
  jsonSerialize,
  jsonDeserialize
} from './utils';
import { 
  NetworkError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError, 
  RateLimitError, 
  ServerError,
  NFTError
} from './errors';

export class NFTManager {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private retries: number;

  constructor(apiKey: string, baseUrl: string, timeout: number, retries: number) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeout = timeout;
    this.retries = retries;
  }

  async create(request: CreateNFTRequest): Promise<NFT> {
    this.validateCreateRequest(request);
    
    const data = {
      contract_address: request.contract_address,
      token_id: request.token_id,
      owner: request.owner,
      metadata: request.metadata,
      license_id: request.license_id
    };
    
    const response = await this.makeRequest<{ data: NFT }>('POST', '/nfts', data);
    return response.data;
  }

  async get(nftId: string): Promise<NFT> {
    this.validateId(nftId, 'nft_id');
    
    const response = await this.makeRequest<{ data: NFT }>('GET', `/nfts/${nftId}`);
    return response.data;
  }

  async update(nftId: string, updates: UpdateNFTRequest): Promise<NFT> {
    this.validateId(nftId, 'nft_id');
    
    const response = await this.makeRequest<{ data: NFT }>('PUT', `/nfts/${nftId}`, updates);
    return response.data;
  }

  async delete(nftId: string): Promise<void> {
    this.validateId(nftId, 'nft_id');
    
    await this.makeRequest('DELETE', `/nfts/${nftId}`);
  }

  async list(options?: PaginationOptions & FilterOptions & SortOptions): Promise<NFTListResponse> {
    const params = this.buildQueryParams(options);
    
    const response = await this.makeRequest<NFTListResponse>('GET', '/nfts', undefined, params);
    return response;
  }

  async getByOwner(owner: string, options?: PaginationOptions): Promise<NFTListResponse> {
    this.validateEthereumAddress(owner, 'owner');
    
    const params = this.buildQueryParams({ ...options, owner });
    
    const response = await this.makeRequest<NFTListResponse>('GET', '/nfts', undefined, params);
    return response;
  }

  async getByContract(contractAddress: string, options?: PaginationOptions): Promise<NFTListResponse> {
    this.validateEthereumAddress(contractAddress, 'contract_address');
    
    const params = this.buildQueryParams({ ...options, contract_address: contractAddress });
    
    const response = await this.makeRequest<NFTListResponse>('GET', '/nfts', undefined, params);
    return response;
  }

  async stats(): Promise<NFTStats> {
    const response = await this.makeRequest<{ data: NFTStats }>('GET', '/nfts/stats');
    return response.data;
  }

  async createCollection(request: CreateCollectionRequest): Promise<NFTCollection> {
    this.validateCreateCollectionRequest(request);
    
    const response = await this.makeRequest<{ data: NFTCollection }>('POST', '/collections', request);
    return response.data;
  }

  async getCollection(collectionId: string): Promise<NFTCollection> {
    this.validateId(collectionId, 'collection_id');
    
    const response = await this.makeRequest<{ data: NFTCollection }>('GET', `/collections/${collectionId}`);
    return response.data;
  }

  async listCollections(options?: PaginationOptions): Promise<CollectionListResponse> {
    const params = this.buildQueryParams(options);
    
    const response = await this.makeRequest<CollectionListResponse>('GET', '/collections', undefined, params);
    return response;
  }

  async getCollectionStats(collectionId: string): Promise<CollectionStats> {
    this.validateId(collectionId, 'collection_id');
    
    const response = await this.makeRequest<{ data: CollectionStats }>('GET', `/collections/${collectionId}/stats`);
    return response.data;
  }

  private async makeRequest<T>(
    method: string, 
    endpoint: string, 
    data?: any, 
    params?: Record<string, any>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    const requestOptions = this.buildRequestOptions(method, data);

    return retryWithBackoff(async () => {
      return this.sendRequest<T>(url, requestOptions);
    }, this.retries);
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    let url = `${this.baseUrl}${endpoint}`;
    
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  private buildRequestOptions(method: string, data?: any): RequestInit {
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-API-Version': '1.0',
        'X-Platform': 'nft-sdk',
        'User-Agent': 'LicenseChain-NFT-SDK/1.0.0'
      }
    };

    if (data) {
      options.body = jsonSerialize(data);
    }

    return options;
  }

  private async sendRequest<T>(url: string, options: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(this.timeout)
      });

      if (response.ok) {
        const text = await response.text();
        return text ? jsonDeserialize(text) : {} as T;
      }

      const errorText = await response.text();
      let errorMessage = 'Unknown error';
      
      try {
        const errorData = jsonDeserialize(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      this.handleHttpError(response.status, errorMessage);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new NetworkError('Request timeout');
        }
        throw new NetworkError(error.message);
      }
      throw error;
    }
  }

  private handleHttpError(statusCode: number, message: string): never {
    switch (statusCode) {
      case 400:
        throw new ValidationError(`Bad Request: ${message}`);
      case 401:
        throw new AuthenticationError(`Unauthorized: ${message}`);
      case 403:
        throw new AuthenticationError(`Forbidden: ${message}`);
      case 404:
        throw new NotFoundError(`Not Found: ${message}`);
      case 429:
        throw new RateLimitError(`Rate Limited: ${message}`);
      case 500:
      case 502:
      case 503:
      case 504:
        throw new ServerError(`Server Error: ${message}`);
      default:
        throw new ServerError(`Unexpected response: ${statusCode} ${message}`);
    }
  }

  private validateCreateRequest(request: CreateNFTRequest): void {
    this.validateEthereumAddress(request.contract_address, 'contract_address');
    this.validateTokenId(request.token_id, 'token_id');
    this.validateEthereumAddress(request.owner, 'owner');
    
    if (!validateMetadata(request.metadata)) {
      throw new ValidationError('Invalid metadata format');
    }
  }

  private validateCreateCollectionRequest(request: CreateCollectionRequest): void {
    if (!request.name || !request.name.trim()) {
      throw new ValidationError('Collection name is required');
    }
    if (!request.symbol || !request.symbol.trim()) {
      throw new ValidationError('Collection symbol is required');
    }
    if (!request.description || !request.description.trim()) {
      throw new ValidationError('Collection description is required');
    }
    this.validateEthereumAddress(request.contract_address, 'contract_address');
    this.validateEthereumAddress(request.owner, 'owner');
    
    if (request.total_supply <= 0) {
      throw new ValidationError('Total supply must be positive');
    }
  }

  private validateEthereumAddress(address: string, fieldName: string): void {
    if (!validateEthereumAddress(address)) {
      throw new ValidationError(`Invalid ${fieldName} format`);
    }
  }

  private validateTokenId(tokenId: string, fieldName: string): void {
    if (!validateTokenId(tokenId)) {
      throw new ValidationError(`Invalid ${fieldName} format`);
    }
  }

  private validateId(id: string, fieldName: string): void {
    if (!id || !id.trim()) {
      throw new ValidationError(`${fieldName} is required`);
    }
  }

  private buildQueryParams(options?: any): Record<string, any> {
    if (!options) return {};
    
    const params: Record<string, any> = {};
    
    if (options.page) params.page = options.page;
    if (options.limit) params.limit = options.limit;
    if (options.owner) params.owner = options.owner;
    if (options.contract_address) params.contract_address = options.contract_address;
    if (options.status) params.status = options.status;
    if (options.min_price) params.min_price = options.min_price;
    if (options.max_price) params.max_price = options.max_price;
    if (options.currency) params.currency = options.currency;
    if (options.created_after) params.created_after = options.created_after;
    if (options.created_before) params.created_before = options.created_before;
    if (options.field) params.sort_field = options.field;
    if (options.direction) params.sort_direction = options.direction;
    
    return params;
  }
}
