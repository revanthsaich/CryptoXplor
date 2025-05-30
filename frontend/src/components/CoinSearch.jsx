import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Loader from './Loader';

const CoinSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allCoins, setAllCoins] = useState([]); // ✅ store all coins
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Fetch all coins once on mount
  useEffect(() => {
    const fetchAllCoins = async () => {
      try {
        const res = await fetch('https://crypto-xplor.vercel.app/market/list-all/');
        // const res = await fetch('http://localhost:5000/market/list-all/');
        const coins = await res.json();
        // console.log(coins);
        setAllCoins(coins);
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCoins();
  }, []);

  // ✅ Filter coins locally
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 1) {
        const filtered = allCoins.filter((coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allCoins]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/coin/${searchQuery.toLowerCase()}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a coin (e.g., Bitcoin, BTC, ETH...)"
            className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
        </div>

        {isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-center px-4 py-3">
              <Loader size="sm" />
              <span className="ml-2 text-sm text-gray-500">Loading coins...</span>
            </div>
          </div>
        )}

        {suggestions.length > 0 && !isLoading && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg dark:bg-gray-800 dark:border-gray-700 max-h-60 overflow-auto">
            {suggestions.map((coin) => (
              <li
                key={coin.id}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => {
                  setSearchQuery(coin.id);
                  navigate(`/coin/${coin.id}`);
                }}
              >
                <div className="flex items-center">
                  <img src={coin.image} alt={coin.name} className="w-5 h-5 mr-2" />
                  <span className="font-medium">{coin.name}</span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                    {coin.symbol.toUpperCase()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default CoinSearch;
