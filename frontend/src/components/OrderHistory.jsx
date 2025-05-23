import React, { useEffect, useState } from 'react';
import { ClockIcon } from 'lucide-react';
import api from '../utils/api';
const OrderHistory = ({ price, selectedCurrency, symbol }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        console.log('Fetched orders:', response.data);
        setOrders(response.data); // Directly use response.data
      } catch (error) {
        console.error('Error fetching orders:', error.message || error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, []);
  
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
          
          return (
            <div key={order._id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {isBuy ? ' Bought ' : ' Sold '} {order.quantity} {symbol?.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-medium ${isBuy ? 'text-green-500' : 'text-red-500'}`}>
                    {order.price.toLocaleString()}
                  </p>
                  <div className={`flex items-center gap-2 ${pnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    <ClockIcon className="w-4 h-4" />
                    <p>{pnl > 0 ? '+' : ''}{pnl}{selectedCurrency.toUpperCase()}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
