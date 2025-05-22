import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import { ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { fetchCoins } from '../utils/coinGeckoSlice';

const TrendingSidebar = () => {
  const dispatch = useDispatch();
  const trendingCoins = useSelector(state => state.coinGecko.trending);
  const loading = useSelector(state => state.coinGecko.loading);

  useEffect(() => {
    dispatch(fetchCoins('trending'));
  }, [dispatch]);

  if (loading) {
    return <div className="p-4 flex justify-center items-center">Loading trending coins... <Loader size="sm" className="ml-2" /></div>;
  }

  if (!trendingCoins) {
    return <div className="p-4">No trending coins available</div>;
  }

  return (
    <div className="left-0 top-16 w-66  overflow-x-hidden h-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Trending Coins
        </h2>
        <div className="space-y-2">
          {trendingCoins.map((coin) => (
            <Link
              key={coin.id}
              to={`/coin/${coin.id}?timeline=7d`}
              className="flex gap-[2em] items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <span className="font-medium">{coin.name}</span>
                  <br />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{coin.symbol.toUpperCase()}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <span className="text-sm font-medium">
                  ${coin.current_price.toLocaleString()}
                </span>
                <div className={`flex items-center text-sm ${
                  coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  <span>{coin.price_change_percentage_24h.toFixed(2)}%</span>
                  <span className="ml-1">
                    {coin.price_change_percentage_24h > 0 ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;
