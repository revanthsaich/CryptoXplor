import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins } from "../utils/coinGeckoSlice";
import CoinList from "./CoinList";
import Loader from './Loader';

function MarketSection() {
  const [activeTab, setActiveTab] = useState("topGainers");

  const dispatch = useDispatch();
  const { topGainers, trending, newCoins, loading, error } = useSelector(
    (state) => state.coinGecko,
    (prev, next) => {
      // Only re-render if the actual data changes
      return prev.topGainers === next.topGainers &&
             prev.trending === next.trending &&
             prev.newCoins === next.newCoins;
    }
  );

  const dataMap = {
    topGainers,
    trending,
    newCoins,
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!dataMap[activeTab] && !loading) {
        dispatch(fetchCoins(activeTab));
      }
    };

    fetchData();
  }, [activeTab, dataMap, dispatch]);

  return (
    <div className="w-full h-auto max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
      <div className="w-auto rounded-2xl p-5 md:p-6 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex w-auto flex-col">
          <TabsList className="w-full h-auto mb-6 rounded-xl px-4 flex flex-col md:flex-row gap-1 backdrop-blur-sm">
            {[
              { id: "topGainers", label: "Top Gainers" },
              { id: "trending", label: "Trending" },
              { id: "newCoins", label: "New Coins" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`text-sm h-12 md:h-10 font-medium px-4 sm:px-5 rounded-lg transition-all duration-300 w-full md:w-auto
        ${activeTab === tab.id
                    ? "bg-gray-700 text-white shadow-lg ring-1 ring-gray-700/50"
                    : "bg-gray-800/50 backdrop-blur-sm border border-gray-700/20 text-gray hover:text-white"
                  }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {[
            "topGainers", "trending", "newCoins"].map((tab) => (
            <TabsContent
              key={tab}
              value={tab}
              className={`w-full flex-grow transition-opacity duration-300 ${activeTab === tab ? "block" : "hidden"
                }`}
            >
              <div className="w-full flex-grow">
                {loading && activeTab === tab ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader size="md" className="mb-2" />
                    <p className="text-center text-gray-300">Loading...</p>
                  </div>
                ) : error ? (
                  <p className="text-center text-red-400">Error: {error}</p>
                ) : (
                  <div className="w-full">
                    <CoinList coins={dataMap[tab]} />
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default MarketSection;
