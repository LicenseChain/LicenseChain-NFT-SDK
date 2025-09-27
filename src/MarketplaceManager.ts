import { 
  MarketplaceListing, 
  CreateListingRequest, 
  UpdateListingRequest, 
  ListingListResponse, 
  MarketplaceStats,
  NFTSale,
  SaleListResponse,
  SaleStats,
  NFTTransfer,
  TransferListResponse,
  PaginationOptions,
  FilterOptions,
  SortOptions
} from './types';
import { 
  validateEthereumAddress, 
  validatePositive, 
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
  MarketplaceError
} from './errors';

export class MarketplaceManager {
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

  async createListing(request: CreateListingRequest): Promise<MarketplaceListing> {
    this.validateCreateListingRequest(request);
    
    const response = await this.makeRequest<{ data: MarketplaceListing }>('POST', '/marketplace/listings', request);
    return response.data;
  }

  async getListing(listingId: string): Promise<MarketplaceListing> {
    this.validateId(listingId, 'listing_id');
    
    const response = await this.makeRequest<{ data: MarketplaceListing }>('GET', `/marketplace/listings/${listingId}`);
    return response.data;
  }

  async updateListing(listingId: string, updates: UpdateListingRequest): Promise<MarketplaceListing> {
    this.validateId(listingId, 'listing_id');
    
    const response = await this.makeRequest<{ data: MarketplaceListing }>('PUT', `/marketplace/listings/${listingId}`, updates);
    return response.data;
  }

  async deleteListing(listingId: string): Promise<void> {
    this.validateId(listingId, 'listing_id');
    
    await this.makeRequest('DELETE', `/marketplace/listings/${listingId}`);
  }

  async listListings(options?: PaginationOptions & FilterOptions & SortOptions): Promise<ListingListResponse> {
    const params = this.buildQueryParams(options);
    
    const response = await this.makeRequest<ListingListResponse>('GET', '/marketplace/listings', undefined, params);
    return response;
  }

  async getListingsBySeller(seller: string, options?: PaginationOptions): Promise<ListingListResponse> {
    this.validateEthereumAddress(seller, 'seller');
    
    const params = this.buildQueryParams({ ...options, seller });
    
    const response = await this.makeRequest<ListingListResponse>('GET', '/marketplace/listings', undefined, params);
    return response;
  }

  async getListingsByNFT(nftId: string, options?: PaginationOptions): Promise<ListingListResponse> {
    this.validateId(nftId, 'nft_id');
    
    const params = this.buildQueryParams({ ...options, nft_id: nftId });
    
    const response = await this.makeRequest<ListingListResponse>('GET', '/marketplace/listings', undefined, params);
    return response;
  }

  async buyNFT(listingId: string, buyer: string): Promise<NFTSale> {
    this.validateId(listingId, 'listing_id');
    this.validateEthereumAddress(buyer, 'buyer');
    
    const response = await this.makeRequest<{ data: NFTSale }>('POST', `/marketplace/listings/${listingId}/buy`, { buyer });
    return response.data;
  }

  async cancelListing(listingId: string): Promise<void> {
    this.validateId(listingId, 'listing_id');
    
    await this.makeRequest('POST', `/marketplace/listings/${listingId}/cancel`);
  }

  async getSales(options?: PaginationOptions & FilterOptions): Promise<SaleListResponse> {
    const params = this.buildQueryParams(options);
    
    const response = await this.makeRequest<SaleListResponse>('GET', '/marketplace/sales', undefined, params);
    return response;
  }

  async getSalesByNFT(nftId: string, options?: PaginationOptions): Promise<SaleListResponse> {
    this.validateId(nftId, 'nft_id');
    
    const params = this.buildQueryParams({ ...options, nft_id: nftId });
    
    const response = await this.makeRequest<SaleListResponse>('GET', '/marketplace/sales', undefined, params);
    return response;
  }

  async getSalesByBuyer(buyer: string, options?: PaginationOptions): Promise<SaleListResponse> {
    this.validateEthereumAddress(buyer, 'buyer');
    
    const params = this.buildQueryParams({ ...options, buyer });
    
    const response = await this.makeRequest<SaleListResponse>('GET', '/marketplace/sales', undefined, params);
    return response;
  }

  async getSalesBySeller(seller: string, options?: PaginationOptions): Promise<SaleListResponse> {
    this.validateEthereumAddress(seller, 'seller');
    
    const params = this.buildQueryParams({ ...options, seller });
    
    const response = await this.makeRequest<SaleListResponse>('GET', '/marketplace/sales', undefined, params);
    return response;
  }

  async getTransfers(options?: PaginationOptions & FilterOptions): Promise<TransferListResponse> {
    const params = this.buildQueryParams(options);
    
    const response = await this.makeRequest<TransferListResponse>('GET', '/marketplace/transfers', undefined, params);
    return response;
  }

  async getTransfersByNFT(nftId: string, options?: PaginationOptions): Promise<TransferListResponse> {
    this.validateId(nftId, 'nft_id');
    
    const params = this.buildQueryParams({ ...options, nft_id: nftId });
    
    const response = await this.makeRequest<TransferListResponse>('GET', '/marketplace/transfers', undefined, params);
    return response;
  }

  async getTransfersByUser(user: string, options?: PaginationOptions): Promise<TransferListResponse> {
    this.validateEthereumAddress(user, 'user');
    
    const params = this.buildQueryParams({ ...options, user });
    
    const response = await this.makeRequest<TransferListResponse>('GET', '/marketplace/transfers', undefined, params);
    return response;
  }

  async getMarketplaceStats(): Promise<MarketplaceStats> {
    const response = await this.makeRequest<{ data: MarketplaceStats }>('GET', '/marketplace/stats');
    return response.data;
  }

  async getSaleStats(): Promise<SaleStats> {
    const response = await this.makeRequest<{ data: SaleStats }>('GET', '/marketplace/sales/stats');
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

  private validateCreateListingRequest(request: CreateListingRequest): void {
    this.validateId(request.nft_id, 'nft_id');
    this.validateEthereumAddress(request.seller, 'seller');
    validatePositive(request.price, 'price');
    
    if (!request.currency || !request.currency.trim()) {
      throw new ValidationError('Currency is required');
    }
  }

  private validateEthereumAddress(address: string, fieldName: string): void {
    if (!validateEthereumAddress(address)) {
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
    if (options.seller) params.seller = options.seller;
    if (options.buyer) params.buyer = options.buyer;
    if (options.nft_id) params.nft_id = options.nft_id;
    if (options.user) params.user = options.user;
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
