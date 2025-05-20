import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ChartDisplay from "./ChartDisplay";
import { ChartContainer } from "./ui/chart";

const supportedCurrencies = [
  "usd", "inr", "aed", "eur", "btc", "eth", "bnb", "xrp", "jpy", "gbp", "cny", "cad",
  "aud", "zar", "rub", "try", "brl", "mxn", "sgd", "myr", "php", "vnd", "thb", "idr"
];

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function CoinDetail() {
  const { coinId } = useParams();
  const [searchParams] = useSearchParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        const data = await res.json();

        const chartRes = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${selectedCurrency}&days=1`
        );
        const chartJson = await chartRes.json();

        const chartData = (chartJson.prices || []).map((p, i, arr) => {
          const timestamp = Math.floor(p[0] / 1000);
          const price = p[1];
          const open = i === 0 ? price : arr[i - 1][1];
          const close = price;
          const high = Math.max(open, close) + Math.random(); // simulate
          const low = Math.min(open, close) - Math.random();  // simulate
        
          return {
            time: timestamp,
            open,
            high,
            low,
            close,
          };
        });
        

        setCoin({ ...data, chart: chartData });
      } catch (error) {
        console.error("Error fetching coin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoin();
  }, [coinId, selectedCurrency]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!coin) return <div className="p-4 text-center">Coin not found</div>;

  const { name, symbol, image, market_data, description } = coin;

  const price = market_data?.current_price?.[selectedCurrency];
  const high = market_data?.high_24h?.[selectedCurrency];
  const low = market_data?.low_24h?.[selectedCurrency];
  const marketCap = market_data?.market_cap?.[selectedCurrency];
  const totalVolume = market_data?.total_volume?.[selectedCurrency];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src={image?.small} alt={name} className="w-10 h-10" />
          <h1 className="text-2xl font-semibold">
            {name} ({symbol?.toUpperCase()})
          </h1>
        </div>
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="border p-2 rounded"
        >
          {supportedCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border bg-white dark:bg-black p-5 shadow-sm w-full">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Current Price</p>
            <h2 className="text-3xl font-bold text-blue-500">
              {price?.toLocaleString()} {selectedCurrency.toUpperCase()}
            </h2>
          </div>
          <div className="flex flex-wrap gap-6 text-sm md:text-base">
            <div>
              <p className="text-muted-foreground mb-1">24h High</p>
              <p className="text-green-500">
                {high?.toLocaleString()} {selectedCurrency.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">24h Low</p>
              <p className="text-red-500">
                {low?.toLocaleString()} {selectedCurrency.toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Market Cap</p>
              <p>{marketCap?.toLocaleString()} {selectedCurrency.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Total Volume</p>
              <p>{totalVolume?.toLocaleString()} {selectedCurrency.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center my-6">
        <ChartContainer
          className="w-[75vw] h-[50vh] p-4"
        >
          <ChartDisplay data={coin.chart} />
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
    </div>
  );
}

export default CoinDetail;
