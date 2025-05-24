const fs = require('fs').promises;
const path = require('path');

// Function to generate sample price data
function generatePriceData(days, basePrice, volatility) {
  const prices = [];
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  for (let i = days - 1; i >= 0; i--) {
    const timestamp = now - (i * dayInMs);
    // Add some randomness to the price
    const price = basePrice * (1 + (Math.random() - 0.5) * volatility);
    prices.push([timestamp, price]);
  }
  
  return prices;
}

// Sample data for different coins
const testData = {
  bitcoin: {
    prices: generatePriceData(7, 60000, 0.03), // $60k base price, 3% volatility
    market_caps: [],
    total_volumes: []
  },
  ethereum: {
    prices: generatePriceData(7, 3000, 0.04), // $3k base price, 4% volatility
    market_caps: [],
    total_volumes: []
  },
  binancecoin: {
    prices: generatePriceData(7, 500, 0.05), // $500 base price, 5% volatility
    market_caps: [],
    total_volumes: []
  }
};

// Create test directory if it doesn't exist
async function setupTestData() {
  const testDir = path.join(__dirname, 'test');
  try {
    await fs.mkdir(testDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
  
  // Write test data files
  for (const [coin, data] of Object.entries(testData)) {
    const filePath = path.join(testDir, `${coin}.json`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    console.log(`Generated test data for ${coin} at ${filePath}`);
  }
}

// Run the setup
setupTestData().catch(console.error);
