import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoins } from "../utils/coinGeckoSlice";
import CoinList from "./CoinList";

function MarketSection() {
  const [activeTab, setActiveTab] = useState("topGainers");

  const dispatch = useDispatch();
  const { topGainers, trending, newCoins, loading, error } = useSelector(
    (state) => state.coinGecko
  );

  const dataMap = {
    topGainers,
    trending,
    newCoins,
  };

  useEffect(() => {
    if (!dataMap[activeTab]) {
      dispatch(fetchCoins(activeTab));
    }
  }, [activeTab, dataMap, dispatch]);

  return (
    <div className="w-full h-auto max-w-8xl mx-auto px-4 py-10">
      <div className="bg-white/2 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 min-h-[600px] flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow">
          {/* Tabs Header */}
          <TabsList className="mx-auto w-fit h-14 mb-6 bg-gray-900/60 backdrop-blur-sm rounded-xl px-4 flex gap-1 border border-gray-200">
            {[
              { id: "topGainers", label: "Top Gainers" },
              { id: "trending", label: "Trending" },
              { id: "newCoins", label: "New Coins" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`text-sm h-10 font-medium px-5 rounded-lg transition-colors duration-300
        ${activeTab === tab.id
                    ? "bg-gray-700 text-white shadow-lg"
                    : "bg-transparent text-white hover:text-white"
                  }`}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>


          {/* Tabs Content */}
          {["topGainers", "trending", "newCoins"].map((tab) => (
            <TabsContent
              key={tab}
              value={tab}
              className={`flex-grow transition-opacity duration-300 ${activeTab === tab ? "block" : "hidden"
                }`}
            >
              {loading && activeTab === tab ? (
                <p className="text-center text-gray-300">Loading...</p>
              ) : error ? (
                <p className="text-center text-red-400">Error: {error}</p>
              ) : (
                <div className="w-full">
                  <CoinList coins={dataMap[tab]} />
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default MarketSection;
