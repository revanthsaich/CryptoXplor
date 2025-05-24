const express = require('express');
const router = express.Router();
const https = require('https');
const fs = require('fs').promises;
const path = require('path');

// In-memory cache
const cache = new Map();
const CACHE_DIR = path.join(__dirname, '..', 'cache');

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Save data to cache file
async function saveToCache(key, data) {
  try {
    await ensureCacheDir();
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    await fs.writeFile(filePath, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (err) {
    console.error('Error saving to cache:', err);
  }
}

// Get data from cache file
async function getFromCache(key) {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data).data;
  } catch (err) {
    return null;
  }
}

// Get coin data by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const currency = req.query.currency?.toLowerCase() || 'usd';
    const cacheKey = `coin_${id}_${currency}`;
    
    // Try to get from cache first
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Fetch coin data from CoinGecko API using https
    const coinData = await new Promise((resolve, reject) => {
      const url = `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
      
      https.get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP error! status: ${res.statusCode}`));
          return;
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', (e) => {
        reject(e);
      });
    });
    
    // Return only the necessary data
    const responseData = {
      id: coinData.id,
      symbol: coinData.symbol,
      name: coinData.name,
      image: coinData.image,
      market_data: {
        current_price: {
          [currency]: coinData.market_data.current_price[currency] || 0
        },
        price_change_percentage_24h: coinData.market_data.price_change_percentage_24h || 0,
        market_cap: {
          [currency]: coinData.market_data.market_cap[currency] || 0
        },
        total_volume: {
          [currency]: coinData.market_data.total_volume[currency] || 0
        }
      }
    };
    
    // Save to cache
    await saveToCache(`coin_${id}_${currency}`, responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching coin data:', error);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Coin not found' });
    }
    next(error);
  }
});

// Get market chart data for a coin
router.get('/:id/market-chart', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { vs_currency = 'usd', days = '7' } = req.query;
    const cacheKey = `chart_${id}_${vs_currency}_${days}`;
    
    // Try to get from cache first
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }
    
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${vs_currency}&days=${days}`;
    
    const chartData = await new Promise((resolve, reject) => {
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP error! status: ${response.statusCode}`));
          return;
        }

        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', (e) => {
        reject(e);
      });
    });
    
    res.json(chartData);
  } catch (error) {
    console.error('Error fetching market chart data:', error);
    next(error);
  }
});

module.exports = router;
