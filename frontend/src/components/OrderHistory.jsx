import React, { useState } from 'react';
import { CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { Button } from './ui/button';

const OrderHistory = ({ price, selectedCurrency, symbol }) => {
  const [visibleOrders, setVisibleOrders] = useState(4); // Show 4 orders by default
  const { 
    orders: allOrders, 
    loading, 
    sellOrder: contextSellOrder,
  } = useOrders();
  const [sellingOrderId, setSellingOrderId] = useState(null);
  
  // Sort orders by creation date (newest first)
  const orders = [...allOrders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleSell = async (order) => {
    try {
      setSellingOrderId(order._id);
      await contextSellOrder(
        order._id, 
        order.quantity, 
        order.price, 
        order.coinId, 
        order.selectedCurrency || selectedCurrency
      );
    } finally {
      setSellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-5">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-primary/50 dark:border-primary/30 bg-white dark:bg-slate-900 p-5 shadow-sm w-full">
      <h2 className="text-xl font-medium mb-4">Order History</h2>
      <div className="space-y-4">
        {orders.slice(0, visibleOrders).map((order) => {
          const isBuy = order.type === 'buy';
          const statusIcon = order.status === 'completed' ? (
            <CheckCircle2Icon key="completed-icon" className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircleIcon key="pending-icon" className="w-4 h-4 text-yellow-500" />
          );
          
          return (
            <div key={order._id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-lg font-semibold ${isBuy ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isBuy ? 'Bought' : 'Sold'} {order.quantity} {order.symbol?.toUpperCase() || symbol?.toUpperCase()}
                    </p>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {order.selectedCurrency?.toUpperCase() || selectedCurrency?.toUpperCase() || 'USD'}
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
                    {order.completedAt && order.status === 'completed' && (
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
                        currency: order.selectedCurrency || selectedCurrency || 'USD',
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
                        currency: order.selectedCurrency || selectedCurrency || 'USD',
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </p>
                    {order.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-xs bg-red-500 text-white"
                        onClick={() => handleSell(order)}
                        disabled={sellingOrderId === order._id}
                      >
                        {sellingOrderId === order._id ? 'Selling...' : 'Sell'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {orders.length > 4 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setVisibleOrders(prev => prev === 4 ? orders.length : 4)}
            className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {visibleOrders === 4 ? 'Show All Orders' : 'Show Less'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
