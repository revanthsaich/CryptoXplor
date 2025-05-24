import React from 'react';
import { ClockIcon, CheckCircle2Icon, AlertCircleIcon } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';

const OrderHistory = ({ price, selectedCurrency, symbol }) => {
  const { orders, loading } = useOrders();

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
        {orders.map((order) => {
          const isBuy = order.type === 'buy';
          const currentPrice = price;
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {isBuy ? ' Bought ' : ' Sold '} {order.quantity} {symbol?.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2">
                    {statusIcon}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-medium ${isBuy ? 'text-green-500' : 'text-red-500'} text-right`}
                    title={`Total Cost: ${order.totalCost.toLocaleString()}`}
                  >
                    {order.price.toLocaleString()}
                  </p>
                  <div className={`flex items-center gap-2 ${pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <ClockIcon className="w-4 h-4" />
                    <p>{pnl > 0 ? '+' : ''}{pnl}{selectedCurrency.toUpperCase()}</p>
                  </div>
                </div>
              </div>
              {order.holdings > 0 && (
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Holdings: {order.holdings} {symbol?.toUpperCase()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
