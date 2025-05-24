const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
// Get market chart data for a coin from local files
router.get('/market-chart/:coinId', async (req, res, next) => {
  try {
    const { coinId } = req.params;
    
    // Map coinId to the corresponding test file
    const coinFiles = {
      'bitcoin': 'bitcoin.json',
      'ethereum': 'ethereum.json',
      'binancecoin': 'binancecoin.json',
    };

    const filename = coinFiles[coinId.toLowerCase()];
    if (!filename) {
      return res.status(404).json({ error: 'Coin not found in test data' });
    }

    const filePath = path.join(__dirname, '..', 'test', filename);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const jsonData = JSON.parse(fileContent);
      res.json(jsonData);
    } catch (error) {
      console.error(`Error reading file for ${coinId}:`, error);
      res.status(500).json({ error: 'Error reading test data' });
    }
  } catch (error) {
    console.error('Error in market chart endpoint:', error);
    next(error);
  }
});

// Get market data by type (topGainers, trending, newCoins)
router.get('/coins/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const { vs_currency = 'usd', per_page = 8, page = 1 } = req.query;

    let url = '';
    const baseUrl = 'https://api.coingecko.com/api/v3/coins/markets';

    switch (type) {
      case 'topGainers':
        url = `${baseUrl}?vs_currency=${vs_currency}&order=price_change_percentage_24h_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
        break;
      case 'trending':
        url = `${baseUrl}?vs_currency=${vs_currency}&order=market_cap_desc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
        break;
      case 'newCoins':
        url = `${baseUrl}?vs_currency=${vs_currency}&order=market_cap_asc&per_page=${per_page}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid type. Must be one of: topGainers, trending, newCoins' });
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching market data:', error);
    next(error);
  }
});

module.exports = router;
