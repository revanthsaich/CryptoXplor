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

  if (!loading && !trendingCoins) {
    return null;
  }

  return (
    <div className="md:w-64 h-full w-full max-w-full md:max-w-[16rem] border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hidden md:block">
      <div className="p-4 overflow-y-auto max-h-[80vh]">
        <h2 className="text-lg font-bold mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Trending Coins
        </h2>

        {loading ? (
          <div className="flex justify-center items-center">Loading trending coins... <Loader size="sm" className="ml-2" /></div>
        ) : (
          trendingCoins.map(coin => (
            <Link
              key={coin.id}
              to={`/coin/${coin.id}?timeline=7d`}
              className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{coin.name} ({coin.symbol.toUpperCase()})</div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>${coin.current_price.toLocaleString()}</span>
                    <span className={`flex items-center ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                      {coin.price_change_percentage_24h > 0 ? (
                        <ArrowUp className="w-3 h-3 ml-1" />
                      ) : (
                        <ArrowDown className="w-3 h-3 ml-1" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TrendingSidebar;
