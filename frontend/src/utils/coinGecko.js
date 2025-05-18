// utils/coinGecko.js

const API_BASE = "https://api.coingecko.com/api/v3/coins/markets";
const VS_CURRENCY = "usd";

export async function fetchCoins(type) {
  let url = "";

  if (type === "topGainers") {
    url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=price_change_percentage_24h_desc&per_page=6&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
  } else if (type === "trending") {
    url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=market_cap_desc&per_page=6&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
  } else if (type === "newCoins") {
    url = `${API_BASE}?vs_currency=${VS_CURRENCY}&order=market_cap_asc&per_page=6&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;
  } else {
    throw new Error("Unknown type for fetching coins");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch coins");
  }
  const data = await response.json();
  return data;
}
