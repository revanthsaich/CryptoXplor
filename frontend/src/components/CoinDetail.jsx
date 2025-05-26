import React, { useState,useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ChartDisplay from "./ChartDisplay";
import { ChartContainer } from "./ui/chart";
import {
  GlobeIcon
} from "lucide-react";
import OrderForm from './OrderForm';
import OrderHistory from './OrderHistory';
import { useAuth } from '@clerk/clerk-react';
import Loader from './Loader';
import data from './test/bitcoindata.json';
import chartJson from './test/bitcoinchart.json';
import { useOrders } from '../contexts/OrderContext';

const supportedCurrencies = [
  "usd", "inr", "aed", "eur", "btc", "eth", "bnb", "xrp", "jpy", "gbp", "cny", "cad",
  "aud", "zar", "rub", "try", "brl", "mxn", "sgd", "myr", "php", "vnd", "thb", "idr"
];

function CoinDetail() {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [selectedRange, setSelectedRange] = useState("1d");
  const { userId, isLoaded } = useAuth();
  const { orders: allOrders } = useOrders();
  
  // Filter orders for the current coin only
  const coinOrders = useMemo(() => {
    return allOrders.filter(order => order.coinId === coinId);
  }, [allOrders, coinId]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!userId) return <div>Please log in to view this page</div>;

  const timeRanges = {
    "1d": { label: "1 Day", days: 1 },
    "7d": { label: "7 Days", days: 7 },
    "4w": { label: "4 Weeks", days: 28 },
    "30d": { label: "30 Days", days: 30 }
  };

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        // Fetch basic coin info from backend
        const res = await fetch(
          `http://localhost:5000/coins/${coinId}?currency=${selectedCurrency}`
        );
        if (!res.ok) throw new Error('Failed to fetch coin data');
        const data = await res.json();
        console.log(data);

        // Fetch market chart data from backend
        const chartRes = await fetch(
          `http://localhost:5000/coins/${coinId}/market-chart?vs_currency=${selectedCurrency}&days=${timeRanges[selectedRange].days}`
        );
        if (!chartRes.ok) throw new Error('Failed to fetch chart data');
        const chartJson = await chartRes.json();

        // Process price data into candlestick format
        const prices = chartJson.prices || [];
        const chartData = [];

        // Determine interval based on selected range
        const intervals = {
          "1d": 60 * 60,    // 1 hour
          "7d": 2 * 60 * 60, // 2 hours
          "4w": 6 * 60 * 60, // 6 hours
          "30d": 24 * 60 * 60 // 24 hours (daily)
        };
        const interval = intervals[selectedRange] || 60 * 60;

        // Group data by interval for candlesticks
        let currentInterval = null;
        let intervalData = null;

        for (let i = 0; i < prices.length; i++) {
          const timestamp = Math.floor(prices[i][0] / 1000);
          const price = prices[i][1];
          const intervalTimestamp = Math.floor(timestamp / interval) * interval;

          if (intervalTimestamp !== currentInterval) {
            if (intervalData) {
              chartData.push({
                time: intervalData.openTime,
                open: intervalData.open,
                high: intervalData.high,
                low: intervalData.low,
                close: intervalData.close
              });
            }
            currentInterval = intervalTimestamp;
            intervalData = {
              openTime: timestamp,
              open: price,
              high: price,
              low: price,
              close: price
            };
          } else {
            intervalData.high = Math.max(intervalData.high, price);
            intervalData.low = Math.min(intervalData.low, price);
            intervalData.close = price;
          }
        }

        // Add last interval's data
        if (intervalData) {
          chartData.push({
            time: intervalData.openTime,
            open: intervalData.open,
            high: intervalData.high,
            low: intervalData.low,
            close: intervalData.close
          });
        }

        setCoin({ ...data, chart: chartData });
      } catch (error) {
        console.error("Error fetching coin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [coinId, selectedCurrency, selectedRange]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Loader size="lg" className="mb-2" />
      <p className="text-center">Loading...</p>
    </div>
  );
  if (!coin) return <div className="p-4 text-center">Coin not found</div>;

  const { name, symbol, image, market_data, description } = coin;

  const price = market_data?.current_price?.[selectedCurrency];
  const high = market_data?.high_24h?.[selectedCurrency];
  const low = market_data?.low_24h?.[selectedCurrency];
  const marketCap = market_data?.market_cap?.[selectedCurrency];
  const totalVolume = market_data?.total_volume?.[selectedCurrency];

  return (
    <div className="p-4 space-y-4 w-full h-[100vh] mt-[2rem] overflow-y-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <img src={image?.small} alt={name} className="w-8 h-8 rounded-full" />
          <h2 className="text-lg font-semibold">
            {name} ({symbol?.toUpperCase()})
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="bg-primary/10 dark:bg-primary/20 border-primary/50 dark:border-primary/30 px-2 py-1 rounded-lg text-xs focus:ring-2 focus:ring-primary/50 focus:border-primary/70 transition-colors duration-200
                     [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-400/50 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {supportedCurrencies.map((currency) => (
              <option key={currency} value={currency} className="bg-white dark:bg-slate-900">
                {currency.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="rounded-2xl border-primary/50 dark:border-primary/30 bg-white dark:bg-slate-900 p-5 shadow-sm w-full">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Current Price</p>
            <h2 className="text-3xl font-bold text-primary">
              {price?.toLocaleString()} {selectedCurrency.toUpperCase()}
            </h2>
          </div>
          <div className="flex flex-wrap gap-6 text-sm md:text-base">
            <div className="space-y-1">
              <p className="text-muted-foreground">24h High</p>
              <p className="text-green-500">
                {high?.toLocaleString()} {selectedCurrency.toUpperCase()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">24h Low</p>
              <p className="text-red-500">
                {low?.toLocaleString()} {selectedCurrency.toUpperCase()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Market Cap</p>
              <p className="text-muted-foreground/90">
                {marketCap?.toLocaleString()} {selectedCurrency.toUpperCase()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Total Volume</p>
              <p className="text-muted-foreground/90">
                {totalVolume?.toLocaleString()} {selectedCurrency.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Website Link Section */}
      {coin?.links?.homepage?.[0] && (
        <div className="rounded-2xl border-primary/50 dark:border-primary/30 bg-white dark:bg-slate-900 p-5 shadow-sm w-full">
          <a
            href={coin.links.homepage[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-40 gap-2 p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 group"
          >
            <GlobeIcon className="w-5 h-5 text-primary group-hover:text-primary/80" />
            <span className="text-sm text-muted-foreground group-hover:text-primary">Visit Website</span>
          </a>
        </div>
      )}

      <div className="flex justify-center items-center my-6 flex-col gap-4">
        <div className="flex gap-2">
          {Object.entries(timeRanges).map(([key, range]) => (
            <button
              key={key}
              onClick={() => setSelectedRange(key)}
              className={`px-4 py-2 rounded-lg ${
                selectedRange === key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-500 text-white hover:bg-gray-300"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
        <ChartContainer
          className="w-[80vw] h-[50vh] p-4"
        >
          <ChartDisplay data={coin.chart} selectedRange={selectedRange} />
        </ChartContainer>
      </div>



      <div className="prose max-w-none dark:prose-invert">
        <h2 className="text-xl font-medium">About {name}</h2>
        <p
          dangerouslySetInnerHTML={{
            __html:
              description?.en?.split(". ").slice(0, 2).join(". ") + ".",
          }}
        />
      </div>

      <OrderForm
        coinId={coinId}
        price={price}
        symbol={symbol}
        selectedCurrency={selectedCurrency}
        userId={userId}
      />

      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Order History for {name}</h2>
        <OrderHistory
          price={price}
          selectedCurrency={selectedCurrency}
          symbol={symbol}
          userId={userId}
          orders={coinOrders}
        />
      </div>
    </div>
  );
}

export default CoinDetail;