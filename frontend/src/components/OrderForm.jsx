import React, { useState } from 'react';
import api from '../utils/api';
import { PlusCircleIcon, MinusCircleIcon } from 'lucide-react';
import { showSuccessToast, showErrorToast } from '../utils/toast';
import { useOrders } from '../contexts/OrderContext';

const OrderForm = ({ coinId, price, symbol, selectedCurrency }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { addOrder } = useOrders();

  const handleBuy = async () => {
    try {
      setLoading(true);
      const order = {
        coinId,
        symbol,
        selectedCurrency,
        type: 'buy',
        quantity,
        price,
        userId: window.Clerk.user?.id
      };

      await addOrder(order);
      showSuccessToast('Order placed successfully!');
    } catch (error) {
      console.error('Error placing buy order:', error);
      showErrorToast('Error placing buy order');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="rounded-2xl border-primary/50 dark:border-primary/30 bg-white dark:bg-slate-900 p-5 shadow-sm w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-medium">Trade {symbol?.toUpperCase()}</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary/50"
              min="0.0001" 
              step="0.0001"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price
            </label>
            <input
              type="text"
              value={price?.toLocaleString()}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleBuy}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Buy
          </button> 
        </div>
      </div>
    </div>
  );
};

export default OrderForm;