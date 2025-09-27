export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: NFTAttribute[];
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
  max_value?: number;
  trait_count?: number;
}

export interface NFT {
  id: string;
  token_id: string;
  contract_address: string;
  owner: string;
  metadata: NFTMetadata;
  created_at: string;
  updated_at: string;
  license_id?: string;
  status: 'active' | 'inactive' | 'burned' | 'transferred';
}

export interface CreateNFTRequest {
  contract_address: string;
  token_id: string;
  owner: string;
  metadata: NFTMetadata;
  license_id?: string;
}

export interface UpdateNFTRequest {
  owner?: string;
  metadata?: Partial<NFTMetadata>;
  license_id?: string;
  status?: 'active' | 'inactive' | 'burned' | 'transferred';
}

export interface NFTListResponse {
  data: NFT[];
  total: number;
  page: number;
  limit: number;
}

export interface NFTStats {
  total: number;
  active: number;
  burned: number;
  transferred: number;
  total_value: number;
}

export interface MarketplaceListing {
  id: string;
  nft_id: string;
  seller: string;
  price: number;
  currency: string;
  status: 'active' | 'sold' | 'cancelled';
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface CreateListingRequest {
  nft_id: string;
  seller: string;
  price: number;
  currency: string;
  expires_at?: string;
}

export interface UpdateListingRequest {
  price?: number;
  currency?: string;
  status?: 'active' | 'sold' | 'cancelled';
  expires_at?: string;
}

export interface ListingListResponse {
  data: MarketplaceListing[];
  total: number;
  page: number;
  limit: number;
}

export interface MarketplaceStats {
  total_listings: number;
  active_listings: number;
  sold_listings: number;
  total_volume: number;
  average_price: number;
}

export interface NFTCollection {
  id: string;
  name: string;
  symbol: string;
  description: string;
  contract_address: string;
  owner: string;
  total_supply: number;
  created_at: string;
  updated_at: string;
  metadata: {
    image: string;
    external_url?: string;
    background_color?: string;
  };
}

export interface CreateCollectionRequest {
  name: string;
  symbol: string;
  description: string;
  contract_address: string;
  owner: string;
  total_supply: number;
  metadata: {
    image: string;
    external_url?: string;
    background_color?: string;
  };
}

export interface CollectionListResponse {
  data: NFTCollection[];
  total: number;
  page: number;
  limit: number;
}

export interface CollectionStats {
  total: number;
  total_supply: number;
  total_owners: number;
  floor_price: number;
  total_volume: number;
}

export interface NFTSale {
  id: string;
  nft_id: string;
  seller: string;
  buyer: string;
  price: number;
  currency: string;
  transaction_hash: string;
  created_at: string;
}

export interface SaleListResponse {
  data: NFTSale[];
  total: number;
  page: number;
  limit: number;
}

export interface SaleStats {
  total_sales: number;
  total_volume: number;
  average_price: number;
  unique_buyers: number;
  unique_sellers: number;
}

export interface NFTTransfer {
  id: string;
  nft_id: string;
  from: string;
  to: string;
  transaction_hash: string;
  created_at: string;
}

export interface TransferListResponse {
  data: NFTTransfer[];
  total: number;
  page: number;
  limit: number;
}

export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  signature: string;
}

export interface ConfigurationOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface FilterOptions {
  owner?: string;
  contract_address?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  currency?: string;
  created_after?: string;
  created_before?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchOptions {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
}
