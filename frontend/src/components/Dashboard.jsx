import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { FaMapMarkerAlt, FaWallet } from "react-icons/fa";
import { useOrders } from "../contexts/OrderContext";
import Loader from "./Loader";
import { ClockIcon, CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';

export function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const { orders: allOrders, loading: ordersLoading, addOrder } = useOrders();
  const { user: clerkUser } = useUser();
  
  // Show only 4 orders by default, or all if showAllOrders is true
  const orderHistory = showAllOrders ? allOrders : allOrders.slice(0, 4);
  
  // Load region
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRegion("India"); // Using a static value for now
      setLoading(false);
    }, 1000);
  }, []);
  
  // Load order history
  useEffect(() => {
    // Orders are now managed by OrderContext
    // No need for manual API call
  }, [ordersLoading]);
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="container flex flex-col mx-auto p-4 sm:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 transition-colors duration-200">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <img
              src={clerkUser?.imageUrl || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full rounded-full object-cover border-4 border-primary-100 dark:border-primary-900"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 dark:bg-green-400 rounded-full w-6 h-6 border-2 border-white dark:border-gray-800 flex items-center justify-center">
              <span className="text-xs text-white">✓</span>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              {clerkUser?.fullName || "Guest User"}
            </h2>
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
              <FaMapMarkerAlt className="text-lg" />
              <p>{region || "Loading location..."}</p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{clerkUser?.username || "username"}
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaWallet className="text-xl text-primary-600 dark:text-primary-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Wallet Address</span>
              </div>
              <p className="font-medium truncate text-gray-800 dark:text-gray-200">
                {clerkUser?.walletAddress || "Not connected"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 w-full transition-colors duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order History</h2>
            {allOrders.length > 4 && (
              <button 
                onClick={() => setShowAllOrders(!showAllOrders)}
                className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                {showAllOrders ? 'Show Less' : `View All (${allOrders.length})`}
              </button>
            )}
          </div>
          <div className="space-y-4">
            {orderHistory.map((order) => {
              const isBuy = order.type === 'buy';
              const currentPrice = order.price;
              const pnl = isBuy 
                ? ((currentPrice - order.price) * order.quantity).toFixed(2)
                : ((order.price - currentPrice) * order.quantity).toFixed(2);
              
              const statusIcon = order.status === 'completed' ? (
                <CheckCircle2Icon className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircleIcon className="w-4 h-4 text-yellow-500" />
              );
              
              return (
                <div key={order._id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-lg font-semibold ${order.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {order.type === 'buy' ? 'Bought' : 'Sold'} {order.quantity}
                        </p>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {order.coinId.charAt(0).toUpperCase() + order.coinId.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {statusIcon}
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </p>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <p className="text-gray-500 dark:text-gray-400">
                          Created: {new Date(order.createdAt).toLocaleString()}
                        </p>
                        {order.completedAt && (
                          <p className="text-gray-500 dark:text-gray-400">
                            Completed: {new Date(order.completedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                        <p className={`text-lg font-semibold ${isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {parseFloat(order.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {parseFloat(order.totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${pnl >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        <span>{pnl >= 0 ? '↑' : '↓'}</span>
                        <span>{pnl >= 0 ? '+' : ''}{pnl} USD</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          ({(pnl / order.totalCost * 100).toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
