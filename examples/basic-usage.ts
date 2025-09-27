import { LicenseChainNFT } from '../src/LicenseChainNFT';
import { 
  validateEthereumAddress, 
  validateTokenId, 
  generateTokenId,
  formatPrice,
  jsonSerialize
} from '../src/utils';

// Configure the SDK
const client = LicenseChainNFT.create('your-api-key-here', 'https://api.licensechain.app');

async function basicUsageExample() {
  console.log('🚀 LicenseChain NFT SDK - Basic Usage Example\n');

  try {
    // 1. NFT Management
    console.log('🎨 NFT Management:');
    
    // Create an NFT
    const nftMetadata = {
      name: 'My Awesome NFT',
      description: 'This is a unique digital artwork',
      image: 'https://example.com/image.png',
      external_url: 'https://example.com/nft/1',
      attributes: [
        { trait_type: 'Color', value: 'Blue' },
        { trait_type: 'Rarity', value: 'Legendary' },
        { trait_type: 'Power', value: 95, display_type: 'number' }
      ],
      background_color: '000000'
    };
    
    const nft = await client.getNFTs().create({
      contract_address: '0x1234567890123456789012345678901234567890',
      token_id: generateTokenId(),
      owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      metadata: nftMetadata,
      license_id: 'lic_123'
    });
    console.log(`✅ NFT created: ${nft.id}`);
    console.log(`   Token ID: ${nft.token_id}`);
    console.log(`   Owner: ${nft.owner}`);
    console.log(`   Status: ${nft.status}`);
    
    // Get NFT details
    const nftDetails = await client.getNFTs().get(nft.id);
    console.log(`\n🔍 NFT Details:`);
    console.log(`   Name: ${nftDetails.metadata.name}`);
    console.log(`   Description: ${nftDetails.metadata.description}`);
    console.log(`   Attributes: ${nftDetails.metadata.attributes?.length || 0}`);
    
    // List NFTs by owner
    const ownerNFTs = await client.getNFTs().getByOwner('0xabcdefabcdefabcdefabcdefabcdefabcdefabcd');
    console.log(`\n📋 Owner's NFTs: ${ownerNFTs.total} total`);
    
    // Get NFT statistics
    const nftStats = await client.getNFTs().stats();
    console.log('\n📊 NFT Statistics:');
    console.log(`   Total: ${nftStats.total}`);
    console.log(`   Active: ${nftStats.active}`);
    console.log(`   Burned: ${nftStats.burned}`);
    console.log(`   Total Value: $${nftStats.total_value}`);
    
    // 2. Collection Management
    console.log('\n📚 Collection Management:');
    
    // Create a collection
    const collection = await client.getNFTs().createCollection({
      name: 'My NFT Collection',
      symbol: 'MNC',
      description: 'A collection of unique digital artworks',
      contract_address: '0x1234567890123456789012345678901234567890',
      owner: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      total_supply: 10000,
      metadata: {
        image: 'https://example.com/collection.png',
        external_url: 'https://example.com/collection',
        background_color: 'ffffff'
      }
    });
    console.log(`✅ Collection created: ${collection.id}`);
    console.log(`   Name: ${collection.name}`);
    console.log(`   Symbol: ${collection.symbol}`);
    console.log(`   Total Supply: ${collection.total_supply}`);
    
    // Get collection statistics
    const collectionStats = await client.getNFTs().getCollectionStats(collection.id);
    console.log('\n📊 Collection Statistics:');
    console.log(`   Total: ${collectionStats.total}`);
    console.log(`   Total Supply: ${collectionStats.total_supply}`);
    console.log(`   Total Owners: ${collectionStats.total_owners}`);
    console.log(`   Floor Price: $${collectionStats.floor_price}`);
    
    // 3. Marketplace Management
    console.log('\n🛒 Marketplace Management:');
    
    // Create a listing
    const listing = await client.getMarketplace().createListing({
      nft_id: nft.id,
      seller: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      price: 1.5,
      currency: 'ETH',
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    console.log(`✅ Listing created: ${listing.id}`);
    console.log(`   Price: ${formatPrice(listing.price, listing.currency)}`);
    console.log(`   Status: ${listing.status}`);
    
    // List active listings
    const activeListings = await client.getMarketplace().listListings({
      status: 'active',
      page: 1,
      limit: 10
    });
    console.log(`\n📋 Active Listings: ${activeListings.total} total`);
    
    // Get marketplace statistics
    const marketplaceStats = await client.getMarketplace().getMarketplaceStats();
    console.log('\n📊 Marketplace Statistics:');
    console.log(`   Total Listings: ${marketplaceStats.total_listings}`);
    console.log(`   Active Listings: ${marketplaceStats.active_listings}`);
    console.log(`   Sold Listings: ${marketplaceStats.sold_listings}`);
    console.log(`   Total Volume: $${marketplaceStats.total_volume}`);
    console.log(`   Average Price: $${marketplaceStats.average_price}`);
    
    // 4. Sales and Transfers
    console.log('\n💰 Sales and Transfers:');
    
    // Get recent sales
    const recentSales = await client.getMarketplace().getSales({
      page: 1,
      limit: 5
    });
    console.log(`📈 Recent Sales: ${recentSales.total} total`);
    
    // Get sales statistics
    const saleStats = await client.getMarketplace().getSaleStats();
    console.log('\n📊 Sales Statistics:');
    console.log(`   Total Sales: ${saleStats.total_sales}`);
    console.log(`   Total Volume: $${saleStats.total_volume}`);
    console.log(`   Average Price: $${saleStats.average_price}`);
    console.log(`   Unique Buyers: ${saleStats.unique_buyers}`);
    console.log(`   Unique Sellers: ${saleStats.unique_sellers}`);
    
    // Get recent transfers
    const recentTransfers = await client.getMarketplace().getTransfers({
      page: 1,
      limit: 5
    });
    console.log(`\n🔄 Recent Transfers: ${recentTransfers.total} total`);
    
    // 5. Utility Functions
    console.log('\n🛠️ Utility Functions:');
    
    // Address validation
    const address = '0x1234567890123456789012345678901234567890';
    console.log(`Address '${address}' is valid: ${validateEthereumAddress(address)}`);
    
    // Token ID validation
    const tokenId = generateTokenId();
    console.log(`Token ID '${tokenId}' is valid: ${validateTokenId(tokenId)}`);
    
    // Price formatting
    const price = 1.23456789;
    const currency = 'ETH';
    console.log(`Formatted price: ${formatPrice(price, currency)}`);
    
    // 6. Error Handling
    console.log('\n🛡️ Error Handling:');
    
    try {
      await client.getNFTs().get('invalid-id');
    } catch (error) {
      console.log(`✅ Caught expected error: ${error}`);
    }
    
    try {
      await client.getMarketplace().createListing({
        nft_id: 'invalid-id',
        seller: 'invalid-address',
        price: -1,
        currency: 'ETH'
      });
    } catch (error) {
      console.log(`✅ Caught expected error: ${error}`);
    }
    
    console.log('\n✅ Basic usage example completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    if (process.env.DEBUG) {
      console.error('Stack trace:', error);
    }
  }
}

// Run the example
if (require.main === module) {
  basicUsageExample();
}

export { basicUsageExample };
