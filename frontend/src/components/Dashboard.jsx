import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { FaMapMarkerAlt, FaWallet, FaEthereum } from "react-icons/fa";
import { useOrders } from "../contexts/OrderContext";
import Loader from "./Loader";
import { CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { ethers } from "ethers";

export function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("0");
  const [isConnecting, setIsConnecting] = useState(false);
  const { orders: allOrders, loading: ordersLoading, addOrder } = useOrders();
  const { user: clerkUser } = useUser();
  
  // Check if Web3 is available on component mount
  useEffect(() => {
    checkIfWalletIsConnected();
    // Set up event listener for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          getAccountBalance(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      setWalletAddress("");
      setEthBalance("0");
    } else {
      setWalletAddress(accounts[0]);
      getAccountBalance(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      setWalletAddress(accounts[0]);
      getAccountBalance(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const getAccountBalance = async (account) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      setEthBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Sort orders by creation date (newest first) and limit to 4 if not showing all
  const orderHistory = [...allOrders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, showAllOrders ? allOrders.length : 4);
  
  // Load region
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRegion("India"); // Using a static value for now
      setLoading(false);
    }, 1000);
  }, []);
  
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
            {walletAddress && (
              <div className="absolute bottom-0 right-0 bg-green-500 dark:bg-green-400 rounded-full w-6 h-6 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <span className="text-xs text-white">✓</span>
              </div>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900 dark:text-white">
              {clerkUser?.emailAddresses?.[0]?.emailAddress || walletAddress || "User"}
            </h2>
            <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300">
              <FaMapMarkerAlt className="text-lg" />
              <p>{region || "Loading location..."}</p>
            </div>
            {walletAddress && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {`${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`}
              </p>
            )}
          </div>

          {/* Wallet Balance Card */}
          <div className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700 p-5 rounded-lg text-white">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FaEthereum className="text-2xl" />
                <div>
                  <p className="text-sm font-medium text-indigo-100">Wallet Balance</p>
                  <p className="text-2xl font-bold">
                    {parseFloat(ethBalance).toFixed(4)} ETH
                  </p>
                  <p className="text-xs text-indigo-100">
                    {walletAddress ? 
                      `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : 
                      "Not connected"}
                  </p>
                </div>
              </div>
              {!walletAddress ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50"
                >
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) : (
                <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  Connected
                </div>
              )}
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
                className="text-sm font-medium bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-400 dark:hover:bg-gray-300 transition-colors"
              >
                {showAllOrders ? 'Show Less' : `View All (${allOrders.length})`}
              </button>
            )}
          </div>
          <div className="space-y-4">
            {orderHistory.map((order) => {
              const isBuy = order.type === 'buy';
              const statusIcon = order.status === 'completed' ? (
                <CheckCircle2Icon className="w-4 h-4 text-green-500" key="completed-icon" />
              ) : (
                <AlertCircleIcon className="w-4 h-4 text-yellow-500" key="pending-icon" />
              );
              
              return (
                <div key={order._id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={`text-lg font-semibold ${order.type === 'buy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {order.type === 'buy' ? 'Bought' : 'Sold'} {order.quantity} {order.symbol?.toUpperCase() || order.coinId.toUpperCase()}
                          </p>
                          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            {order.selectedCurrency?.toUpperCase() || 'USD'}
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
                            {parseFloat(order.price).toLocaleString(undefined, { 
                              style: 'currency',
                              currency: order.selectedCurrency || 'USD',
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 8 
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {parseFloat(Math.abs(order.totalCost)).toLocaleString(undefined, { 
                              style: 'currency',
                              currency: order.selectedCurrency || 'USD',
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })}
                          </p>
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
