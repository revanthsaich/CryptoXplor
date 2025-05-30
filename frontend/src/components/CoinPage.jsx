import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCoins } from '../redux/coinsSlice';
import CoinSearch from './CoinSearch';
import Loader from './Loader';

const CoinPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { coins, loading, hasMore } = useSelector((state) => state.coins);

  useEffect(() => {
    // Initial load
    if (coins.length === 0) {
      dispatch(fetchCoins(1));
    }
  }, [dispatch, coins.length]);

  const handleShowMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchCoins(1)); // The page is managed in the Redux slice
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      <div className="mb-8">
        <CoinSearch />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {coins.map((coin) => (
          <div
            key={coin.id}
            onClick={() => navigate(`/coin/${coin.id}`)}
            className="p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <img src={coin.image} alt={coin.name} className="w-10 h-10" />
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {coin.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 uppercase">
                  {coin.symbol}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xl font-semibold">
                ${coin.current_price?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || 'N/A'}
              </p>
              <p
                className={`font-medium ${
                  coin.price_change_percentage_24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                24h: {coin.price_change_percentage_24h >= 0 ? '↑' : '↓'}{' '}
                {Math.abs(coin.price_change_percentage_24h)?.toFixed(2)}%
              </p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-6">
          <Loader size="md" />
        </div>
      )}

      {!loading && hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default CoinPage;